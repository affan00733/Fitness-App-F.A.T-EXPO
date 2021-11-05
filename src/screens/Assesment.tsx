import React, {useLayoutEffect, useState, useEffect} from 'react';
import {FlatList, TouchableOpacity,ScrollView} from 'react-native';

import {useNavigation} from '@react-navigation/core';
import {useHeaderHeight} from '@react-navigation/stack';

import {useTheme} from '../hooks/';
import {Block, Button, Input, Image, Switch, Modal, Text} from '../components/';
import {Video, AVPlaybackStatus} from 'expo-av';
import * as firebase from 'firebase';

const Components = () => {
  const {assets, colors, gradients, sizes} = useTheme();
  const navigation = useNavigation();
  const headerHeight = useHeaderHeight();
  const [assessment, setAssessment] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // onAuthStateChanged returns an unsubscriber
    const unsubscribeAuth = firebase
      .auth()
      .onAuthStateChanged(async (authenticatedUser) => {
        try {
          await (authenticatedUser ? authenticatedUser : null);
          // console.log("authenticatedUser",authenticatedUser);
          if (authenticatedUser) {
            console.log(
              'user logged in results',
              authenticatedUser.providerData[0].phoneNumber,
            );
            await firebase
              .firestore()
              .collection('assesment')
              .get()
              .then((snapshot) => {
                let data = [];
                snapshot.docs.forEach((doc) => {
                  //  console.log(doc.data());
                  data.push(doc.data());
                });
                const res = data.filter(
                  (x) =>
                    x.phone == authenticatedUser.providerData[0].phoneNumber,
                );
                res.sort((a, b) =>
                  a.timpestamp.seconds > b.timpestamp.seconds
                    ? 1
                    : b.timpestamp.seconds > a.timpestamp.seconds
                    ? -1
                    : 0,
                );

                console.log(res.length);

                setAssessment(res);
              });
            setUser(authenticatedUser.providerData[0].phoneNumber);
          } else {
            console.log('user not there');
          }
        } catch (error) {
          console.log(error);
        }
      });

    // unsubscribe auth listener on unmount
    return unsubscribeAuth;
    console.log('unsubscribeAuth', user);
  }, []);

  // useEffect(() => {
  //   async function getAssesmnet() {
  //     await firebase
  //       .firestore()
  //       .collection('assesment')
  //       .get()
  //       .then((snapshot) => {
  //         let data = [];
  //         snapshot.docs.forEach((doc) => {
  //           // console.log(doc.data());
  //           data.push(doc.data());
  //         });
  //         const res = data.filter((x) => x.phone == user);
  //         console.log(res.length);

  //         setAssessment(res);
  //       });
  //   }
  //   getAssesmnet();
  //   console.log(assessment);
  // }, []);

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

  return (
    <Block safe>
      <FlatList
        initialNumToRender={assessment.length}
        data={assessment}
        showsVerticalScrollIndicator={false}
        keyExtractor={(item, index) => `${index}`}
        // style={{paddingHorizontal: sizes.padding}}
        // contentContainerStyle={{paddingBottom: sizes.l}}
        renderItem={({item}) => {
          // console.log('data', assessment);

          return (
            <TouchableOpacity
              onPress={() => {
                console.log('preeeeesed');
                navigation.navigate('Results', {
                  data: item,
                });
              }}>
              <Block scroll showsVerticalScrollIndicator={false}>
                <Block>
                  <Block marginTop={sizes.m} paddingHorizontal={sizes.padding}>
                    {/* single card */}
                    <Block>
                      <Block card row>
                        {item.fileUrl == '' ? (
                          <Image
                            source={require('../assets/images/live-workouts-without-touch-1591787914.gif')}
                            style={{
                              alignSelf: 'center',
                              width: 110,
                              height: 110,
                              borderRadius: 10,
                            }}
                          />
                        ) : item.type == 'image' ? (
                          <Image
                            source={{
                              uri: item.fileUrl,
                            }}
                            style={{
                              alignSelf: 'center',
                              width: 110,
                              height: 110,
                              borderRadius: 10,
                            }}
                          />
                        ) : (
                          <Video
                            style={{
                              alignSelf: 'center',
                              width: 110,
                              height: 110,
                              // borderWidth: 1,
                              borderRadius: 10,
                            }}
                            source={{
                              uri: item.fileUrl,
                            }}
                            // useNativeControls
                            volume={0.0}
                            shouldPlay={true}
                            resizeMode="contain"
                            isLooping
                          />
                        )}

                        <Block padding={sizes.s} justify="space-between">
                          <Text p bold tertiary>
                            {new Date(item.timpestamp.seconds * 1000)
                              .toGMTString()
                              .slice(0, 16)}
                            {/* {item.timpestamp.seconds} */}
                          </Text>
                          <Block row align="center">
                            <Text
                              p
                              semibold
                              marginRight={sizes.s}
                              color={colors.link}>
                              {item.workout}
                            </Text>
                          </Block>
                          <Block row align="center">
                            <Text
                              p
                              semibold
                              marginRight={sizes.s}
                              color={colors.danger}>
                              {item.score !== ''
                                ? item.score + '%'
                                : 'unavailable'}
                            </Text>
                          </Block>
                          <Block row align="center">
                            <Text
                              p
                              semibold
                              marginRight={sizes.s}
                              color={colors.info}>
                              {item.mode}
                            </Text>
                          </Block>
                        </Block>
                      </Block>
                    </Block>
                  </Block>
                </Block>
              </Block>
            </TouchableOpacity>
          );
        }}
      />
    </Block>
  );
};

export default Components;
