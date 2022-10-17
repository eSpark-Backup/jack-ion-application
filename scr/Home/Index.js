import React, { Component } from 'react';
import {
  View,
  Image,
  StatusBar,
  Dimensions,
  TouchableOpacity,
  UIManager,
  Alert,
  PermissionsAndroid,
  BackHandler,
  Platform,
} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import SplashScreen from 'react-native-splash-screen';
import { withNavigation } from 'react-navigation';
import messaging from '@react-native-firebase/messaging';
import PushNotification from 'react-native-push-notification';
import EncryptedStorage from 'react-native-encrypted-storage';

// Components
import styles from './style';
import { PERMISSIONS, request } from 'react-native-permissions';
import API from '../api/SeviceApi';
import TextReuseableComponent from '../components/Text/index';
import { pushNotification } from '../utils/helperFunction';

import navigationService from '../../navigationService';
const { width, height } = Dimensions.get('window');
let fcmToken = '';
class Splash extends Component {
  // static contextType = MainContext
  static navigationOptions = {
    title: 'Home',
    tabBarIcon: ({ tintColor }) => (
      <AntDesign name="home" color={tintColor} size={height * 0.04} />
    ),
  };

  constructor() {
    super();
    this.state = {
      down: false,
    };
    if (Platform.OS === 'android') {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }

  async requestLocationPermission() {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        );
      } catch (err) {
        alert(err);
      }
    }
    if (Platform.OS == 'ios') {
      request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE)
        .then((result) => {
          console.log('result---->', result);
        })
        .catch((e) => {
          alert(err);
        });
    }
  }

  async componentDidMount() {
    const token = await EncryptedStorage.getItem('user_token');

    if (token != null) {
      API.setHeader('Authorization', 'Bearer ' + token);
    }
    this.backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      this.backAction,
    );
    SplashScreen.hide();
    this.requestLocationPermission();
    if (Platform.OS === 'android') {
      this.createChannels();
      this.onAppBootstrap();

      PushNotification.configure({
        onNotification: async function (notification) {
          pushNotification(notification);
          const clicked = notification?.userInteraction;

          if (clicked) {
            // console.log('Notification Clicked', notification);
            PushNotification.removeAllDeliveredNotifications();
            if(notification?.data?.title?.includes('Meter') || notification?.message?.includes('Meter')) {
                const regex = /\d+/g;
                const matches = notification?.message ? notification?.message?.match(regex) : null;  // creates array from matches
                const idInNumber = matches ? Number(matches[0]) : null;    
                const data = notification?.data?.id ? JSON.parse(notification?.data?.id) : null;
                const idFromData = data?.property?.id;
                // const item = { id: 266 }
                const item = { id: idInNumber ? idInNumber : idFromData }
                navigationService.navigate("Equip", { item: { item: item } })
            } else {
                const regex = /\d+/g;
                const matches = notification?.message ? notification?.message?.match(regex) : null; // creates array from matches
                const idInNumber =matches ? Number(matches[0]) : null;
                const data = notification?.data?.id ? JSON.parse(notification?.data?.id) : null;
                const idFromData = data?.id;
                const item = { id: idInNumber ? idInNumber : idFromData }
                navigationService.navigate("Detail", { item: { item: item } })
            }
          } else {
            console.log('Notification Delievered', notification);
          }
        }
      });
    } else {
      const authStatus = await messaging().requestPermission();
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

      if (enabled) {
        this.onAppBootstrap();
        this.createChannels();
        const unsubscribe = messaging().onMessage(async (remoteMessage) => {
          pushNotification(remoteMessage);
        });
        return unsubscribe;
      }
    }
  }

  backAction = () => {
    if (this.props?.navigation?.isFocused()) {
      Alert.alert('Hold on!', 'Are you sure you want to go back?', [
        {
          text: 'Cancel',
          onPress: () => null,
          style: 'cancel',
        },
        { text: 'YES', onPress: () => BackHandler.exitApp() },
      ]);
      return true;
    }
  };

  componentWillUnmount() {
    this.backHandler.remove();
  }

  async onAppBootstrap() {
    // Register the device with FCM
    await messaging().registerDeviceForRemoteMessages();

    // Get the token
    fcmToken = await messaging().getToken();

    console.log("fcmToken fcmToken", fcmToken)

    let tokenfcm = {
      fcm_token: fcmToken,
    };
    await API.post('/user/set-fcm-token', tokenfcm);

  }

  createChannels = () => {
    PushNotification.createChannel({
      channelId: 'test-id',
      channelName: 'Test-channel',
    });
  };


  render() {
    return (
      <View style={styles.container}>
        <StatusBar
          backgroundColor="#155AAA"
          barStyle="default"
          hidden
          showHideTransition={'fade'}
        />
        <View style={{ elevation: width * 0.05 }}>
          <Image
            source={require('../../Images/loogo.png')}
            resizeMode="contain"
            style={{ height: height * 0.15 }}
          />
        </View>
        <View
          style={{
            height: height * 0.5,
            justifyContent: 'space-between',
            backgroundColor: '',
          }}>
          <TouchableOpacity
            onPress={() => this.props.navigation.navigate('DashBoard')}
            style={styles.mainBotton}>
            <Image
              source={require('../../Images/dashBack2.jpg')}
              style={styles.backgroundImageDash}
              blurRadius={0.5}
            />
            <TextReuseableComponent title style={styles.bottonHeading} value={"Dashboard"} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => this.props.navigation.navigate('Properties')}
            style={styles.mainBotton}>
            <View style={styles.bottonContainer}>
              <Image
                source={require('../../Images/propBack.jpg')}
                style={styles.backgroundImageDash}
                blurRadius={1.5}
              />
              <TextReuseableComponent title style={styles.bottonHeading} value={"Properties"} />
            </View>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

export default withNavigation(Splash);
