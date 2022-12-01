/**
 * @format
 */
import 'react-native-reanimated';
import { AppRegistry, LogBox } from 'react-native';
import App from './scr/Splash/index';
import { name as appName } from './app.json';
import messaging from '@react-native-firebase/messaging';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { store } from './scr/Store/store';

function dispatchUid(uid) {
return {
  type: "FETCH_USER_UID_FOR_MESSAGING",
  payload: uid
}
}

auth()
  .signInAnonymously()
  .then((data) => {
    console.log('User signed in anonymously', data);
    store.dispatch(dispatchUid(data.user.uid));
  })
  .catch(error => {
    if (error.code === 'auth/operation-not-allowed') {
      console.log('Enable anonymous in your firebase console.');
    }

    console.error(error);
  });

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
