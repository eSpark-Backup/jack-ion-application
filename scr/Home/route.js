import React, {Component} from 'react';
import {
  View,
  ScrollView,
  FlatList,
  TouchableWithoutFeedback,
  StyleSheet,
  Picker,
  TouchableOpacity,
  addons,
  Dimensions,
  Image,
} from 'react-native';
import {createStackNavigator} from 'react-navigation-stack';
// import { NavigationContainer } from '@react-navigation/native';
// import { createStackNavigator } from '@react-navigation/stack';
import ionMain from './Index';
import DashBoard from './DashBoard/Index';
import Properties from './Properties/Properties';
import Detail from './Properties/Detail/Profile';
import Equip from './Properties/Detail/Equipment/Units';
import Charts from './Properties/Detail/Charts/Index';
import Support from '../ContactUs/Index';
import Setting from '../settings/Index';
import Filter from './Properties/Filter';
import U_Details from './Properties/Detail/Equipment/Units/Details/index';
import MeterDetails from './Properties/Detail/Equipment/MeterDetails/index';
const {width, height} = Dimensions.get('window');
// import { Fonts } from '../../utils/fonts';
import TabIcon from 'react-native-vector-icons/MaterialCommunityIcons';
// const Stack = createStackNavigator();

// export default class Navigation extends React.Component {
//   render() {
//     return (
//       <NavigationContainer>
//         <Stack.Navigator initialRouteName="ionMain" headerMode="none">
//           <Stack.Screen name="ionMain" component={ionMain} />
//           <Stack.Screen name="DashBoard" component={DashBoard} />
//           <Stack.Screen name="Properties" component={Properties} />
//           <Stack.Screen name="Detail" component={Detail} />
//           <Stack.Screen name="Equip" component={Equip} />
//           <Stack.Screen name="Charts" component={Charts} />
//           <Stack.Screen name="Setting" component={Setting} />
//         </Stack.Navigator>
//       </NavigationContainer>
//     );
//   }
// }
const IonNavigatorConfig = {
  initialRouteName: 'ionMain',
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
    tabBarLabel: 'Home',
    tabBarIcon: ({tintColor}) => (
      <TabIcon name="home-circle" color={tintColor} size={height * 0.035} />
    ),
  },
};

const RouteConfigs = {
  ionMain: ionMain,
  DashBoard: DashBoard,
  Properties: Properties,
  Detail,
  Equip,
  Charts,
  Support,
  Setting,
  Filter,
  U_Details,
  MeterDetails,
};

const IonNavigator = createStackNavigator(RouteConfigs, IonNavigatorConfig);

export default IonNavigator;
