import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import * as React from 'react';


import Colors from '../constants/Colors';
import useColorScheme from '../hooks/useColorScheme';
import NotFoundScreen from '../screens/NotFoundScreen';
import NavAuthenticationRedirect from '../screens/NavAuthenticationRedirect';
import { AdvertsParamList, BottomTabParamList, MessagesParamList, ProfileParamList } from '../types';


import AdvertsScreen from '../screens/Adverts/AdvertsScreen';
import { MessagesScreen } from '../screens/Messages/MessagesScreen';
import { AdvertsNewScreen } from '../screens/Adverts/AdvertsNewScreen';
import { MessagesViewScreen } from '../screens/Messages/MessagesViewScreen';
import { ProfileScreen } from '../screens/Profile/ProfileScreen';


const BottomTab = createBottomTabNavigator<BottomTabParamList>();

export default function BottomTabNavigator() {
    const colorScheme = useColorScheme();

    return (
        <BottomTab.Navigator
            initialRouteName="TabAdverts"
            tabBarOptions={{ activeTintColor: Colors[colorScheme].tint }}>
            
            <BottomTab.Screen
                name="TabAdverts"
                component={TabAdvertsNavigator}
                options={{
                    title: "", tabBarIcon: ({ color }) => <TabBarIcon name="ios-home" color={color} />,
                }} />

            <BottomTab.Screen
                name="TabMessages"
                component={TabMessagesNavigator}
                options={{
                    title: "", 
                    tabBarIcon: ({ color }) => <TabBarIcon name="chatbubble-outline" color={color} />,
                }} />

            <BottomTab.Screen
                name="TabProfile"
                component={TabProfileNavigator}
                options={{
                    title: "", 
                    tabBarIcon: ({ color }) => <TabBarIcon name="ios-person-outline" color={color} />,
                }} />

            <BottomTab.Screen
                name="TabLogout"
                component={NavAuthenticationRedirect}
                options={{
                    title: "", 
                    tabBarIcon: ({ color }) => <TabBarIcon name="ios-log-in-outline" color={color} />,
                }} />
        
        </BottomTab.Navigator>
    );
}

// You can explore the built-in icon families and icons on the web at:
// https://icons.expo.fyi/
function TabBarIcon(props: { name: React.ComponentProps<typeof Ionicons>['name']; color: string }) {
    return <Ionicons size={30} style={{ marginBottom: -3 }} {...props} />;
}

// Each tab has its own navigation stack, you can read more about this pattern here:
// https://reactnavigation.org/docs/tab-based-navigation#a-stack-navigator-for-each-tab

const AdvertsStack = createStackNavigator<AdvertsParamList>(); 
function TabAdvertsNavigator() {
    return (
        <AdvertsStack.Navigator>
            <AdvertsStack.Screen 
                name="AdvertsScreen"
                component={AdvertsScreen}
                options={{ headerTitle: 'Adverts', headerTitleAlign: 'center' }} />
            
            <AdvertsStack.Screen 
                name="AdvertsNewScreen"
                component={AdvertsNewScreen}
                options={{ headerTitle: 'Post Advert', headerTitleAlign: 'center' }} />
        </AdvertsStack.Navigator>
    );
}

const MessagesStack = createStackNavigator<MessagesParamList>(); 
function TabMessagesNavigator() {
    return (
        <MessagesStack.Navigator>
            <MessagesStack.Screen 
                name="TabMessagesScreen"
                component={MessagesScreen}
                options={{ headerTitle: 'Chat', headerTitleAlign: 'center' }} />

            <MessagesStack.Screen 
                name="MessagesViewScreen"
                component={MessagesViewScreen}  />
        </MessagesStack.Navigator>
    );
}

const ProfileStack = createStackNavigator<ProfileParamList>();
function TabProfileNavigator() {
    return (
        <ProfileStack.Navigator>
            <ProfileStack.Screen 
                name="TabProfileScreen"
                component={ProfileScreen} />
            <ProfileStack.Screen 
                name="ProfileScreen"
                component={ProfileScreen} />
        </ProfileStack.Navigator>
    );
}
