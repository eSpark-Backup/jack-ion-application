import React, {Component} from 'react';
import {
  Dimensions,
} from 'react-native';
import {createStackNavigator} from 'react-navigation-stack';
import MeterDetails from './../Home/Properties/Detail/Equipment/MeterDetails/index'
import RedirectMeter from './../Home/Properties/Detail/Equipment/RedirectMeter/index'
import Tools from './Index';
const {width, height} = Dimensions.get('window');
import TabIcon from 'react-native-vector-icons/MaterialCommunityIcons';

const IonNavigatorConfig = {
  initialRouteName: 'Tools',
  defaultNavigationOptions: {
    headerShown: false,
  },
  tabBarOptions: {
    safeAreaInsets: {
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
    },
  },
  navigationOptions: {
    tabBarLabel: 'Tools',
    tabBarIcon: ({tintColor}) => (
      <TabIcon name="toolbox" color={tintColor} size={width * 0.05} />
    ),
  },
};

const RouteConfigs = {
  Tools,
  MeterDetails,
  RedirectMeter
};

const IonNavigator = createStackNavigator(RouteConfigs, IonNavigatorConfig);

export default IonNavigator;
