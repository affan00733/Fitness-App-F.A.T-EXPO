import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';

import {Articles, Components, Home, Profile, Register, Pro} from '../screens';

import Result from "../screens/Results"
import Manual from '../screens/ManualAssesment';
import Assesments from '../screens/Assesment';
import AutomaticAssesment from '../screens/AutomaticAssesment'
import AutomaticSelectionImage from '../screens/AutomaticSelectionImage';
import AutomaticSelectionVideo from '../screens/AutomaticSelectionVideo'
import ImagePosenet from '../screens/ImagePosenet';
import VideoPosenet from '../screens/VideoPosenet';
import Maps from "../screens/Maps"
import GuideDays from "../screens/GuideDays"
import GuideExercis from '../screens/GuideExercis';
import GuideExercisVideo from '../screens/GuideExercisVideo';

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
        name="Automatic"
        component={AutomaticAssesment}
        options={screenOptions.automatic}
      />
      <Stack.Screen
        name="AutomaticSelectionImage"
        component={AutomaticSelectionImage}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="AutomaticSelectionVideo"
        component={AutomaticSelectionVideo}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="ImagePosent"
        component={ImagePosenet}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="VideoPosenet"
        component={VideoPosenet}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Maps"
        component={Maps}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="GuideDays"
        component={GuideDays}
        options={{headerShown: false}}
      />

      <Stack.Screen
        name="GuideExercis"
        component={GuideExercis}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="GuideExercisVideo"
        component={GuideExercisVideo}
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
