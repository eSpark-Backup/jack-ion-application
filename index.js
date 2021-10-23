/**
 * @format
 */
import 'react-native-reanimated';
import {AppRegistry, LogBox} from 'react-native';
import App from './scr/Splash/index';
// import App from './scr/Home/Index';
// import App from './CameraCopy';
import {name as appName} from './app.json';

LogBox.ignoreAllLogs(true);

AppRegistry.registerComponent(appName, () => App);
