import React, {Component} from 'react';
import {createBottomTabNavigator} from 'react-navigation-tabs';
// import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Dashboard from 'react-native-vector-icons/MaterialCommunityIcons';
import Properties from 'react-native-vector-icons/FontAwesome5';
import Setting from 'react-native-vector-icons/Feather';
import Home from './Home/route';
import Settings from './settings/Index';
import Tools from './Tools/Index';
import Support from './ContactUs/Index';

import {StatusBar, TouchableOpacity, Image, Dimensions} from 'react-native';
import {Fonts} from './utils/fonts';

const {width, height} = Dimensions.get('window');

const AuthNavigatorConfig = {
  initialRouteName: 'Home',
  swipeEnabled: true,
  tabBarPosition: 'bottom',
  tabBarOptions: {
    inactiveTintColor: 'white',
    activeTintColor: 'black',
    labelStyle: {
      fontSize: height * 0.02,
      fontFamily: Fonts.BalsamiqSansRegular,
      // fontWeight: 'bold'
    },
    style: {
      backgroundColor: '#25AAE1ec',
      paddingVertical: height * 0.01,
      height: height * 0.085,
      alignSelf: 'center',
      // borderTopWidth: width * .005 ,
      // borderColor: 'black',
      justifyContent: 'center',
      alignItems: 'center',
      // borderTopRightRadius:width * .1
    },
  },
};

const RouteConfigs = {
  Home: Home,
  Settings: Settings,
  Tools: Tools,
  Support: Support,
};

const BottomNav = createBottomTabNavigator(RouteConfigs, AuthNavigatorConfig);

export default BottomNav;
// import * as React from 'react';
// import { BottomNavigation, Text } from 'react-native-paper';
// const MusicRoute = () => <Text>Music</Text>;
// const AlbumsRoute = () => <Text>Albums</Text>;
// const RecentsRoute = () => <Text>Recents</Text>;
// const MyComponent = () => {
//   const [index, setIndex] = React.useState(0);
//   const [routes] = React.useState([
//     { key: 'Home', title: 'Home', icon: 'home-outline' },
//     { key: 'Tools', title: 'Tools', icon: 'tools' },
//     { key: 'Contact', title: 'Contact', icon: 'contact' },
//   ]);
//   const renderScene = BottomNavigation.SceneMap({
//     music: MusicRoute,
//     albums: AlbumsRoute,
//     recents: RecentsRoute,
//   });
//   return (
//     <BottomNavigation
//       navigationState={{ index, routes }}
//       onIndexChange={setIndex}
//       renderScene={renderScene}
//       barStyle={{backgroundColor:'red'}}
//     />
//   );
// };

// export default MyComponent;
