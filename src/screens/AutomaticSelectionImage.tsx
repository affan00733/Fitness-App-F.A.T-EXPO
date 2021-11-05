import React, {useLayoutEffect, useState} from 'react';
import {FlatList, TouchableOpacity} from 'react-native';

import {useNavigation} from '@react-navigation/core';
import {useHeaderHeight} from '@react-navigation/stack';

import {useTheme} from '../hooks';
import {Block, Button, Input, Image, Switch, Modal, Text} from '../components';

const Header = () => {
  const {assets, colors, gradients, sizes} = useTheme();
  const navigation = useNavigation();

  return (
    <Block>
      <Block flex={0}>
        <Image
          background
          // resizeMode="cover"
          // padding={sizes.sm}
          paddingTop={sizes.m}
          justify="flex-start"
          paddingLeft={sizes.m}
          paddingBottom={sizes.s}
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
              Image Automatic Assesment
            </Text>
          </Button>
        </Image>
      </Block>
    </Block>
  );
};
// cards example
const Cards = () => {
  const {assets, colors, gradients, sizes} = useTheme();
  const navigation = useNavigation();

  return (
    <Block marginTop={sizes.m} paddingHorizontal={sizes.padding}>
      {/* single card */}

      <Block row>
        <Block padding={0} marginTop={sizes.sm}>
          <TouchableOpacity onPress={() =>{
            navigation.navigate('ImagePosent',{
              data : "squats"
            });
          }}>
            <Image
              background
              resizeMode="cover"
              height={125}
              source={assets.card5}
              radius={sizes.cardRadius}>
              <Block color="rgba(0,0,0,0.3)" padding={sizes.padding}>
                <Block justify="center">
                  <Text h4 center white>
                    SQUATS
                  </Text>
                </Block>
              </Block>
            </Image>
          </TouchableOpacity>
        </Block>
        <Block padding={0} marginTop={sizes.sm} marginLeft={sizes.sm}>
          <TouchableOpacity onPress={() =>{
            navigation.navigate('ImagePosent', {
              data: 'sit-ups',
            });
          }}>
          <Image
            background
            resizeMode="cover"
            height={125}
            source={assets.card5}
            radius={sizes.cardRadius}>
            <Block color="rgba(0,0,0,0.3)" padding={sizes.padding}>
              <Block justify="center">
                <Text h4 center white>
                  SIT-UPS
                </Text>
              </Block>
            </Block>
          </Image>
          </TouchableOpacity>
        </Block>
      </Block>
      <Block row>
        <Block padding={0} marginTop={sizes.sm}>
           <TouchableOpacity onPress={() =>{
            navigation.navigate('ImagePosent', {
              data: 'push-ups',
            });
          }}>
          <Image
            background
            resizeMode="cover"
            height={125}
            source={assets.card5}
            radius={sizes.cardRadius}>
            <Block color="rgba(0,0,0,0.3)" padding={sizes.padding}>
              <Block justify="center">
                <Text h4 center white>
                  PUSH-UPS
                </Text>
              </Block>
            </Block>
          </Image>
          </TouchableOpacity>
        </Block>
        <Block padding={0} marginTop={sizes.sm} marginLeft={sizes.sm}>
          <TouchableOpacity onPress={() =>{
            navigation.navigate('ImagePosent', {
              data: 'pull-ups',
            });
          }}>
          <Image
            background
            resizeMode="cover"
            height={125}
            source={assets.card5}
            radius={sizes.cardRadius}>
            <Block color="rgba(0,0,0,0.3)" padding={sizes.padding}>
              <Block justify="center">
                <Text h4 center white>
                  PULL-UPS
                </Text>
              </Block>
            </Block>
          </Image>
          </TouchableOpacity>
        </Block>
      </Block>
    </Block>
  );
};

const Components = () => {
  const {assets, sizes} = useTheme();
  const navigation = useNavigation();
  const headerHeight = useHeaderHeight();

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
      <Block
        scroll
        showsVerticalScrollIndicator={false}
        // contentContainerStyle={{paddingVertical: sizes.padding}}
      >
        <Block>
          <Header />

          <Cards />
        </Block>
      </Block>
    </Block>
  );
};

export default Components;
