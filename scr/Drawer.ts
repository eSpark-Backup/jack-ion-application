import React, {Component} from 'react';
import {Dimensions} from 'react-native';

import {createBottomTabNavigator} from 'react-navigation-tabs';

import Home from './Home/route';
import Settings from './settings/Index';
import Tools from './Tools/route';
import Support from './ContactUs/Index';
import {Fonts} from './utils/fonts';

const {width, height} = Dimensions.get('window');

const AuthNavigatorConfig = {
  initialRouteName: 'Home',
  tabBarPosition: 'bottom',
  tabBarOptions: {
    inactiveTintColor: 'white',
    activeTintColor: 'black',
    labelStyle: {
      fontSize: width * 0.03,
      fontFamily: Fonts.BalsamiqSansRegular,
      // fontWeight: 'bold'
    },
    style: {
      backgroundColor: '#25AAE1ec',
      paddingVertical: width * 0.015,
      height: width * 0.16,
      alignSelf: 'center',
      justifyContent: 'center',
      alignItems: 'center',
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
