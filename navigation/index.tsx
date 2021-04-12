import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import * as React from 'react';
import { ColorSchemeName } from 'react-native';

import { RootStackParamList } from '../types';

// Navigation
import BottomTabNavigator from './BottomTabNavigator';
import AuthenticationNavigator from './AuthenticationNavigator';
import LinkingConfiguration from './LinkingConfiguration';

// Pages
import NotFoundScreen from '../screens/NotFoundScreen';


// If you are not familiar with React Navigation, we recommend going through the
// "Fundamentals" guide: https://reactnavigation.org/docs/getting-started
export default function Navigation({ colorScheme }: { colorScheme: ColorSchemeName }) {
  return (
    <NavigationContainer
        linking={LinkingConfiguration}
        theme={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <RootNavigator />
    </NavigationContainer>
  );
}

// A root stack navigator is often used for displaying modals on top of all other content
// Read more here: https://reactnavigation.org/docs/modal
const Stack = createStackNavigator<RootStackParamList>();

function RootNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>

      <Stack.Screen name="Authentication" component={AuthenticationNavigator} options={{ title: 'Authentication' }} />
      <Stack.Screen name="Root" component={BottomTabNavigator} options={{ title: '' }}  />
      <Stack.Screen name="NotFound" component={NotFoundScreen} options={{ title: 'Oops!' }} />

    </Stack.Navigator>
  );
}
