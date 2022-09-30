/**
 * @format
 */
import 'react-native-reanimated';
import { AppRegistry, LogBox, Platform } from 'react-native';
import App from './scr/Splash/index';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import { name as appName } from './app.json';
import messaging from '@react-native-firebase/messaging';
import PushNotification from 'react-native-push-notification';

import { pushNotification } from './scr/utils/helperFunction';
import navigationService from './navigationService';
LogBox.ignoreAllLogs(true);
messaging().setBackgroundMessageHandler(async (remoteMessage) => {
  console.log('Message handled in the background!', remoteMessage);
});

PushNotification.configure({
  onNotification: function (notification) {
    console.log('Message handled in the foreground!:', notification);
    notification.finish(PushNotificationIOS.FetchResult.NoData);
    pushNotification(notification);

    const id = JSON.parse(notification?.data?.id)?.id;
    const item = JSON.parse(notification?.data?.id);

    console.log('id in data', item);
    const type = notification?.data?.type;
    if (type == 'property') {
      navigationService.navigate("Detail", { item: { item: item } })
    }
  }
});
AppRegistry.registerComponent(appName, () => App);
