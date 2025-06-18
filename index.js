import { AppRegistry, YellowBox } from 'react-native';
import GoongMap from './App';
import { name as appName } from './app.json';
// import BackgroundGeolocation from "./app/modules/location/backgroundGeolocation";
import messaging from '@react-native-firebase/messaging';
import { Platform } from "react-native";
import PushNotification from "react-native-push-notification";


// ignore specific yellowbox warnings
YellowBox.ignoreWarnings(["Require cycle:", "Remote debugger"]);

// Make BackgroundGeolocation API global for handy access in Javascript Debugger console
// global.BackgroundGeolocation = BackgroundGeolocation;

// import BackgroundFetch from "react-native-background-fetch";

messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('Message handled in the background!', remoteMessage);

  Platform.OS === 'android' &&
    PushNotification.localNotification({
      channelId: 'GoongMap',
      message: remoteMessage.body,
      title: remoteMessage.title,
      largeIcon: 'ic_launcher',
      smallIcon: 'ic_notification',
      data: remoteMessage.data,
    });
});

AppRegistry.registerComponent(appName, () => GoongMap);

/**
 * BackgroundGeolocation Headless JS task.
 * For more information, see:  https://github.com/transistorsoft/react-native-background-geolocation/wiki/Android-Headless-Mode
 */
// let BackgroundGeolocationHeadlessTask = async (event) => {
//     let params = event.params;
//     console.log('[*** BackgroundGeolocation HeadlessTask] -', event.name, params);

//     switch (event.name) {
//         case 'heartbeat':
//             // Use await for async tasks
//             let location = await BackgroundGeolocation.getCurrentPosition({
//                 samples: 1,
//                 persist: false
//             });
//             console.log('[BackgroundGeolocation HeadlessTask] - getCurrentPosition:', location);
//             break;
//     }
// };


// BackgroundGeolocation.registerHeadlessTask(BackgroundGeolocationHeadlessTask);

// /**
//  * BackgroundFetch Headless JS Task.
//  * For more information, see:  https://github.com/transistorsoft/react-native-background-fetch#config-boolean-enableheadless-false
//  */
// let BackgroundFetchHeadlessTask = async (event) => {
//     console.log('[BackgroundFetch HeadlessTask] start');
//     // Important:  await asychronous tasks when using HeadlessJS.
//     let location = await BackgroundGeolocation.getCurrentPosition({persist: false, samples: 1});
//     // Required:  Signal to native code that your task is complete.
//     // If you don't do this, your app could be terminated and/or assigned
//     // battery-blame for consuming too much time in background.
//     console.log('[BackgroundFetch HeadlessTask] finished');
//     BackgroundFetch.finish();
// };


// // Register your BackgroundFetch HeadlessTask
// BackgroundFetch.registerHeadlessTask(BackgroundFetchHeadlessTask);