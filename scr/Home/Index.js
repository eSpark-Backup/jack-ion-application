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
  TouchableOpacity,
  ScrollView,
  FlatList,
  LayoutAnimation,
  UIManager,
  TextInput,
  Animated,
  PermissionsAndroid,
  Pressable
} from 'react-native';
import TabIcon from 'react-native-vector-icons/AntDesign';
import SplashScreen from 'react-native-splash-screen';
import { withNavigation } from 'react-navigation';

// Components
import { Fonts } from '../utils/fonts';
import styles from './style';
// import Drawer from '../../navigation'

const { width, height } = Dimensions.get('window');
const IC_ARR_DOWN = require('../../Images/down.png');
const IC_ARR_UP = require('../../Images/up.png');

class Splash extends Component {
  static navigationOptions = {
    title: 'Home',
    tabBarIcon: ({ tintColor }) => (
      <TabIcon name="home" color={tintColor} size={height * .04} />
    )
  };
  constructor() {
    super();
    this.state = {
      down: false,
      points: 0,
      expanded: false,
      asdf: false,
      animatedValue: new Animated.Value(0),
      animatedValue1: new Animated.Value(0),
    };
    if (Platform.OS === 'android') {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }
  async requestLocationPermission() {
    try {
      const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      )
    //   if (granted === PermissionsAndroid.RESULTS.GRANTED) {
    //     // console.log('Access',)
    //     // alert("You've access for the Location");
    //   } else {
    //     // alert("You don't have access for the Location");
    //     // console.log('Denied',)
    //   }
    }
    catch (err) {
      alert(err)
    }
  };


  componentDidMount() {
    SplashScreen.hide()
    this.requestLocationPermission()
  }

  render() {
    let { animatedValue1, animatedValue } = this.state;
    return (

      <View style={styles.container}>
        <StatusBar backgroundColor="#155AAA" barStyle="default" hidden={false} showHideTransition={'fade'} />
        <View style={{ elevation: width * .05 }}>
          <Image
            source={require('../../Images/loogo.png')}
            resizeMode='contain'
            style={{ height: height * .14, }}
          />
        </View>

        <View style={{ height: height * .5, justifyContent: "space-between", backgroundColor: '' }}>
          {/* <View style={styles.bottonContainer}> */}
          <TouchableOpacity onPress={() => this.props.navigation.navigate('DashBoard')} style={styles.mainBotton}>
            <Image
              source={require('../../Images/dashBack2.jpg')}
              style={styles.backgroundImageDash}
              blurRadius={.5}
            />
            <Text style={styles.bottonHeading}>
              Dashboard
                </Text>
            {/* </View> */}
          </TouchableOpacity>
          <TouchableOpacity onPress={() => this.props.navigation.navigate('Properties')} style={styles.mainBotton}>
            <View style={styles.bottonContainer}>
              <Image
                source={require('../../Images/propBack.jpg')}
                style={styles.backgroundImageDash}
                blurRadius={1.5}
              />
              <Text style={styles.bottonHeading}>
                Properties
              </Text>
            </View>
          </TouchableOpacity>
        </View>
        {/* <Drawer /> */}
      </View >
    );
  }
}

export default withNavigation(Splash);