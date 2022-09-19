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
import { object } from 'yup/lib/locale';

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
      this.onAppBootstrap();
      this.createChannels();
      const unsubscribe = messaging().onMessage(async (remoteMessage) => {
        // Alert.alert('A new FCM message arrived!', JSON.stringify(remoteMessage));
        this.showNotifications(remoteMessage);
      });
      return unsubscribe;
    } else {
      const authStatus = await messaging().requestPermission();
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

      if (enabled) {
        this.onAppBootstrap();
        this.createChannels();
        const unsubscribe = messaging().onMessage(async (remoteMessage) => {
          this.showNotifications(remoteMessage);
        });
        return unsubscribe;
      }
    }
  }

  backAction = () => {
    if(this.props?.navigation?.isFocused()) {
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

  showNotifications = (item) => {
    PushNotification.localNotification({
      channelId: 'test-id',
      title: item.notification.title,
      message: item.notification.body,
    });
  };

  solveMeFirst = () => {
    // var arr = ["a", "b","b","b", "c","c","c","c", "d", "d", "e"];
    // // find the sum of the elements in the array
    // let obj = {};
    // for(let i = 0; i < arr.length; i++) {
    //   let key = arr[i];
    //   let num = 1;

    //   obj[key] = obj.hasOwnProperty(key) ? obj[key] + 1  : num;
    // }
    // console.log(obj);
    // return [obj];

    // let arr = [1, 2, 3, 5, 2];
    // // summ every element in the array
    // // return arr.reduce((acc, next) => acc + next)
    // let sum = 0;
    // for(let i = 0; i < arr.length; i++) {
    //   console.log('sum', sum);
    //   sum = sum + arr[i];
    // }
    // console.log('sum', sum);
    // return [sum];

    // Alice and Bob each created one problem for Haceeernlk. A reviewer rates the two challenges,
    // rewarding points on a scale from 1 to 100 for three categories: Find their comparison points by comparing a[0] with b[0] and so forth;

    var a = [4, 3, 4];
    var b = [5, 5, 6];
    var result = [0, 0];
    for(let i = 0; i < a.length; i++) {
      let aliceValue = a[i];
      let bobValue = b[i];
      if (aliceValue > bobValue) {
        result[0]++;
      } else if (bobValue > aliceValue) {
        result[1]++;
      }
    }
    console.log(result);
    return result;



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
          {/* <TouchableOpacity
            onPress={() => this.props.navigation.navigate('DashBoard')}
            style={styles.mainBotton}>
            <Image
              source={require('../../Images/dashBack2.jpg')}
              style={styles.backgroundImageDash}
              blurRadius={0.5}
            />
            <TextReuseableComponent title style={styles.bottonHeading} value={"Dashboard"} />
          </TouchableOpacity> */}
          <View>
            <TextReuseableComponent value={this.solveMeFirst()?.map((item) => <TextReuseableComponent value={item} />)} />
          </View>
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
