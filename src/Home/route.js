import React, {Component} from 'react';
import {Dimensions} from 'react-native';
import {createStackNavigator} from 'react-navigation-stack';
import ionMain from './Index';
import DashBoard from './DashBoard/Index';
import Properties from './Properties/Properties';
import Detail from './Properties/Detail/Profile';
import Equip from './Properties/Detail/Equipment/Units';
import Charts from './Properties/Detail/Charts/Index';
import Notifications from './Properties/Detail/Notifications/index';
import Support from '../ContactUs/Index';
import Setting from '../settings/Index';
import Filter from './Properties/Filter';
import U_Details from './Properties/Detail/Equipment/Units/Details/index';
import MeterDetails from './Properties/Detail/Equipment/MeterDetails/index';
import RedirectMeter from './Properties/Detail/Equipment/RedirectMeter/index';
const {width, height} = Dimensions.get('window');
import TabIcon from 'react-native-vector-icons/MaterialCommunityIcons';

const IonNavigatorConfig = {
  initialRouteName: 'ionMain',
  defaultNavigationOptions: {
    headerShown: false,
    // gestureEnabled: false,
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
    tabBarLabel: 'Home',
    tabBarIcon: ({tintColor}) => (
      <TabIcon name="home-circle" color={tintColor} size={width * 0.05} />
    ),
  },
};

const RouteConfigs = {
  ionMain,
  DashBoard,
  Properties,
  Detail,
  Equip,
  Charts,
  Support,
  Setting,
  Filter,
  U_Details,
  Notifications,
};

const IonNavigator = createStackNavigator(RouteConfigs, IonNavigatorConfig);

export default IonNavigator;
