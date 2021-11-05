import React, {useLayoutEffect, useEffect, useState, useRef} from 'react';
import {FlatList, TouchableOpacit, View, ActivityIndicator} from 'react-native';

import {useNavigation} from '@react-navigation/core';
import {useHeaderHeight} from '@react-navigation/stack';
import {useRoute} from '@react-navigation/native';

import {useTheme} from '../hooks';
import {Block, Button, Input, Image, Switch, Modal, Text} from '../components';

import * as firebase from 'firebase';
import Constants from 'expo-constants';

// camera
import {Camera} from 'expo-camera';

// tensorflow
import * as tf from '@tensorflow/tfjs';
import * as posenet from '@tensorflow-models/posenet';
import * as ImagePicker from 'expo-image-picker';

import {
  cameraWithTensors,
  fetch as tensorFetch,
  decodeJpeg,
} from '@tensorflow/tfjs-react-native';

const Manual = () => {
  const auth = firebase.auth();
  const [user, setUser] = useState(null);
  const route = useRoute();

  const {assets, sizes, gradients, colors} = useTheme();
  const navigation = useNavigation();
  const headerHeight = useHeaderHeight();
  const [image, setImage] = useState(null);
  const [posenetModel, setPosenetModel] = useState(null);
  const [frameworkReady, setFrameworkReady] = useState(false);
  const [file, setFile] = useState('');
  const [poseVal, setPoseVal] = useState();

  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (!frameworkReady) {
      (async () => {
        // check permissions
        const {status} = await Camera.requestPermissionsAsync();
        console.log(`permissions status: ${status}`);

        // we must always wait for the Tensorflow API to be ready before any TF operation...
        await tf.ready();
        console.log('TF is ready');

        // load the mobilenet model and save it in state
        setPosenetModel(
          await posenet.load({
            architecture: 'MobileNetV1',
            outputStride: 16,
            multiplier: 0.5,
            quantBytes: 2,
          }),
        );
        console.log('Posenet model loaded');

        setFrameworkReady(true);
      })();
    }
  }, []);
  useEffect(() => {
    // onAuthStateChanged returns an unsubscriber
    const unsubscribeAuth = auth.onAuthStateChanged(
      async (authenticatedUser) => {
        try {
          await (authenticatedUser ? authenticatedUser : null);
          // console.log("authenticatedUser",authenticatedUser);
          if (authenticatedUser) {
            console.log(
              'user logged in manual aaa',
              authenticatedUser.providerData[0].phoneNumber,
            );
            setUser(authenticatedUser.providerData[0].phoneNumber);
          } else {
            console.log('user not there');
          }
        } catch (error) {
          console.log(error);
        }
      },
    );

    // unsubscribe auth listener on unmount
    return unsubscribeAuth;
    console.log('unsubscribeAuth', user);
  }, []);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerBackground: () => (
        <Image
          radius={0}
          resizeMode="cover"
          width={sizes.width}
          height={headerHeight}
          source={assets.header}
        />
      ),
    });
  }, [assets.header, navigation, sizes.width, headerHeight]);
  const getPredictionImage = async (url) => {
    if (!posenetModel) return;

    console.log('posenet called');

    // const imageUri = "https://images.unsplash.com/photo-1499750310107-5fef28a66643?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"
    const imageUri = url;

    // const imageAssetPath = Image.resolveAssetSource(imageUri);
    const response = await tensorFetch(imageUri, {}, {isBinary: true});
    const imageDataArrayBuffer = await response.arrayBuffer();
    const imageData = new Uint8Array(imageDataArrayBuffer);
    const imageTensor = decodeJpeg(imageData);

    const pose = await posenetModel.estimateSinglePose(
      imageTensor,
      0.5,
      true,
      16,
    ); // cannot have async function within tf.tidy
    if (!pose) return;

    console.log('pose', pose.keypoints[0]);
    // setPose(pose.keypoints[0].position.y);
    var numTensors = tf.memory().numTensors;

    return pose.keypoints[0].position.y;
    // console.log(numTensors)
  };
  const uploadImage = async (uri) => {
    const response = await fetch(uri);
    const blob = await response.blob();
    let d = new Date();
    var ref = await firebase
      .storage()
      .ref()
      .child(`${route.params.data}/${user}_${d}`)
      .put(blob);

    await firebase
      .storage()
      .ref(`${route.params.data}/${user}_${d}`)
      .getDownloadURL()
      .then(async (url) => {
        // Do something with the URL ...
        console.log(url);
        let pose = await getPredictionImage(url);
        setFile(url);
        console.log('pose', pose);
        let cal = 0;
        if (pose <= 300) {
          cal = (pose / 300) * 100;
          cal = cal.toFixed(2);
          // console.log(cal.toFixed(2));
        }
        setPoseVal(cal)
        await firebase
          .firestore()
          .collection('auth')
          .doc(user)
          .get()
          .then(async (data) => {
            console.log('email', data.data());
            firebase.firestore().collection('assesment').add({
              phone: user,
              type: 'image',
              workout: route.params.data,
              fileUrl: url,
              timpestamp: d,
              score: cal,
              mode: 'automatic',
              email: data.data().email,
            });
          });
      });
  };

  const handlerPick = async () => {
    console.log('picked');
    await setLoading(true);

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      //   allowsEditing: true,
      //   aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.cancelled) {
      setImage(result.uri);
      console.log('user', user);

      await uploadImage(result.uri);
      console.log(result.uri);

      alert('uploaded successfully');
    }
    // console.log(type);

    await setLoading(false);

    navigation.navigate('Home');
  };
  // social example
  const Social = () => {
    const {sizes} = useTheme();

    return (
      <Block paddingVertical={sizes.m} paddingHorizontal={sizes.padding}>
        <Block row justify="space-evenly">
          <Button onPress={handlerPick} social="dribbble" />
        </Block>
      </Block>
    );
  };

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          flexDirection: 'row',
          justifyContent: 'space-around',
          padding: 10,
        }}>
        <ActivityIndicator size={80} color="#0000ff" />
        {/* <ActivityIndicator size="large" color="#00ff00" /> */}
      </View>
    );
  }

  return (
    <Block safe>
      <Block
        scroll
        showsVerticalScrollIndicator={false}
        // contentContainerStyle={{paddingVertical: sizes.padding}}
      >
        <Block>
          <Block>
            <Block flex={0}>
              <Image
                background
                // resizeMode="cover"
                // padding={sizes.sm}
                paddingTop={sizes.m}
                justify="flex-start"
                paddingLeft={sizes.m}
                paddingBottom={240}
                radius={sizes.cardRadius}
                source={assets.background}>
                <Button
                  row
                  flex={0}
                  justify="flex-start"
                  onPress={() => navigation.goBack()}>
                  <Image
                    radius={0}
                    width={10}
                    height={18}
                    color={colors.white}
                    source={assets.arrow}
                    transform={[{rotate: '180deg'}]}
                  />
                  <Text p white marginLeft={sizes.s}>
                    {/* {t('profile.title')} */}
                    Image Automatic Assesment - POSENET
                  </Text>
                </Button>
                <Image
                  source={{uri: file}}
                  style={{
                    alignSelf: 'center',
                    width: 320,
                    height: 400,
                    borderWidth: 1,
                  }}
                />

                <Social />
              </Image>
            </Block>
          </Block>

          {/* <Text>{poseVal}</Text> */}
        </Block>
      </Block>
    </Block>
  );
};

export default Manual;
