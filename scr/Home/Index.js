import React, {Component} from 'react';
import {
  Text,
  View,
  Image,
  StatusBar,
  Dimensions,
  TouchableOpacity,
  UIManager,
  Alert,
  PermissionsAndroid,
  BackHandler,
} from 'react-native';
import TabIcon from 'react-native-vector-icons/AntDesign';
import SplashScreen from 'react-native-splash-screen';
import {withNavigation} from 'react-navigation';
import messaging from '@react-native-firebase/messaging';
import PushNotification from 'react-native-push-notification';
let fcmToken = '';
// Components
import styles from './style';

const {width, height} = Dimensions.get('window');
class Splash extends Component {
  // static contextType = MainContext
  static navigationOptions = {
    title: 'Home',
    tabBarIcon: ({tintColor}) => (
      <TabIcon name="home" color={tintColor} size={height * 0.04} />
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
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      );
      //   if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      //     // console.log('Access',)
      //     // alert("You've access for the Location");
      //   } else {
      //     // alert("You don't have access for the Location");
      //     // console.log('Denied',)
      //   }
    } catch (err) {
      alert(err);
    }
  }

  componentDidMount() {
    this.backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      this.backAction,
    );
    SplashScreen.hide();
    this.onAppBootstrap();
    this.createChannels();
    this.requestLocationPermission();
    const unsubscribe = messaging().onMessage(async (remoteMessage) => {
      // Alert.alert('A new FCM message arrived!', JSON.stringify(remoteMessage));
      this.showNotifications(remoteMessage);
    });
    return unsubscribe;
  }

  backAction = () => {
    Alert.alert('Hold on!', 'Are you sure you want to go back?', [
      {
        text: 'Cancel',
        onPress: () => null,
        style: 'cancel',
      },
      {text: 'YES', onPress: () => BackHandler.exitApp()},
    ]);
    return true;
  };

  componentWillUnmount() {
    this.backHandler.remove();
  }

  async onAppBootstrap() {
    // Register the device with FCM
    await messaging().registerDeviceForRemoteMessages();

    // Get the token
    fcmToken = await messaging().getToken();

    console.log('TOKEN_______sss', fcmToken);
    // Save the token
    // await postToApi('/users/1234/tokens', {token});
  }

  createChannels = () => {
    PushNotification.createChannel({
      channelId: 'test-id',
      channelName: 'Test-channel',
    });
  };

  showNotifications = (item) => {
    console.log('kia mila items', item.notification);
    PushNotification.localNotification({
      channelId: 'test-id',
      title: item.notification.title,
      message: item.notification.body,
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
        <View style={{elevation: width * 0.05}}>
          <Image
            source={require('../../Images/loogo.png')}
            resizeMode="contain"
            style={{height: height * 0.14}}
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
            <Text style={styles.bottonHeading}>Dashboard</Text>
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
              <Text style={styles.bottonHeading}>Properties</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

export default withNavigation(Splash);
