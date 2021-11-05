import React, {useCallback, useEffect, useState} from 'react';
import {Platform, Linking, View} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {useNavigation} from '@react-navigation/core';
import {useRoute} from '@react-navigation/native';
import * as firebase from 'firebase';
import {Block, Button, Image, Text} from '../components/';
import {useData, useTheme, useTranslation} from '../hooks/';
import {Video, AVPlaybackStatus} from 'expo-av';

const isAndroid = Platform.OS === 'android';

const Profile = () => {
  const {t} = useTranslation();
  const route = useRoute();
  const [result, setResult] = useState({});
  const navigation = useNavigation();
  const {assets, colors, sizes, gradients} = useTheme();

  const IMAGE_SIZE = (sizes.width - (sizes.padding + sizes.sm) * 2) / 3;
  const IMAGE_VERTICAL_SIZE =
    (sizes.width - (sizes.padding + sizes.sm) * 2) / 2;
  const IMAGE_MARGIN = (sizes.width - IMAGE_SIZE * 3 - sizes.padding * 2) / 2;
  const IMAGE_VERTICAL_MARGIN =
    (sizes.width - (IMAGE_VERTICAL_SIZE + sizes.sm) * 2) / 2;

  useEffect(() => {
    setResult(route.params.data);
    console.log(result);
  }, [result]);

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
                Assesment Results
              </Text>
            </Button>
            <Block flex={0} align="center">
              {/* <Image
                width={64}
                height={64}
                marginBottom={sizes.sm}
                source={{
                  uri: 'https://images.unsplash.com/photo-1499996860823-5214fcc65f8f?fit=crop&w=80&q=80',
                }}
              /> */}
              {result.fileUrl == '' ? (
                <Image
                  source={require('../assets/images/live-workouts-without-touch-1591787914.gif')}
                  style={{
                    alignSelf: 'center',
                    width: 320,
                    height: 400,
                    // borderWidth: 1,
                    borderRadius: 10,
                  }}
                />
              ) : result.type == 'image' ? (
                <Image
                  source={{
                    uri: result.fileUrl,
                  }}
                  style={{
                    alignSelf: 'center',
                    width: 320,
                    height: 400,
                    // borderWidth: 1,
                    borderRadius: 10,
                  }}
                />
              ) : (
                <Video
                  style={{
                    alignSelf: 'center',
                    width: 320,
                    height: 400,
                    // borderWidth: 1,
                    borderRadius: 10,
                  }}
                  source={{
                    uri: result.fileUrl,
                  }}
                  useNativeControls
                  shouldPlay={true}
                  resizeMode="contain"
                  isLooping
                />
              )}

              <Text p center white>
                {/* {event.type} */}
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
                      {result.mode}
                    </Text>
                  </Block>
                </Button>
                <Button
                  white
                  outlined
                  shadow={false}
                  radius={sizes.m}
                  // disabled={true}
                  marginHorizontal={sizes.sm}>
                  <Block
                    justify="center"
                    radius={sizes.m}
                    paddingHorizontal={sizes.m}
                    color="rgba(255,255,255,0.2)">
                    <Text white bold transform="uppercase">
                      {result.workout}
                    </Text>
                  </Block>
                </Button>
              </Block>
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
                  <Text color="#008080" semibold p>
                    {result.email}
                  </Text>
                  <Text color="#008080" semibold p>
                    {result.phone}
                  </Text>
                </Block>
              </Block>
              <Block
                row
                // blur
                flex={0}
                intensity={100}
                radius={sizes.sm}
                overflow="hidden"
                tint={colors.blurTint}                
                renderToHardwareTextureAndroid>
                <Button
                  marginVertical={sizes.s}
                  marginHorizontal={sizes.sm}
                  gradient={
                    result.score == '' ? gradients.warning : gradients.success
                  }
                //   disabled={result.score == '' ? true : false}
                  >
                  <Text bold white transform="uppercase">
                    {result.score === ''
                      ? 'Yet To Be Assessed'
                      : 'Score : ' + result.score + '%'}
                  </Text>
                </Button>
              </Block>
            </Block>
          </Image>
        </Block>
      </Block>
    </Block>
  );
};

export default Profile;
