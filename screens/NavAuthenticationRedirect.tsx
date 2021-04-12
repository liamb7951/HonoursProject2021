import * as React from 'react';
import { StackScreenProps } from '@react-navigation/stack';
import { Text, View } from 'react-native';

import { RootStackParamList } from '../types';

import Authentication from '../application/Authentication'

export default function NavAuthenticationRedirect({
    navigation,
}: StackScreenProps<RootStackParamList, 'Authentication'>) {
    try {
        setTimeout(() => {
            Authentication.Logout();

            // Reset the navigation stack to empty
            // Set the new page to authentication.
            navigation.reset({
                index: 0,
                routes: [{name: 'Authentication'}],
            });
        }, 50);
    } catch (e) { }
   
    return (
        <View>
            <Text> Reloading account information... </Text>
        </View>
    );
}
