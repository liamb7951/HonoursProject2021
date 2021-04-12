import { Ionicons } from '@expo/vector-icons';
import { createStackNavigator } from '@react-navigation/stack';
import * as React from 'react';


import Colors from '../constants/Colors';
import useColorScheme from '../hooks/useColorScheme';
import NotFoundScreen from '../screens/NotFoundScreen';
import { AuthenticationParamList } from '../types';

// Include screens here
import LoginScreen from '../screens/Authentication/LoginScreen';
import SignupScreen from '../screens/Authentication/SignupScreen';

const AuthNavigator = createStackNavigator<AuthenticationParamList>();

export default function BottomTabNavigator() {
    const colorScheme = useColorScheme();

    return (
        <AuthNavigator.Navigator
                initialRouteName="LoginScreen">

            <AuthNavigator.Screen
                name="LoginScreen"
                component={LoginScreen} 
                options={{
                    title: "Login",
                    headerTitleAlign: 'center'
                }} />

            <AuthNavigator.Screen
                name="SignupScreen"
                component={SignupScreen} 
                options={{
                    title: "Signup",
                    headerTitleAlign: 'center'
                }} />

        </AuthNavigator.Navigator>
    )
}