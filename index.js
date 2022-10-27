/**
 * @format
 */
import 'react-native-reanimated';
import { AppRegistry, LogBox } from 'react-native';
import App from './scr/Splash/index';
import { name as appName } from './app.json';
import messaging from '@react-native-firebase/messaging';

LogBox.ignoreAllLogs(true);
messaging().setBackgroundMessageHandler(async (notification) => {
  console.log('Message handled in the background!', notification);
});
AppRegistry.registerComponent(appName, () => App);
