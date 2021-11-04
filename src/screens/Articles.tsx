import React, {useEffect, useState} from 'react';
import {FlatList, TouchableWithoutFeedback} from 'react-native';
import dayjs from 'dayjs';
import {useData, useTheme, useTranslation} from '../hooks/';
import {IArticle, ICategory} from '../constants/types';
import {Block, Button, Article, Text, Image} from '../components/';
import * as firebase from 'firebase';
import {useNavigation} from '@react-navigation/core';

const Articles = () => {
  const {t} = useTranslation();
  const [events, setEvents] = useState([]);
  const [eventsFilter, setEventsFilter] = useState([]);
  const {colors, gradients, sizes, icons} = useTheme();
  const [isSel1, setIsSel1] = useState(true);
  const [isSel2, setIsSel2] = useState(false);
  const [isSel3, setIsSel3] = useState(false);
  const [user, setUser] = useState();
  const auth = firebase.auth();

  const navigation = useNavigation();

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
  // init articles
  useEffect(() => {
    async function getEvents() {
      await firebase
        .firestore()
        .collection('Events')
        .get()
        .then((snapshot) => {
          let data = [];
          snapshot.docs.forEach((doc) => {
            console.log(doc.data());
            data.push(doc.data());
          });
          setEvents(data);
        });
    }
    getEvents();
  }, []);

  useEffect(() => {
    async function getinNav() {
      await handleNavBar(1);
    }
    getinNav();
  }, [events]);
  const handleNavBar = async (nav) => {
    console.log(nav);
    // console.log(events);

    if (nav === 1) {
      setIsSel1(true);
      setIsSel2(false);
      setIsSel3(false);
      setEventsFilter([]);
      let d = new Date().getTime();
      d = d / 1000;
      console.log('now', d, events[0].startDate.seconds);

      let res = events.filter((x) => x.endDate.seconds > d);
      console.log('filtered', res);
      setEventsFilter(res);
    } else if (nav === 2) {
      setIsSel1(false);
      setIsSel2(true);
      setIsSel3(false);

      setEventsFilter([]);
      setEventsFilter(events);
      console.log(events);
    } else if (nav === 3) {
      setIsSel1(false);
      setIsSel2(false);
      setIsSel3(true);
      setEventsFilter([]);

      let res = events.filter((x) => x.participants.includes(user));
      console.log(res);
      setEventsFilter(res);
    }
  };

  return (
    <Block>
      {/* categories list */}
      <Block color={colors.card} row flex={0} paddingVertical={sizes.padding}>
        <Block
          scroll
          horizontal
          renderToHardwareTextureAndroid
          showsHorizontalScrollIndicator={false}
          contentOffset={{x: -sizes.padding, y: 0}}>
          <Button
            radius={sizes.m}
            marginHorizontal={sizes.s}
            key={'category-1'}
            onPress={() => handleNavBar(1)}
            gradient={gradients?.[isSel1 ? 'primary' : 'light']}>
            <Text
              p
              bold={true}
              white={true}
              black={!true}
              transform="capitalize"
              marginHorizontal={sizes.m}>
              Upcoming
            </Text>
          </Button>

          <Button
            radius={sizes.m}
            marginHorizontal={sizes.s}
            key={'category-2'}
            onPress={() => handleNavBar(2)}
            gradient={gradients?.[isSel2 ? 'primary' : 'light']}>
            <Text
              p
              bold={true}
              white={true}
              black={!true}
              transform="capitalize"
              marginHorizontal={sizes.m}>
              All Events
            </Text>
          </Button>

          <Button
            radius={sizes.m}
            marginHorizontal={sizes.s}
            key={'category-3'}
            onPress={() => handleNavBar(3)}
            gradient={gradients?.[isSel3 ? 'primary' : 'light']}>
            <Text
              p
              bold={true}
              white={true}
              black={!true}
              transform="capitalize"
              marginHorizontal={sizes.m}>
              Participated
            </Text>
          </Button>
        </Block>
      </Block>

      <FlatList
        data={eventsFilter}
        showsVerticalScrollIndicator={false}
        keyExtractor={(item, index) => `${index}`}
        style={{paddingHorizontal: sizes.padding}}
        contentContainerStyle={{paddingBottom: sizes.l}}
        renderItem={({item}) => {
          return (
            <TouchableWithoutFeedback
              onPress={() => {
                navigation.navigate('Profile', {
                  data: item,
                });
              }}>
              <Block card padding={sizes.sm} marginTop={sizes.sm}>
                <Image
                  height={170}
                  resizeMode="cover"
                  source={{
                    uri: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?fit=crop&w=450&q=80',
                  }}
                />
                {/* article category */}

                <Text
                  h5
                  bold
                  size={13}
                  marginTop={sizes.s}
                  transform="uppercase"
                  marginLeft={sizes.xs}
                  gradient={gradients.primary}>
                  {item.eventName}
                </Text>

                {/* article description */}

                <Text
                  p
                  marginTop={sizes.s}
                  marginLeft={sizes.xs}
                  marginBottom={sizes.sm}>
                  {item.description}
                </Text>

                {/* user details */}

                <Block row marginLeft={sizes.xs} marginBottom={sizes.xs}>
                  {/* <Image
                    radius={sizes.s}
                    width={sizes.xl}
                    height={sizes.xl}
                    source={{
                      uri: 'https://images.unsplash.com/photo-1499996860823-5214fcc65f8f?fit=crop&w=80&q=80',
                    }}
                    style={{backgroundColor: colors.white}}
                  /> */}
                  <Block justify="center" marginLeft={sizes.s}>
                    <Text p semibold>
                      {item.type}
                    </Text>
                    <Text p gray>
                      {/* {t('common.posted', {
                        date:
                          dayjs(item.startDate.seconds).format('DD MMMM') ||
                          '-',
                      })} */}
                      {new Date(item.startDate.seconds * 1000)
                        .toGMTString()
                        .slice(0, 17)}
                    </Text>
                  </Block>
                </Block>

                {/* location & rating */}

                <Block row align="center">
                  <Image source={icons.location} marginRight={sizes.s} />
                  <Text p size={12} semibold>
                    mumbai , india
                  </Text>
                  <Text p bold marginHorizontal={sizes.s}>
                    •
                  </Text>
                  <Image source={icons.star} marginRight={sizes.s} />
                  <Text p size={12} semibold>
                    {item.participants.length} participants
                  </Text>
                </Block>
              </Block>
            </TouchableWithoutFeedback>
          );
        }}
      />
    </Block>
  );
};

export default Articles;
