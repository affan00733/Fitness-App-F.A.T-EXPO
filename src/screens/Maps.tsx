import React, {useCallback, useEffect, useState} from 'react';
import {Platform, Linking, View, StyleSheet} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {useNavigation} from '@react-navigation/core';
import {useRoute} from '@react-navigation/native';
import * as firebase from 'firebase';
import {Block, Button, Image, Text} from '../components/';
import {useData, useTheme, useTranslation} from '../hooks/';
import MapView, {Marker} from 'react-native-maps';
import * as Location from 'expo-location';
import MapViewDirections from 'react-native-maps-directions';

const isAndroid = Platform.OS === 'android';

const Profile = () => {
  const {t} = useTranslation();
  const route = useRoute();
  const navigation = useNavigation();
  const {assets, colors, sizes, gradients} = useTheme();
  const [currentLocation, setCurrentLocation] = useState(null);
  const [destination, setDestination] = useState({});
  const [distance, setDistance] = useState(0);
  const [calories, setCalories] = useState(0);
  const IMAGE_SIZE = (sizes.width - (sizes.padding + sizes.sm) * 2) / 3;
  const IMAGE_VERTICAL_SIZE =
    (sizes.width - (sizes.padding + sizes.sm) * 2) / 2;
  const IMAGE_MARGIN = (sizes.width - IMAGE_SIZE * 3 - sizes.padding * 2) / 2;
  const IMAGE_VERTICAL_MARGIN =
    (sizes.width - (IMAGE_VERTICAL_SIZE + sizes.sm) * 2) / 2;

  useEffect(() => {
    // setEvent(route.params.data);
    async function getLocation() {
      const {status} = await Location.getForegroundPermissionsAsync();
      if (status === 'granted') {
        await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.High,
            timeInterval: 10000,
            distanceInterval: 80,
          },
          false,
          (location_update) => {
            console.log('update location!', location_update.coords);
          },
        );
        let location = await Location.getCurrentPositionAsync({});
        console.log(location);
        setCurrentLocation({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.005922,
          longitudeDelta: 0.005421,
        });
        setDestination({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.005922,
          longitudeDelta: 0.005421,
        });
        console.log(
          'KM distance ',
          getDistanceFromLatLonInKm(
            location.coords.latitude,
            location.coords.longitude,
            18.97791,
            72.827071,
          ).toFixed(2),
        );
        let dist = getDistanceFromLatLonInKm(
          location.coords.latitude,
          location.coords.longitude,
          18.97791,
          72.827071,
        ).toFixed(2);

        setDistance(dist);

        if (route.params.data === 'jogging') {
          console.log('jogging');
          await setCalories(Math.round(dist * 60));
          console.log(calories);
        }
        if (route.params.data === 'cycling') {
          console.log('cycling');
          await setCalories(Math.round(dist * 50));
          console.log(calories);
        }
        if (route.params.data === 'walking') {
          console.log('walking');
          await setCalories(Math.round(dist * 32));
          console.log(calories);
        }
        if (route.params.data === 'running') {
          console.log('running');
          await setCalories(Math.round(dist * 62));
          console.log(calories);
        }
      }
    }
    getLocation();
  }, []);
  function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
    var R = 6371; // Radius of the earth in km
    var dLat = deg2rad(lat2 - lat1); // deg2rad below
    var dLon = deg2rad(lon2 - lon1);
    var a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) *
        Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c; // Distance in km
    return d;
  }

  function deg2rad(deg) {
    return deg * (Math.PI / 180);
  }
  return (
    <Block safe>
      <Block
        scroll
        paddingHorizontal={sizes.s}
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
                Maps
              </Text>
            </Button>
          </Image>

          {/* Maps */}
          {currentLocation !== null ? (
            <MapView
              style={{alignSelf: 'stretch', height: 700}}
              region={currentLocation}>
              {/* <MapView.Polyline
                coordinates={[
                  currentLocation,
                  {
                    latitude: 18.97791,
                    longitude: 72.827071,
                  },
                ]}
                // origin={currentLocation}
                // destination={{latitude: 18.97791, longitude: 72.827071}}
                strokeWidth={2}
              /> */}
              <MapViewDirections
                origin={currentLocation}
                destination={{latitude: 18.97791, longitude: 72.827071}}
                apikey="AIzaSyC4sO73aIEJYhNN0MWlcFHRH0-NmsTxQ0M"
                strokeWidth={3}
                strokeColor="rgb(0,139,241)"
              />

              <Marker
                coordinate={currentLocation}
                title="Starting Point"
                image={require('../assets/maker/m1.png')}
              />
              <Marker
                //   coordinate={destination}
                coordinate={{
                  latitude: 18.97791,
                  longitude: 72.827071,
                }}
                image={require('../assets/maker/m2.png')}
                title="ME"
              />
            </MapView>
          ) : (
            <View>
              <Text>Loadindg</Text>
            </View>
          )}

          {/* Maps End */}

          {/*  */}

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
              <Block>
                <Button marginHorizontal={sizes.s} gradient={gradients.warning}>
                  <Text semibold white transform="uppercase">
                    {distance}
                  </Text>
                  <Text bold white transform="uppercase">
                    KM's
                  </Text>
                </Button>
              </Block>

              <Block>
                <Button marginHorizontal={sizes.s} gradient={gradients.info}>
                  <Text semibold white transform="uppercase">
                    {calories !== 0 ? calories : 0}
                  </Text>
                  <Text bold white transform="uppercase">
                    Calories
                  </Text>
                </Button>
              </Block>
            </Block>
          </Block>

          {/* profile: about me */}
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
