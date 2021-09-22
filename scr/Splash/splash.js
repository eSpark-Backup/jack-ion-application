import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Image,
  ImageBackground,
  ActivityIndicator,
  StatusBar,
  Dimensions,
  PermissionsAndroid,
} from 'react-native';
//Packages
import LinearGradient from 'react-native-linear-gradient';
// Components
import { Fonts } from '../../scr/utils/fonts';
import styles from './style';
const { width, height } = Dimensions.get('window');
export default class Splash extends Component {
  constructor() {
    super();
    this.state = {
      hasAccess: false,
    };
    // if (Platform.OS === 'android') {
    //   UIManager.setLayoutAnimationEnabledExperimental(true);
    // }
  }
  
  render() {
    return (
      <View style={styles.container}>
        <StatusBar backgroundColor="black" barStyle="default" hidden={true} showHideTransition={'fade'}></StatusBar>
        <LinearGradient colors={['white', '#c7d9ff', '#4f87ff']}
          style={styles.linear}
          start={{ x: 2, y: 0. }}
          end={{ x: 1, y: 1 }}>
          <View style={styles.logoContainer}>
            <View style={styles.logoInner}>
              <Image source={require('./../../Images/loogo.png')} width='20%' />
            </View>
          </View>
          <View style={styles.bottomContainer}>
            <ActivityIndicator size="large" color="white" style={styles.activityIndi} />
            <Text style={styles.bottomText}>
              ION Energy Solutions
            </Text>
          </View>
        </LinearGradient>
      </View>
    );
  }
}