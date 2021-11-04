import React, {useLayoutEffect, useEffect, useState, useRef} from 'react';
import {FlatList, TouchableOpacit, View, ActivityIndicator} from 'react-native';

import {useNavigation} from '@react-navigation/core';
import {useHeaderHeight} from '@react-navigation/stack';

import {useTheme} from '../hooks/';
import {Block, Button, Input, Image, Switch, Modal, Text} from '../components/';

import * as firebase from 'firebase';
import * as ImagePicker from 'expo-image-picker';
import {Video, AVPlaybackStatus} from 'expo-av';

const Manual = () => {
  const auth = firebase.auth();
  const [user, setUser] = useState(null);

  const {assets, sizes, gradients, colors} = useTheme();
  const navigation = useNavigation();
  const headerHeight = useHeaderHeight();
  const [image, setImage] = useState(null);
  const video = useRef(null);
  const [status, setStatus] = useState({});
  const [showModal, setModal] = useState(false);
  const [showModal2, setModal2] = useState(false);
  const [email, setEmail] = useState();
  const [file, setFile] = useState('');
  const [type, setType] = useState('image');
  const [workout, setWorkout] = useState('squats');

  const [loading, setLoading] = useState(false);
  useEffect(() => {
    (async () => {
      if (Platform.OS !== 'web') {
        const {status} =
          await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          alert('Sorry, we need camera roll permissions to make this work!');
        }
      }
    })();
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
              'user logged in manual',
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

  // useEffect(()=>{
  //   async function getEmail() {
  //     await firebase
  //     .firestore()
  //   .collection('auth')
  //   .doc(user)
  //   .get()
  //   .then((data) => {
  //       console.log("email",data.data());

  //     setEmail(data.data().email)
  //   })
  // }
  // getEmail()
  // },[email])

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

  const uploadImage = async (uri) => {
    const response = await fetch(uri);
    const blob = await response.blob();
    let d = new Date();
    var ref = await firebase
      .storage()
      .ref()
      .child(`${workout}/${user}_${d}`)
      .put(blob);

    await firebase
      .storage()
      .ref(`${workout}/${user}_${d}`)
      .getDownloadURL()
      .then(async(url) => {
        // Do something with the URL ...
        console.log(url);
        setFile(url);
         await firebase
           .firestore()
           .collection('auth')
           .doc(user)
           .get()
           .then(async(data) => {
             console.log('email', data.data());
             firebase.firestore().collection('assesment').add({
               phone: user,
               type: type,
               workout: workout,
               fileUrl: url,
               timpestamp: d,
               score: '',
               mode: 'manual',
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
      await uploadImage(result.uri);
      alert('uploaded successfully');
    }
    console.log(type);

    await setLoading(false);
    setModal(false);
    setModal2(false);
    // navigation.navigate("Home")
  };
  // social example
  const Social = () => {
    const {sizes} = useTheme();

    return (
      <Block paddingVertical={sizes.m} paddingHorizontal={sizes.padding}>
        <Text p semibold marginBottom={sizes.s}>
          Social
        </Text>
        <Block row justify="space-evenly" marginBottom={sizes.base}>
          <Modal visible={showModal} onRequestClose={() => setModal(false)}>
            <FlatList
              keyExtractor={(index) => `${index}`}
              data={['image', 'video']}
              renderItem={({item}) => (
                <Button
                  marginBottom={sizes.sm}
                  onPress={() => {
                    setType(item);
                    setModal(false);
                  }}>
                  <Text p white semibold transform="uppercase">
                    {item}
                  </Text>
                </Button>
              )}
            />
          </Modal>
          <Button
            flex={1}
            row
            gradient={gradients.dark}
            onPress={() => setModal(true)}>
            <Block
              row
              align="center"
              justify="space-between"
              paddingHorizontal={sizes.sm}>
              <Text white bold transform="uppercase" marginRight={sizes.sm}>
                {type}
              </Text>
              <Image
                source={assets.arrow}
                color={colors.white}
                transform={[{rotate: '90deg'}]}
              />
            </Block>
          </Button>
        </Block>
        <Block row justify="space-evenly" marginBottom={sizes.base}>
          <Modal visible={showModal2} onRequestClose={() => setModal2(false)}>
            <FlatList
              keyExtractor={(index) => `${index}`}
              data={['squats', 'push-ups', 'sit-ups', 'pull-ups', 'others']}
              renderItem={({item}) => (
                <Button
                  marginBottom={sizes.sm}
                  onPress={() => {
                    setWorkout(item);
                    setModal2(false);
                  }}>
                  <Text p white semibold transform="uppercase">
                    {item}
                  </Text>
                </Button>
              )}
            />
          </Modal>
          <Button
            flex={1}
            row
            gradient={gradients.dark}
            onPress={() => setModal2(true)}>
            <Block
              row
              align="center"
              justify="space-between"
              paddingHorizontal={sizes.sm}>
              <Text white bold transform="uppercase" marginRight={sizes.sm}>
                {workout}
              </Text>
              <Image
                source={assets.arrow}
                color={colors.white}
                transform={[{rotate: '90deg'}]}
              />
            </Block>
          </Button>
        </Block>
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
        contentContainerStyle={{paddingVertical: sizes.padding}}>
        <Block>
          {type === 'image' ? (
            <Image
              source={{uri: file}}
              style={{
                alignSelf: 'center',
                width: 320,
                height: 400,
                // borderWidth: 1,
              }}
            />
          ) : (
            <Video
              ref={video}
              style={{
                alignSelf: 'center',
                width: 320,
                height: 400,
                // borderWidth: 1,
              }}
              source={{
                uri: file,
              }}
              useNativeControls
              resizeMode="contain"
              isLooping
              onPlaybackStatusUpdate={(status) => setStatus(() => status)}
            />
          )}

          <Social />
        </Block>
      </Block>
    </Block>
  );
};

export default Manual;
