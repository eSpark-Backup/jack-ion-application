/**
 * @format
 */
import 'react-native-reanimated';
import { AppRegistry, LogBox } from 'react-native';
import App from './scr/Splash/index';
import { name as appName } from './app.json';
import messaging from '@react-native-firebase/messaging';

// import { pushNotification } from './scr/utils/helperFunction';
LogBox.ignoreAllLogs(true);
messaging().setBackgroundMessageHandler(async (notification) => {
  console.log('Message handled in the background!', notification);
  // pushNotification(notification);
});
messaging().onMessage(async (notification) => {
  console.log('Notification handled in the Foreground!', notification);
  // pushNotification(notification);
});
AppRegistry.registerComponent(appName, () => App);
