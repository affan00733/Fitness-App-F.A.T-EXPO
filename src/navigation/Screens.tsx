import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';

import {Articles, Components, Home, Profile, Register, Pro} from '../screens';

import Result from "../screens/Results"
import Manual from '../screens/ManualAssesment';
import Assesments from '../screens/Assesment';
import {useScreenOptions, useTranslation} from '../hooks';

const Stack = createStackNavigator();

export default () => {
  const {t} = useTranslation();
  const screenOptions = useScreenOptions();

  return (
    <Stack.Navigator screenOptions={screenOptions.stack}>
      {/* <Stack.Screen
        name="Register"
        component={Register}
        options={{headerShown: false}}
      /> */}

      <Stack.Screen
        name="Home"
        component={Home}
        options={{title: 'Kakushin'}}
      />
      <Stack.Screen
        name="Articles"
        component={Articles}
        options={{title: 'Events'}}
      />
      <Stack.Screen
        name="Profile"
        component={Profile}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Manual"
        component={Manual}
        options={screenOptions.manualAsses}
      />
      <Stack.Screen
        name="Assesments"
        component={Assesments}
        options={screenOptions.assesments}
      />
      <Stack.Screen
        name="Results"
        component={Result}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Components"
        component={Components}
        options={screenOptions.components}
      />

      <Stack.Screen name="Pro" component={Pro} options={screenOptions.pro} />
    </Stack.Navigator>
  );
};
