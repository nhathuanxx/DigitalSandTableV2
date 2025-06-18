import { enableScreens } from "react-native-screens";
enableScreens();
import React, { useEffect, Fragment, useState } from "react";
import { connect } from "react-redux";
import { SafeAreaInsetsContext } from "react-native-safe-area-context";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Linking, Alert, Platform } from 'react-native'
import storage from "@app/libs/storage";
import i18n from "@app/i18n/i18n";
import { startBackgroundFetch } from "./libs/backgroundtask";
import { configurePushNotifications, requestNotificationPermission } from "@app/libs/NotificationService";
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import Geolocation from 'react-native-geolocation-service';
import { initializeSslPinning, addSslPinningErrorListener } from 'react-native-ssl-public-key-pinning';
import { SSL_PINNING_CONFIG } from "@app/config/pinning";
import { AuthProvider } from "@app/modules/context/AuthContext";
import { GlobalProvider } from "@app/modules/context/GlobalContext";
import AppNavigator from '@app/navigation/AppNavigator';


const Application = (props) => {
  const Stack = createNativeStackNavigator();
  useEffect(() => {
    const initSslPinning = async () => {
      await initializeSslPinning(SSL_PINNING_CONFIG);
    }
    initSslPinning();
    const subscription = addSslPinningErrorListener((error) => {
      console.log('lỗi ssl pinning: ', error.serverHostname);
    });
    return () => {
      subscription.remove();
    };
  }, []);


  useEffect(() => {
    const handleDeepLink = (event) => {
      const url = event.url;
      console.log('URL được mở:', url);
      // Thực hiện điều hướng dựa trên URL
    };

    // Lắng nghe khi ứng dụng được mở qua deep link
    Linking.addEventListener('url', handleDeepLink);

    // Xử lý deep link nếu ứng dụng đã được mở thông qua deep link
    // Linking.getInitialURL().then((url) => {
    //   if (url) {
    //     handleDeepLink({ url });
    //   }
    // });

    return () => {
      Linking.removeEventListener('url', handleDeepLink);
    };
  }, []);

  useEffect(async () => {
    startBackgroundFetch();
    const language = await storage.get('language');
    if (language) {
      i18n.locale = language;
    } else {
      i18n.locale = 'vi';
    }
    configurePushNotifications();
    requestNotificationPermission();
    requestLocationPermission();
    // scheduleNotificationAtTime(12, 0, "Goong thông báo", "Đã nhận thông báo");
  }, [])

  useEffect(async () => {
    const url = await Linking.getInitialURL();
    if (url) {
      console.log('applinks: ', url);
    } else {
      console.log(' no applinks: ');
    }
  }, []);


  const requestLocationPermission = async () => {
    if (Platform.OS === 'ios') {
      const status = await check(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
      if (status === RESULTS.GRANTED) {
        Geolocation.requestAuthorization();
        // getCurrentLocation();
      } else {
        const requestStatus = await request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
        if (requestStatus === RESULTS.GRANTED) {
          Geolocation.requestAuthorization();
          // getCurrentLocation();
        }
      }
    }
    // else if (Platform.OS === 'android') {
    //   const granted = await PermissionsAndroid.request(
    //     PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
    //   );
    //   // return granted === PermissionsAndroid.RESULTS.GRANTED;
    //   if (granted === PermissionsAndroid.RESULTS.GRANTED) {
    //     getCurrentLocation();
    //   }
    // }
  }

  return (
    <SafeAreaInsetsContext.Consumer>
      {(insets) => (
        <Fragment>
                <GlobalProvider>
                  <AuthProvider>
                    <AppNavigator />
                  </AuthProvider>
                </GlobalProvider>
        </Fragment>
      )}
    </SafeAreaInsetsContext.Consumer>
  );
};

const mapStateToProps = (state) => ({
});
const mapDispatchToProps = (dispatch) => ({
});

export default connect(mapStateToProps, mapDispatchToProps)(Application);
