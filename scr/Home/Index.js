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
import { connect } from 'react-redux';
import { fetchPropetry, loadMoreData } from '../Store/Action/properties.action';
import { fetchUserDataForMessaging } from '../Store/Action/user.action';
import firestore from '@react-native-firebase/firestore';
// import { Loader } from '../components/Loader';
// import { FirebaseService } from '../components/chat/firebase/FirebaseService';
// const firebaseService = new FirebaseService();

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

  constructor(props) {
    super(props);
    this.state = {
      down: false,
      // user: null
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
  fetchMessages = async () => {
    const snapshot = await firestore().collection('Messages').get()
    let newArray = [];
    snapshot?.docs?.forEach((queryDocSnapshot) => {
      const profile = queryDocSnapshot.data();
      const { ref, ...profileSerialisable } = profile;
      newArray.push(profileSerialisable);
    });
    this.props.fetchUserDataForMessaging(newArray);
  }
  async componentDidMount() {
    messaging().onNotificationOpenedApp(async (notification) => {
      console.log('Initial notification', notification);
      // pushNotification(notification);
    });
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
      this.onAppBootstrap();
      PushNotification.configure({
        onNotification: async (notification) => {
          // console.log('Notification woke from sleep', notification);

          notification?.userInteraction ? null : pushNotification(notification);
          const clicked = notification?.userInteraction;
          notification?.id ? PushNotification.cancelLocalNotification(`${notification?.id}`) : null;

          if (clicked) {
            console.log('Notification Clicked', notification);
            if (notification?.data?.title?.includes('Meter') || notification?.message?.includes('Meter')) {
              const regex = /\d+/g;
              const matches = notification?.message ? notification?.message?.match(regex) : null;  // creates array from matches
              const idInNumber = matches ? Number(matches[0]) : null;
              const data = notification?.data?.id ? JSON.parse(notification?.data?.id) : null;
              const idFromData = data?.property?.id;
              // const item = { id: 266 }
              const item = { id: idInNumber ? idInNumber : idFromData }
              // console.log('data from click', data);
              this.props.navigation.navigate("Equip", { item: { item: data.property } })
            } else {
              const regex = /\d+/g;
              const matches = notification?.message ? notification?.message?.match(regex) : null; // creates array from matches
              const idInNumber = matches ? Number(matches[0]) : null;
              const data = notification?.data?.id ? JSON.parse(notification?.data?.id) : null;
              const idFromData = data?.id;
              const item = { id: idInNumber ? idInNumber : idFromData }
              // console.log('data from click prop', data);
              this.props.navigation.navigate("Detail", { item: { item: data } })
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
        // this.createChannels();
        const unsubscribe = messaging().onMessage(async (remoteMessage) => {
          pushNotification(remoteMessage);
        });
        return unsubscribe;
      }
    }
    this.props.fetchPropetry();
    this.fetchMessages();
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

const mapStateToProps = (state, ownProps) => ({
  propList: state.propertyReducer.propList,
  isLoading: state.propertyReducer.isLoading,
  offset: state.propertyReducer.offset,
  listLoader: state.propertyReducer.listLoader,
  limitExceed: state.propertyReducer.limitExceed,
  user: state
});

const mapDispatchToProps = (dispatch) => {
  return {
    // dispatching plain actions
    fetchPropetry: () => dispatch(fetchPropetry()),
    loadMoreData: (data) => dispatch(loadMoreData(data)),
    fetchUserDataForMessaging: (data) => dispatch(fetchUserDataForMessaging(data))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(withNavigation(Splash));
