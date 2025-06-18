import PushNotification from 'react-native-push-notification';
import { navigate } from './RootNavigation';
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import { Platform } from 'react-native';

const requestNotificationPermission = async () => {
  if (Platform.OS === 'android' && Platform.Version >= 33) {
    try {
      // Kiểm tra xem quyền đã được cấp hay chưa
      const status = await check(PERMISSIONS.ANDROID.POST_NOTIFICATIONS);

      if (status === RESULTS.GRANTED) {
        console.log("Notification permission already granted");
      } else if (status === RESULTS.DENIED) {
        // Yêu cầu quyền nếu chưa được cấp
        const result = await request(PERMISSIONS.ANDROID.POST_NOTIFICATIONS);
        if (result === RESULTS.GRANTED) {
          console.log("Notification permission granted");
        } else {
          console.log("Notification permission denied");
        }
      } else if (status === RESULTS.BLOCKED) {
        console.log("Notification permission is blocked. Go to settings to enable it.");
      } else {
        console.log("Notification permission status:", status);
      }
    } catch (error) {
      console.log("Error checking notification permission:", error);
    }
  } else {
    console.log("Notification permission not required for this Android version");
  }
};

const configurePushNotifications = () => {
  PushNotification.configure({
    onNotification: function (notification) {
      console.log("NOTIFICATION: ---------", notification);

      if (notification.userInteraction) {
        console.log('onlick noti ----------------- ');
        const { screen, params } = notification.data;
        if (screen) {
          navigate(screen, params);
        }
      }
    },
    permissions: {
      alert: true,
      badge: true,
      sound: true,
    },
    popInitialNotification: true,
    requestPermissions: true
  });

  if (Platform.OS === 'android') {
    PushNotification.createChannel(
      {
        channelId: "violationGoong",
        channelName: "Violation Goong",
        channelDescription: "Violation Goong",
        soundName: "default",
        importance: PushNotification.Importance.HIGH,
        vibrate: true,
      },
      (created) => console.log(`createChannel returned '${created}'`)
    );
  }

};

// const scheduleNotificationAtTime = (hour, minute, title, message) => {
//   // Lấy thời gian hiện tại
//   const now = new Date();

//   // Tạo thời gian cho thông báo
//   const scheduleTime = new Date(now);
//   scheduleTime.setHours(hour);
//   scheduleTime.setMinutes(minute);
//   scheduleTime.setSeconds(0);

//   // Nếu thời gian đã qua trong ngày hôm nay, đặt cho ngày mai
//   if (scheduleTime.getTime() < now.getTime()) {
//     scheduleTime.setDate(scheduleTime.getDate() + 1);
//   }

//   PushNotification.localNotificationSchedule({
//     title: title,
//     message: message,
//     date: scheduleTime,
//     allowWhileIdle: true,
//     repeatType: 'day',
//   });
// };

const sendLocalNotification = (title, message, screen, params) => {
  PushNotification.localNotification({
    channelId: "violationGoong",
    title: title,
    message: message,
    playSound: true,
    soundName: 'default',
    data: { screen, params },
    largeIcon: 'ic_notification',
    smallIcon: 'ic_notification',
    color: '#2d66fe',
  });
};

export { configurePushNotifications, sendLocalNotification, requestNotificationPermission };