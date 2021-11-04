import React, {useCallback, useEffect, useState} from 'react';
import {Platform, Linking, View} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {useNavigation} from '@react-navigation/core';
import {useRoute} from '@react-navigation/native';
import * as firebase from 'firebase';
import {Block, Button, Image, Text} from '../components/';
import {useData, useTheme, useTranslation} from '../hooks/';

const isAndroid = Platform.OS === 'android';

const Profile = () => {
  const {t} = useTranslation();
  const route = useRoute();
  const auth = firebase.auth();
  const [user, setUser] = useState();

  const [event, setEvent] = useState({});
  const [start, setStart] = useState();
  const [end, setEnd] = useState();
  const [participants, setParticipants] = useState([]);
  const [isParticpant, setIsParticpant] = useState();

  const navigation = useNavigation();
  const {assets, colors, sizes, gradients} = useTheme();

  const IMAGE_SIZE = (sizes.width - (sizes.padding + sizes.sm) * 2) / 3;
  const IMAGE_VERTICAL_SIZE =
    (sizes.width - (sizes.padding + sizes.sm) * 2) / 2;
  const IMAGE_MARGIN = (sizes.width - IMAGE_SIZE * 3 - sizes.padding * 2) / 2;
  const IMAGE_VERTICAL_MARGIN =
    (sizes.width - (IMAGE_VERTICAL_SIZE + sizes.sm) * 2) / 2;

  useEffect(() => {
    //  const {params} = navigation.route;
    // console.log('aaa', route.params.data);
    setEvent(route.params.data);
    let d = new Date(route.params.data.startDate.seconds * 1000)
      .toGMTString()
      .slice(5, 16);
    let de = new Date(route.params.data.endDate.seconds * 1000)
      .toGMTString()
      .slice(5, 16);
    setStart(d);
    setEnd(de);
    setParticipants(route.params.data.participants);
  }, [event]);

  useEffect(() => {
    // onAuthStateChanged returns an unsubscriber
    const unsubscribeAuth = auth.onAuthStateChanged(
      async (authenticatedUser) => {
        try {
          await (authenticatedUser
            ? setUser(authenticatedUser.providerData[0].phoneNumber)
            : setUser(null));
          // console.log("authenticatedUser",authenticatedUser);
          if (authenticatedUser) {
            console.log(
              'user logged in',
              authenticatedUser.providerData[0].phoneNumber,
            );
          } else {
            console.log('user not there');
          }
        } catch (error) {
          console.log(error);
        }
      },
    );
    return unsubscribeAuth;
    console.log('unsubscribeAuth', user);
  }, []);

  useEffect(() => {
    //  const {params} = navigation.route;

    async function checkParticipant() {
      await firebase
        .firestore()
        .collection('Events')
        .get()
        .then(async (snapshot) => {
          let data = [];
          await snapshot.docs.forEach(async (doc) => {
            if (event.eventName == doc.data().eventName) {
              // alert('fount');
              let part = await doc.data().participants;
              console.log('part', part, user);
              let d = new Date().getTime();
              d =d/1000;
              console.log(d/1000);
              console.log(doc.data().startDate.seconds);
              console.log(doc.data().endDate.seconds);
              
              if (
                d >= doc.data().startDate.seconds &&
                d <= doc.data().endDate.seconds
              ) {
                if (part.includes(user)) {
                  console.log('====================================');
                  console.log('already participants');
                  console.log('====================================');
                  setIsParticpant(0);
                } else {
                  console.log('====================================');
                  console.log('new participants');
                  console.log('====================================');

                  setIsParticpant(1);
                }
              } else {
                setIsParticpant(2);
                console.log('====================================');
                console.log('EVENT NOT HAPPEN');
                console.log('====================================');
              }
            
            }
          });
        });
    }
    
    
    checkParticipant();
  }, [user]);


  const handleParitcipant = async ()=>{
    if(isParticpant == 1){
        await firebase
          .firestore()
          .collection('Events')
          .get()
          .then(async (snapshot) => {
            let data = [];
            await snapshot.docs.forEach(async (doc) => {
              if (event.eventName == doc.data().eventName) {
                // alert('fount');
                let part = doc.data().participants;
                part.push(user);
                console.log();
                await firebase
                .firestore()
                  .collection('Events')
                  .doc(doc.id)
                  .update({
                    participants: part,
                  })
                  .then(() => {
                    navigation.navigate("Home");
                  });
              }
            });
          });
    }
  }
  return (
    <Block safe marginTop={sizes.md}>
      <Block
        scroll
        paddingHorizontal={sizes.s}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{paddingBottom: sizes.padding}}>
        <Block flex={0}>
          <Image
            background
            resizeMode="cover"
            padding={sizes.sm}
            paddingBottom={sizes.l}
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
                Events
              </Text>
            </Button>
            <Block flex={0} align="center">
              <Image
                width={64}
                height={64}
                marginBottom={sizes.sm}
                source={{
                  uri: 'https://images.unsplash.com/photo-1499996860823-5214fcc65f8f?fit=crop&w=80&q=80',
                }}
              />
              <Text h5 center white>
                {event.eventName}
              </Text>
              <Text p center white>
                {event.type}
              </Text>
              <Block row marginVertical={sizes.m}>
                <Button
                  white
                  outlined
                  shadow={false}
                  radius={sizes.m}
                  // disabled={true}
                >
                  <Block
                    justify="center"
                    radius={sizes.m}
                    paddingHorizontal={sizes.m}
                    color="rgba(255,255,255,0.2)">
                    <Text white bold transform="uppercase">
                      Participants
                    </Text>
                  </Block>
                </Button>
                <Button
                  shadow={false}
                  radius={sizes.m}
                  marginHorizontal={sizes.sm}
                  color="rgba(255,255,255,0.2)"
                  outlined={String(colors.white)}>
                  <Text white bold transform="uppercase">
                    {participants.length}
                  </Text>
                </Button>
                {/* <Button
                  shadow={false}
                  radius={sizes.m}
                  color="rgba(255,255,255,0.2)"
                  outlined={String(colors.white)}
                  onPress={() => handleSocialLink('dribbble')}>
                  <Ionicons
                    size={18}
                    name="logo-dribbble"
                    color={colors.white}
                  />
                </Button> */}
              </Block>
            </Block>
          </Image>

          {/* profile: stats */}
          <Block
            flex={0}
            radius={sizes.sm}
            shadow={!isAndroid} // disabled shadow on Android due to blur overlay + elevation issue
            marginTop={-sizes.l}
            marginHorizontal="8%"
            color="rgba(255,255,255,0.2)">
            <Block
              row
              blur
              flex={0}
              intensity={100}
              radius={sizes.sm}
              overflow="hidden"
              tint={colors.blurTint}
              justify="space-evenly"
              paddingVertical={sizes.sm}
              renderToHardwareTextureAndroid>
              <Block align="center">
                <Text h5>{start}</Text>
                <Text>Start Date</Text>
              </Block>

              <Block align="center">
                <Text h5>{end}</Text>
                <Text>End Date</Text>
              </Block>
            </Block>
          </Block>

          {/* profile: about me */}
          <Block paddingHorizontal={sizes.sm}>
            <Text h5 semibold marginBottom={sizes.s} marginTop={sizes.sm}>
              Description
            </Text>
            <Text p lineHeight={26}>
              {event.description}
            </Text>
          </Block>

          <Button
            marginTop={40}
            marginVertical={sizes.s}
            marginHorizontal={sizes.sm}
            gradient={
              isParticpant == 0
                ? gradients.danger
                : isParticpant == 1
                ? gradients.success
                : gradients.info
            }
            onPress={handleParitcipant}
            disabled={
              isParticpant == 0
                ? true
                : isParticpant == 1
                ? false
                : true
            }>
            <Text bold white transform="uppercase">
              
              {isParticpant == 0 ? 'Already Participated' : isParticpant == 1 ? 'participate'  : 'Not Availabe' }
            </Text>
          </Button>
          {/* profile: photo album */}
          {/* <Block paddingHorizontal={sizes.sm} marginTop={sizes.s}>
            <Block row align="center" justify="space-between">
              <Text h5 semibold>
                {t('common.album')}
              </Text>
              <Button>
                <Text p primary semibold>
                  {t('common.viewall')}
                </Text>
              </Button>
            </Block>
            <Block row justify="space-between" wrap="wrap">
              <Image
                resizeMode="cover"
                source={assets?.photo1}
                style={{
                  width: IMAGE_VERTICAL_SIZE + IMAGE_MARGIN / 2,
                  height: IMAGE_VERTICAL_SIZE * 2 + IMAGE_VERTICAL_MARGIN,
                }}
              />
              <Block marginLeft={sizes.m}>
                <Image
                  resizeMode="cover"
                  source={assets?.photo2}
                  marginBottom={IMAGE_VERTICAL_MARGIN}
                  style={{
                    height: IMAGE_VERTICAL_SIZE,
                    width: IMAGE_VERTICAL_SIZE,
                  }}
                />
                <Image
                  resizeMode="cover"
                  source={assets?.photo3}
                  style={{
                    height: IMAGE_VERTICAL_SIZE,
                    width: IMAGE_VERTICAL_SIZE,
                  }}
                />
              </Block>
            </Block>
          </Block> */}
        </Block>
      </Block>
    </Block>
  );
};

export default Profile;
