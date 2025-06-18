import React, { useEffect, useRef } from "react";
import { connect } from "react-redux";
import { Platform, Text, View } from "react-native";
import Application from "./application";
import messaging from "@react-native-firebase/messaging";
import * as asyncUtil from "@app/storage/asynUtils";

import PushNotification from "react-native-push-notification";
import PushNotificationIOS from "@react-native-community/push-notification-ios";
import { QueryClient, QueryClientProvider } from "react-query";
import { Colors } from "@app/theme";
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
    },
  },
});
const Root = (props) => {
  // const toast = useRef();

  useEffect(() => {
    registerAppWithFCM();
    checkPermission();

    // configLocalNotification();
    eventNotification();
  }, []);

  const configLocalNotification = () => {
    PushNotification.configure({
      onRegister: function (token) {},
      onNotification: function (notification) {
        if (!notification) {
          return;
        }
        if (!notification.userInteraction) {
          notification.userInteraction = true;
          displayNotificationLocal(notification);
        } else {
          return;
        }

        if (Platform.OS === "ios") {
          notification.finish(PushNotificationIOS.FetchResult.NoData);
        }
      },
      permissions: {
        alert: true,
        badge: true,
        sound: true,
      },
      popInitialNotification: true,
      requestPermissions: true,
    });
  };

  const goToHome = () => {
    // this.props.navigation.navigate(
    //   "MainStack",
    //   {},
    //   CommonActions.navigate({
    //     routeName: "RouteScreen",
    //   }),
    // );
    // this.props.navigation.navigate("RouteScreen");
  };

  const eventNotification = () => {
    // Mo Notification khi ở background
    messaging().onNotificationOpenedApp((remoteMessage) => {
      console.log("remoteMessage", remoteMessage);
      if (remoteMessage) {
        const notification = remoteMessage.notification;
        onOpenNotification(notification);
      }
    });

    // Mo Notification khi app killed
    messaging()
      .getInitialNotification()
      .then((remoteMessage) => {
        console.log("remoteMessage getInitialNotification", remoteMessage);
        if (remoteMessage) {
          const notification = remoteMessage.notification;
          onOpenNotification(notification);
        } else {
          // goToHome();
        }
      });

    // Nhan Notification khi app Forceground
    messaging().onMessage(async (remoteMessage) => {
      console.log("remoteMessage Forceground", remoteMessage);
      if (remoteMessage) {
        let notification = remoteMessage.notification;
        displayNotificationLocal(notification);
      }
    });

    // Refresh token
    messaging().onTokenRefresh((fcmToken) => {
      // TODO: Gửi token lên server để refresh
      asyncUtil.insert(asyncUtil.KEY_FCM_TOKEN, fcmToken, () => {});
    });
  };

  const displayNotificationLocal = (notification) => {
    if (!notification) {
      return;
    }
    const options = {
      soundName: "default",
      playSound: true,
    };
    showNotification(
      0,
      notification.title,
      notification.message || notification.body,
      notification,
      options,
    );
  };

  const onOpenNotification = (notify) => {
    props.navigation.navigate("MainScreen");
  };

  const showNotification = (id, title, message, data = {}, options = {}) => {
    PushNotification.localNotification({
      ...buildAndroidNotification(id, title, message, data, options),
      ...buildIOSNotification(id, title, message, data, options),
      title: title || "",
      message: message || "",
      playSound: options.playSound || false,
      soundName: options.soundName || "default",
      userInteraction: false,
    });
    try {
      // if (toast) {
      //   toast.current.show(message, 2000);
      // }
    } catch (e) {
      console.log(e);
    }
  };

  const buildAndroidNotification = (
    id,
    title,
    message,
    data = {},
    options = {},
  ) => {
    return {
      id: id,
      autoCancel: true,
      largeIcon: options.largeIcon || "ic_launcher",
      smallIcon: options.smallIcon || "ic_notification",
      bigText: message || "",
      subText: title || "",
      vibrate: options.vibrate || true,
      vibration: options.vibration || 300,
      priority: options.priority || "high",
      importance: options.importance || "high",
      data: data,
    };
  };

  const buildIOSNotification = (
    id,
    title,
    message,
    data = {},
    options = {},
  ) => {
    return {
      alertAction: options.alertAction || "view",
      category: options.category || "",
      userInfo: {
        id: id,
        item: data,
      },
    };
  };

  const registerAppWithFCM = async () => {
    if (Platform.OS === "ios") {
      await messaging().registerDeviceForRemoteMessages();
      await messaging().setAutoInitEnabled(true);
    }
  };

  const checkPermission = async () => {
    const authorizationStatus = await messaging().hasPermission();

    if (authorizationStatus === messaging.AuthorizationStatus.AUTHORIZED) {
      getToken();
    } else if (
      authorizationStatus === messaging.AuthorizationStatus.PROVISIONAL
    ) {
      getToken();
    } else {
      requestPermission();
    }
  };

  const getToken = async () => {
    await messaging()
      .getToken()
      .then((fcmToken) => {
        console.log("fcmTOken", fcmToken);
        if (fcmToken) {
          asyncUtil.insert(asyncUtil.KEY_FCM_TOKEN, fcmToken, () => {});
        } else {
          console.log("[FCMService] User does not have a device token");
        }
      })
      .catch((error) => {
        console.log("***** token [FCMService] getToken rejected ", error);
      });
  };

  const requestPermission = () => {
    console.log("requestPermission");
    if (Platform.OS === "ios") {
      PushNotificationIOS.requestPermissions()
        .then(() => {
          getToken();
        })
        .catch((error) => {
          console.log("[FCMService] Request Permission rejected ", error);
        });
    } else {
      messaging()
        .requestPermission({
          alert: true,
          announcement: false,
          badge: true,
          provisional: false,
          sound: true,
        })
        .then(() => {
          getToken();
        })
        .catch((error) => {
          console.log("[FCMService] Request Permission rejected ", error);
        });
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
        <Application />
      </QueryClientProvider>
    </View>
  );
};

function mapStateToProps(state) {
  return {
    showLoading: state.app.showLoading,
  };
}

export default connect(mapStateToProps)(Root);
