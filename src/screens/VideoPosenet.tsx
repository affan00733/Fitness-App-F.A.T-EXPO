import React, {useLayoutEffect, useEffect, useState, useRef} from 'react';
import {
  FlatList,
  TouchableOpacit,
  View,
  ActivityIndicator,
  Dimensions,
  StyleSheet,
} from 'react-native';

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
  const [loopStarted, setLoopStarted] = useState(false);
  const TensorCamera = cameraWithTensors(Camera);
  let requestAnimationFrameId = 0;
  const [click, setClick] = useState(false);

  //performance hacks (Platform dependent)
  const textureDims = {width: 1600, height: 1200};
  const tensorDims = {width: 200, height: 200};
  let cameraLoopStarted = false;
  let count = 0;
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
  const getPrediction = async (tensor) => {
    if (!tensor || !posenetModel) return;

    const t0 = performance.now();
    // TENSORFLOW MAGIC HAPPENS HERE!
    const pose = await posenetModel.estimateSinglePose(tensor, 0.5, true, 16); // cannot have async function within tf.tidy
    // console.log((performance.now() - t0));

    if (!pose) return;
    if (click) {
      console.log('user', user);

      count += 1;
      console.log('count', count);

        if(count ==10){
                  console.log('new count', count);

      let cal = 0;

      if (
        pose.keypoints[0].position.y > 70 &&
        pose.keypoints[0].position.y < 350
      ) {
        cal = ((pose.keypoints[0].position.y / 350) * 100).toFixed(2);
      }
              console.log(cal, pose.keypoints[0].position.y);

          let d = new Date();

      await firebase
        .firestore()
        .collection('auth')
        .doc(user)
        .get()
        .then(async (data) => {
          console.log('email', data.data());
          firebase.firestore().collection('assesment').add({
            phone: user,
            type: 'video',
            workout: route.params.data,
            fileUrl: "",
            timpestamp: d,
            score: cal,
            mode: 'automatic',
            email: data.data().email,
          });
        });

        navigation.navigate("Home")
    }
      if (count % 10 == 0) {
        setClick(false);
      }
    }

    var numTensors = tf.memory().numTensors;
    // drawSkeleton(pose);
  };
  const handleCameraStream = (imageAsTensors) => {
    if (cameraLoopStarted) return; // guarantees that the image loop only runs once
    cameraLoopStarted = true;
    const loop = async () => {
      if (frameworkReady) {
        const nextImageTensor = await imageAsTensors.next().value;
        await getPrediction(nextImageTensor);
        nextImageTensor.dispose();
      }
      requestAnimationFrameId = requestAnimationFrame(loop);
    };
    loop();
  };

  // https://js.tensorflow.org/api_react_native/0.2.1/#cameraWithTensors
  const renderCameraView = () => {
    return (
      <View style={styles.cameraView}>
        <TensorCamera
          style={styles.camera}
          type={Camera.Constants.Type.front}
          zoom={0}
          cameraTextureHeight={textureDims.height}
          cameraTextureWidth={textureDims.width}
          resizeHeight={tensorDims.height}
          resizeWidth={tensorDims.width}
          resizeDepth={3}
          onReady={(imageAsTensors) => handleCameraStream(imageAsTensors)}
          autorender={true}
        />
      </View>
    );
  };
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

  const uploadImage = async (uri) => {};

  // social example
  const Social = () => {
    const {sizes} = useTheme();

    return (
      <Block paddingVertical={sizes.m} paddingHorizontal={sizes.padding}>
        <Block row justify="space-evenly">
          {/* {renderCameraView()} */}
          <Button
            onPress={() => {
              setClick(true);
            }}
            social="dribbble"
          />
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
                // paddingLeft={sizes.m}
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
                    Video Automatic Assesment - POSENET
                  </Text>
                </Button>
                {/* <Image
                  source={{uri: file}}
                  style={{
                    alignSelf: 'center',
                    width: 320,
                    height: 400,
                    borderWidth: 1,
                  }}
                /> */}
                <View style={styles.body}>{renderCameraView()}</View>
                <Social />
              </Image>
            </Block>
          </Block>

          <Text>{'poseVal'}</Text>
        </Block>
      </Block>
    </Block>
  );
};

const CAM_WIDTH = Dimensions.get('window').width;
const CAM_HEIGHT = (CAM_WIDTH * 4) / 3;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    paddingTop: Constants.statusBarHeight,
    // backgroundColor: "red"
  },
  body: {},
  cameraView: {
    width: CAM_WIDTH,
    height: CAM_HEIGHT,
  },
  camera: {
    width: '100%',
    height: '100%',
    zIndex: 1,
  },
  canvas: {
    width: CAM_WIDTH,
    height: CAM_HEIGHT,
    zIndex: 1,
    position: 'absolute',
  },
});

export default Manual;
