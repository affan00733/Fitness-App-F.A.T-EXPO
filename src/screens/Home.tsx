import React, {useCallback, useEffect, useState} from 'react';
import {Platform, Linking, View, TouchableOpacity} from 'react-native';
import {useData, useTheme, useTranslation} from '../hooks/';
import {Block, Button, Image, Input, Product, Text} from '../components/';
import {useNavigation} from '@react-navigation/core';
import Firebase from '../firebaseConfig.js';

import * as en from '../assets/workout.json';

const Home = () => {
  const {t} = useTranslation();
  const [tab, setTab] = useState<number>(0);
  const navigation = useNavigation();

  const {assets, colors, fonts, gradients, sizes} = useTheme();
  let type = 'vertical';
  const isHorizontal = type !== 'vertical';
  const CARD_WIDTH = (sizes.width - sizes.padding * 2 - sizes.sm) / 2;
  const guides = [
    'https://firebasestorage.googleapis.com/v0/b/react-test-fd55f.appspot.com/o/guide%2Fguide-1.gif?alt=media&token=4cc561b5-caf2-435b-8af8-85e504133357',
    'https://firebasestorage.googleapis.com/v0/b/react-test-fd55f.appspot.com/o/guide%2Fguide-4.gif?alt=media&token=53dfb06d-2364-4814-a184-7adc8ed9a9b1',
    'https://firebasestorage.googleapis.com/v0/b/react-test-fd55f.appspot.com/o/guide%2Fguide-2.gif?alt=media&token=ce2721d9-900c-4feb-9115-ffbf1e9045d3',
    'https://firebasestorage.googleapis.com/v0/b/react-test-fd55f.appspot.com/o/guide%2Fguide-3.gif?alt=media&token=47130b9b-0b05-4827-9e80-f7688382ea8a',
  ];

  const handleProducts = useCallback(
    (tab: number) => {
      setTab(tab);
    },
    [setTab],
  );
  useEffect(() => {
    console.log(en.plans.length);
  }, []);

  return (
    <Block>
      {/* search input */}
      {/* <Block color={colors.card} flex={0} padding={sizes.padding}>
        <Input search placeholder={t('common.search')} />
      </Block> */}

      {/* toggle products list */}
      <Block
        row
        flex={0}
        align="center"
        justify="center"
        color={colors.card}
        paddingBottom={sizes.sm}>
        <Button onPress={() => handleProducts(0)}>
          <Block row align="center">
            <Block
              flex={0}
              radius={6}
              align="center"
              justify="center"
              marginRight={sizes.s}
              width={sizes.socialIconSize}
              height={sizes.socialIconSize}
              gradient={gradients?.[tab === 0 ? 'primary' : 'secondary']}>
              <Image source={assets.extras} color={colors.white} radius={0} />
            </Block>
            <Text p font={fonts?.[tab === 0 ? 'medium' : 'normal']}>
              Featured
            </Text>
          </Block>
        </Button>
        <Block
          gray
          flex={0}
          width={1}
          marginHorizontal={sizes.sm}
          height={sizes.socialIconSize}
        />
        <Button onPress={() => handleProducts(1)}>
          <Block row align="center">
            <Block
              flex={0}
              radius={6}
              align="center"
              justify="center"
              marginRight={sizes.s}
              width={sizes.socialIconSize}
              height={sizes.socialIconSize}
              gradient={gradients?.[tab === 1 ? 'primary' : 'secondary']}>
              <Image
                radius={0}
                color={colors.white}
                source={assets.documentation}
              />
            </Block>
            <Text p font={fonts?.[tab === 1 ? 'medium' : 'normal']}>
              Guide
            </Text>
          </Block>
        </Button>
      </Block>

      {tab === 0 ? (
        <Block
          scroll
          paddingHorizontal={sizes.padding}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{paddingBottom: sizes.l}}>
          <Block row wrap="wrap" justify="space-between" marginTop={sizes.sm}>
            {/*  */}
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('Maps', {
                  data: 'running',
                });
              }}>
              <Block
                flex={0}
                row={isHorizontal}
                marginBottom={sizes.sm}
                width={isHorizontal ? CARD_WIDTH * 2 + sizes.sm : CARD_WIDTH}>
                <Image
                  background
                  resizeMode="cover"
                  height={170}
                  source={{
                    uri: 'https://firebasestorage.googleapis.com/v0/b/react-test-fd55f.appspot.com/o/running.gif?alt=media&token=c4be2eab-9da0-45ad-b91f-885e71f1c88f',
                  }}
                  radius={sizes.cardRadius}>
                  <Block color="rgba(0,0,0,0.3)" padding={sizes.padding}>
                    <Block justify="center">
                      <Text p size={sizes.sm} bold center white>
                        Running
                      </Text>
                      <Text p white></Text>
                    </Block>
                    <TouchableOpacity>
                      <Block row flex={0} align="center">
                        <Text
                          p
                          color={colors.link}
                          semibold
                          size={sizes.ss}
                          marginRight={sizes.s}>
                          Let's Try
                        </Text>
                        <Image source={assets.arrow} color={colors.link} />
                      </Block>
                    </TouchableOpacity>
                  </Block>
                </Image>
              </Block>
            </TouchableOpacity>
            {/*  */}
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('Maps', {
                  data: 'jogging',
                });
              }}>
              <Block
                flex={0}
                row={isHorizontal}
                marginBottom={sizes.sm}
                width={isHorizontal ? CARD_WIDTH * 2 + sizes.sm : CARD_WIDTH}>
                <Image
                  background
                  resizeMode="cover"
                  height={170}
                  source={{
                    uri: 'https://firebasestorage.googleapis.com/v0/b/react-test-fd55f.appspot.com/o/jogging.gif?alt=media&token=59b2a577-0cbe-4baf-b7f1-03c9f6e21ce0',
                  }}
                  radius={sizes.cardRadius}>
                  <Block color="rgba(0,0,0,0.3)" padding={sizes.padding}>
                    <Block justify="center">
                      <Text p size={sizes.sm} bold center white>
                        Jogging
                      </Text>
                      <Text p white></Text>
                    </Block>
                    <TouchableOpacity>
                      <Block row flex={0} align="center">
                        <Text
                          p
                          color={colors.link}
                          semibold
                          size={sizes.ss}
                          marginRight={sizes.s}>
                          Let's Try
                        </Text>
                        <Image source={assets.arrow} color={colors.link} />
                      </Block>
                    </TouchableOpacity>
                  </Block>
                </Image>
              </Block>
            </TouchableOpacity>
            {/*  */}
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('Maps', {
                  data: 'cycling',
                });
              }}>
              <Block
                flex={0}
                row={isHorizontal}
                marginBottom={sizes.sm}
                width={isHorizontal ? CARD_WIDTH * 2 + sizes.sm : CARD_WIDTH}>
                <Image
                  background
                  resizeMode="cover"
                  height={170}
                  source={{
                    uri: 'https://firebasestorage.googleapis.com/v0/b/react-test-fd55f.appspot.com/o/cycling.gif?alt=media&token=d349f743-5daf-45e8-955f-df93d91aba11',
                  }}
                  radius={sizes.cardRadius}>
                  <Block color="rgba(0,0,0,0.3)" padding={sizes.padding}>
                    <Block justify="center">
                      <Text p size={sizes.sm} bold center white>
                        Cycling
                      </Text>
                      <Text p white></Text>
                    </Block>
                    <TouchableOpacity>
                      <Block row flex={0} align="center">
                        <Text
                          p
                          color={colors.link}
                          semibold
                          size={sizes.ss}
                          marginRight={sizes.s}>
                          Let's Try
                        </Text>
                        <Image source={assets.arrow} color={colors.link} />
                      </Block>
                    </TouchableOpacity>
                  </Block>
                </Image>
              </Block>
            </TouchableOpacity>
            {/*  */}
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('Maps', {
                  data: 'walking',
                });
              }}>
              <Block
                flex={0}
                row={isHorizontal}
                marginBottom={sizes.sm}
                width={isHorizontal ? CARD_WIDTH * 2 + sizes.sm : CARD_WIDTH}>
                <Image
                  background
                  resizeMode="cover"
                  height={170}
                  source={{
                    uri: 'https://firebasestorage.googleapis.com/v0/b/react-test-fd55f.appspot.com/o/walking.gif?alt=media&token=9ad8836c-6782-4e36-a169-2236b11b8d79',
                  }}
                  radius={sizes.cardRadius}>
                  <Block color="rgba(0,0,0,0.3)" padding={sizes.padding}>
                    <Block justify="center">
                      <Text p size={sizes.sm} bold center white>
                        Walking
                      </Text>
                      <Text p white></Text>
                    </Block>
                    <TouchableOpacity>
                      <Block row flex={0} align="center">
                        <Text
                          p
                          color={colors.link}
                          semibold
                          size={sizes.ss}
                          marginRight={sizes.s}>
                          Let's Try
                        </Text>
                        <Image source={assets.arrow} color={colors.link} />
                      </Block>
                    </TouchableOpacity>
                  </Block>
                </Image>
              </Block>
            </TouchableOpacity>
            {/*  */}
            <TouchableOpacity
              onPress={() => {
                Linking.openURL('whatsapp://send?phone=+14155238886');
              }}>
              <Block
                flex={0}
                row={isHorizontal}
                marginBottom={sizes.sm}
                width={CARD_WIDTH * 2 + sizes.sm}>
                <Image
                  background
                  resizeMode="cover"
                  height={170}
                  source={{
                    uri: 'https://firebasestorage.googleapis.com/v0/b/react-test-fd55f.appspot.com/o/chatbot.gif?alt=media&token=ef6f627f-b14f-4480-9553-d76ce62c85f0',
                  }}
                  radius={sizes.cardRadius}>
                  <Block color="rgba(0,0,0,0.3)" padding={sizes.padding}>
                    <Block justify="center">
                      <Text h4 bold center white>
                        ChatBot
                      </Text>
                      <Text p white></Text>
                    </Block>
                    <TouchableOpacity>
                      <Block justify="flex-end" row flex={0} align="center">
                        <Text
                          p
                          color={colors.link}
                          bold
                          size={sizes.ss}
                          marginRight={sizes.s}>
                          Let's Try
                        </Text>
                        <Image
                          height={15}
                          source={assets.arrow}
                          color={colors.link}
                        />
                      </Block>
                    </TouchableOpacity>
                  </Block>
                </Image>
              </Block>
            </TouchableOpacity>
            {/*  */}
          </Block>
        </Block>
      ) : (
        <Block
          scroll
          paddingHorizontal={sizes.padding}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{paddingBottom: sizes.l}}>
          <Block row wrap="wrap" justify="space-between" marginTop={sizes.sm}>
            {en.plans.map((item, index) => {
              return (
                <TouchableOpacity
                  key={`type-${index}`}
                  onPress={() => {
                    navigation.navigate('GuideDays', {
                      data: item.days,
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
                      height={140}
                      source={{uri: guides[index]}}
                      radius={sizes.cardRadius}>
                      <Block color="rgba(0,0,0,0.3)" padding={sizes.padding}>
                        <Block justify="center">
                          <Text h4 bold center white>
                            {item.name}
                          </Text>
                          <Text p white></Text>
                        </Block>
                        <TouchableOpacity>
                          <Block justify="flex-end" row flex={0} align="center">
                            <Text
                              p
                              color={colors.link}
                              bold
                              size={sizes.ss}
                              marginRight={sizes.s}>
                              Let's Try
                            </Text>
                            <Image
                              height={15}
                              source={assets.arrow}
                              color={colors.link}
                            />
                          </Block>
                        </TouchableOpacity>
                      </Block>
                    </Image>
                  </Block>
                </TouchableOpacity>
              );
            })}
          </Block>
        </Block>
      )}
    </Block>
  );
};

export default Home;
