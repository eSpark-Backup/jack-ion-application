import React, {Component} from 'react';
import {createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import Footer from './scr/Drawer';
import Login from './scr/Login/Login';
import SignUp from './scr/SignUp/SignUp';
// import SideMenu from './scr/Navigation/index';
// import Signup from './screen/Signup'
// import Verifica from './screen/Verification'
// import Home from './screen/HomeScreen'
// import Map from './screen/Map'

const AppNavigator = createStackNavigator(
  {
    Login,
    SignUp,
    Footer,
  },
  {
    initialRouteName: 'Login',
    headerMode: 'none',
    defaultNavigationOptions: {
      gestureEnabled: false,
    },
    navigationOptions: {
      headerVisible: false,
      header: null,
      headerForceInset: {top: 'never', bottom: 'never'},
    },
  },
);

export default createAppContainer(AppNavigator);
