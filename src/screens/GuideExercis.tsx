import React, {useCallback, useEffect, useState} from 'react';
import {
  Platform,
  Linking,
  View,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {useNavigation} from '@react-navigation/core';
import {useRoute} from '@react-navigation/native';
import * as firebase from 'firebase';
import {Block, Button, Image, Text} from '../components/';
import {useData, useTheme, useTranslation} from '../hooks/';
import MapView, {Marker} from 'react-native-maps';
import * as Location from 'expo-location';
import MapViewDirections from 'react-native-maps-directions';
import * as en from '../assets/workout.json';

const isAndroid = Platform.OS === 'android';

const Profile = () => {
  const {t} = useTranslation();
  const route = useRoute();
  const navigation = useNavigation();
  const {assets, colors, sizes, gradients} = useTheme();
  const [days, setDays] = useState(null);

  const IMAGE_SIZE = (sizes.width - (sizes.padding + sizes.sm) * 2) / 3;
  const IMAGE_VERTICAL_SIZE =
    (sizes.width - (sizes.padding + sizes.sm) * 2) / 2;
  const IMAGE_MARGIN = (sizes.width - IMAGE_SIZE * 3 - sizes.padding * 2) / 2;
  const IMAGE_VERTICAL_MARGIN =
    (sizes.width - (IMAGE_VERTICAL_SIZE + sizes.sm) * 2) / 2;

  let type = 'vertical';
  const isHorizontal = type !== 'vertical';
  const CARD_WIDTH = (sizes.width - sizes.padding * 2 - sizes.sm) / 2;

  useEffect(() => {
    // setEvent(route.params.data);
    setDays(route.params.data);
    console.log(route.params.data.length);
  }, []);

  return (
    <Block safe>
      <Block
        scroll
        // paddingHorizontal={sizes.s}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{paddingBottom: sizes.padding}}>
        <Block flex={0}>
          <Image
            background
            resizeMode="cover"
            // padding={sizes.sm}
            // paddingBottom={sizes.l}

            radius={sizes.cardRadius}
            source={assets.background}>
            <Button
              row
              flex={0}
              marginTop={sizes.m}
              justify="flex-start"
              onPress={() => navigation.goBack()}>
              <Image
                radius={0}
                width={10}
                height={18}
                color={colors.white}
                source={assets.arrow}
                marginLeft={sizes.sm}
                transform={[{rotate: '180deg'}]}
              />
              <Text p white marginLeft={sizes.s}>
                {/* {t('profile.title')} */}
                Guide Workout
              </Text>
            </Button>
          </Image>
          {/*  */}

          <Block
            scroll
            paddingHorizontal={sizes.padding}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{paddingBottom: sizes.l}}>
            <Block row wrap="wrap" justify="space-between" marginTop={sizes.sm}>
              {days === null ? (
                <View>
                  <Text>Loading...</Text>
                </View>
              ) : (
                days.map((item, index) => {
                  console.log(item);                
                  return (
                    <TouchableOpacity
                      key={`day-${index}`}
                      onPress={() => {
                        navigation.navigate('GuideExercisVideo', {
                          data: {
                            name: en.exercises[item.id].name,
                            video: en.exercises[item.id].video,
                            link : en.exercises[item.id].link,
                            sets: item.sets,
                            unit: item.unit,
                          },
                        });
                      }}>
                      <Block
                        flex={0}
                        row={isHorizontal}
                        marginBottom={sizes.sm}
                        width={CARD_WIDTH * 2 + sizes.sm}>
                        <Image
                          background
                          resizeMode="cover"
                          height={100}
                          source={{uri: en.exercises[item.id].link}}
                          radius={sizes.cardRadius}>
                          <Block
                            color="rgba(0,0,0,0.3)"
                            padding={sizes.padding}>
                            <Block justify="center">
                              <Text h4 bold center white>
                                {en.exercises[item.id].name}
                              </Text>
                              <Text p white></Text>
                            </Block>
                          </Block>
                        </Image>
                      </Block>
                    </TouchableOpacity>
                  );
                })
              )}
            </Block>
          </Block>

          {/*  */}
        </Block>
      </Block>
    </Block>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default Profile;
