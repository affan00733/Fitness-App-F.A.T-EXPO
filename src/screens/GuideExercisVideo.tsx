import React, {useCallback, useEffect, useState, useRef} from 'react';
import {Platform, Linking, View} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {useNavigation} from '@react-navigation/core';
import {useRoute} from '@react-navigation/native';
import {Block, Button, Image, Text} from '../components/';
import {useData, useTheme, useTranslation} from '../hooks/';
import {Video, AVPlaybackStatus} from 'expo-av';
import YoutubePlayer from 'react-native-youtube-iframe';

const isAndroid = Platform.OS === 'android';

const Profile = () => {
  const {t} = useTranslation();
  const route = useRoute();

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
  }, []);

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
            source={assets.background}
            >
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
                Workout Video
              </Text>
            </Button>

            <Block flex={0} align="center">
              <Image
                marginTop={sizes.l}
                width={64}
                height={64}
                marginBottom={sizes.l}
                source={{
                  uri: route.params.data.link
                }}
              />
              <Text h4 center bold white>
                {route.params.data.name}
              </Text>
            </Block>
            <Block
              flex={0}
              radius={sizes.sm}
              shadow={!isAndroid} // disabled shadow on Android due to blur overlay + elevation issue
              marginTop={sizes.l}
              marginBottom={sizes.l}
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
                <Block>
                  <Button
                    // marginVertical={sizes.s}
                    marginHorizontal={sizes.sm}
                    gradient={gradients.info}>
                    <Text bold white h4 transform="uppercase">
                      {route.params.data.sets} LB
                    </Text>
                  </Button>
                </Block>
              </Block>
            </Block>
            <Block marginTop={sizes.m}>
              <YoutubePlayer
                height={300}
                play={true}
                videoId={route.params.data.video}
              />
            </Block>
          </Image>

          {/* profile: about me */}
        </Block>
      </Block>
    </Block>
  );
};

export default Profile;
