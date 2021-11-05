import React, {useLayoutEffect, useState} from 'react';
import {FlatList, TouchableOpacity} from 'react-native';

import {useNavigation} from '@react-navigation/core';
import {useHeaderHeight} from '@react-navigation/stack';

import {useTheme} from '../hooks/';
import {Block, Button, Input, Image, Switch, Modal, Text} from '../components/';

// cards example
const Cards = () => {
  const {assets, colors, gradients, sizes} = useTheme();
  const navigation = useNavigation();

  return (
    <Block marginTop={sizes.m} paddingHorizontal={sizes.padding}>
      <Text h4 bold marginBottom={sizes.s} color={colors.primary}>
        Select The Mode
      </Text>
      {/* single card */}

      {/* full image width card */}

      {/* image background card */}
      <TouchableOpacity onPress={() => {
          navigation.navigate('AutomaticSelectionVideo');
      }}>
        <Block card padding={0} marginTop={sizes.sm}>
          <Image
            background
            resizeMode="cover"
            height={200}
            source={assets.card5}
            radius={sizes.cardRadius}>
            <Block color="rgba(0,0,0,0.3)" padding={sizes.padding}>
              <Block justify="center">
                <Text h4 center white>
                  Video Live Feed Assesment
                </Text>
              </Block>
            </Block>
          </Image>
        </Block>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => {
          navigation.navigate('AutomaticSelectionImage');
      }}>
        <Block card padding={0} marginTop={sizes.sm}>
          <Image
            background
            resizeMode="cover"
            height={200}
            source={assets.card5}
            radius={sizes.cardRadius}>
            <Block color="rgba(0,0,0,0.3)" padding={sizes.padding}>
              <Block justify="center">
                <Text h4 center white>
                  Image Assesment
                </Text>
                <Text p white></Text>
              </Block>
            </Block>
          </Image>
        </Block>
      </TouchableOpacity>
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
        contentContainerStyle={{paddingVertical: sizes.padding}}>
        <Block>
          <Cards />
        </Block>
      </Block>
    </Block>
  );
};

export default Components;
