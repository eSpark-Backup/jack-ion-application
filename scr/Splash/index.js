import React, {Component} from 'react';
// import {View, Text, ActivityIndicator} from 'react-native';
import SplashScreen from 'react-native-splash-screen';
import Splash from './splash';
import AuthNav from '../../navigation';
import RootNav from '../../rootNav';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Loader from '../components/Loader';

// import Drawer from "../../scr/Navigation/index";

// import {withNavigation} from "react-navigation"

class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentScreen: 'Login',
      isLoading: true,
    };
    // console.log('start doing some tasks for about 3 seconds')
    setTimeout(() => {
      // console.log('Done some tasks for about 3 seconds')
      this.setState({isLoading: false});
    }, 3000);
  }

  componentDidMount() {
    SplashScreen.hide();
    this.getItem();
  }

  getItem = async () => {
    try {
      const value = await AsyncStorage.getItem('isLoggedIn');
      console.log('value kia ha', value);
      if (value !== null) {
        value == '1'
          ? this.setState({currentScreen: 'Home'})
          : this.setState({currentScreen: 'Login'});
      } else {
        this.setState({currentScreen: 'Login'});
      }
    } catch (e) {
      console.log('error at getting', e);
    }
  };

  render() {
    const {currentScreen} = this.state;
    let mainScreen = currentScreen === 'Login' ? <AuthNav /> : <RootNav />;
    if (this.state.isLoading) {
      return <Loader />;
    } else {
      return mainScreen;
    }
  }
}

export default Main;
