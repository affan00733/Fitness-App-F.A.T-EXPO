import 'react-native-gesture-handler';
import React,{useEffect} from 'react';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';

import {DataProvider} from './src/hooks';
import AppNavigation from './src/navigation/App';

export default function App() {
async function registerForPushNotificationsAsync() {
  let token;
  if (Constants.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      alert('Failed to get push token for push notification!');
      return;
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;
    console.log(token);
  } else {
    alert('Must use physical device for Push Notifications');
  }

  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  return token;
}
    useEffect(() => {
    registerForPushNotificationsAsync().then(token => console.log(token));

  }, []);
  return (
    <DataProvider>
      <AppNavigation />
    </DataProvider>
  );
}
