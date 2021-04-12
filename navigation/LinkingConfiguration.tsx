import * as Linking from 'expo-linking';

/**
 
Root
  TabAdverts
    TabAdvertsScreen
    AdvertsNewScreen
  TabMessages
    TabMessagesScreen
    MessagesViewScreen
  TabProfile
    TabProfileScreen
    ProfileScreen
Authentication
  LoginScreen
  RegisterScreen
NotFound

*/

export default {
  prefixes: [Linking.makeUrl('/')],
  config: {
    screens: {
      Root: {
        screens: {
          TabAdverts: {
            screens: {
              TabAdvertsScreen: 'adverts',
              AdvertsNewScreen: 'adverts_new'
            },
          },

          TabMessages: {
            screens: {
              TabMessagesScreen: 'messages',
              MessagesViewScreen: 'messages_view'
            }
          },

          TabProfile: {
            screens: {
              TabProfileScreen: 'profile',
              ProfileScreen: 'view_profile'
            }
          }
        },
      },
      
      Authentication: {
        screens:  {
          LoginScreen: 'login',
          RegisterScreen: 'register'
        }
      },
      NotFound: '*',
    },
  },
};
