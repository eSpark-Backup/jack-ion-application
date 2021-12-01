/**
 * @format
 */
import 'react-native-reanimated';
import {AppRegistry, LogBox} from 'react-native';
import App from './scr/Splash/index';
// import App from './scr/Home/Index';
// import App from './CameraCopy';
import {name as appName} from './app.json';
import messaging from '@react-native-firebase/messaging';
import PushNotification from 'react-native-push-notification';

LogBox.ignoreAllLogs(true);

messaging().setBackgroundMessageHandler(async (remoteMessage) => {
  console.log('Message handled in the background!', remoteMessage);
});

PushNotification.configure({
  onNotification: function (notification) {
    console.log('NOTIFICATION:', notification);
  },
});

AppRegistry.registerComponent(appName, () => App);
