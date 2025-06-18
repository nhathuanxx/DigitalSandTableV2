import { enableScreens } from "react-native-screens";
enableScreens();
import React, { useEffect, Fragment, useState } from "react";
import { connect } from "react-redux";
import { NavigationContainer } from "@react-navigation/native";
import { SafeAreaInsetsContext } from "react-native-safe-area-context";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Linking, Alert, Platform } from 'react-native'
// import * as loginAction from "@app/storage/action/login";
// import * as appActions from "./storage/action/app";
import constants from "@app/config/constants";
import { getTokens, getPartner, getUserInfo } from "@app/libs/auth";
import FlashMessage from "react-native-flash-message";
import storage from "@app/libs/storage";
import ChooseLocation from "./modules/screens/ChooseLocation/ChooseLocation";
import Overview from "./modules/screens/Home/OverView/Overview";
import Route from "@app/modules/screens/Route/Route"
import i18n from "@app/i18n/i18n";
import MapDisplaySetting from "@app/modules/screens/Settings/MapDisplaySetting/MapDisplaySetting";
import WarningSetting from "@app/modules/screens/Settings/WarningSetting/WarningSetting";
import SystemSetting from "@app/modules/screens/Settings/SystemSetting/SystemSetting";
import SearchScreen from "./modules/screens/Search/SearchScreen/SearchScreen";
// import Search from "./modules/screens/Search/Search";
import SearchDirections from "./modules/screens/Search/SearchDirections/SearchDirections";
import FavoriteAddress from "./modules/screens/Search/FavoriteAddress/FavoriteAddress";
import LocationInfo from "./modules/screens/Search/LocationInfo/LocationInfo";
import LocationSelection from "./modules/screens/Route/LocationSelection/LocationSelection";
import { RadioProvider } from "./modules/screens/Radio/RadioProvider";
import LocationList from "./modules/screens/Search/LocationList/LocationList";
import AsyncStorage from '@react-native-community/async-storage';
import { ThemeProvider } from "./modules/components/context/ThemeContext";
import Account from "@app/modules/screens/Account/Account";
import Violation from "@app/modules/screens/Account/Violation/Violation";
import { startBackgroundFetch } from "./libs/backgroundtask";
import { navigationRef, navigate } from "@app/libs/RootNavigation";
import MoveHistory from "./modules/screens/MoveHistory/MoveHistory";
import Province from "@app/modules/screens/Account/Camera/Province/Province";
import ProvinceCamera from "@app/modules/screens/Account/Camera/ProvinceCamera/ProvinceCamera";
import CameraDetail from "@app/modules/screens/Account/Camera/CameraDetail/CameraDetail";
import { configurePushNotifications, requestNotificationPermission } from "@app/libs/NotificationService";
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import Geolocation from 'react-native-geolocation-service';
import { OrientationProvider } from './modules/components/context/OrientationContext';
import { initializeSslPinning, addSslPinningErrorListener } from 'react-native-ssl-public-key-pinning';
import { SSL_PINNING_CONFIG } from "@app/config/pinning";



import Login from "@app/modules/screens/Auth/Login"
import Map from "@app/modules/screens/Map/Map"
import { AuthProvider } from "@app/modules/context/AuthContext";
import { GlobalProvider } from "@app/modules/context/GlobalContext";
import CustomAlert from '@app/modules/components/alert/CustomAlert';
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
          <ThemeProvider>
            <OrientationProvider>
              <RadioProvider>
                <GlobalProvider>
                  <AuthProvider>
                    {/* <NavigationContainer ref={navigationRef}>
                      {
                        <Stack.Navigator
                          initialRouteName="Login"
                          screenOptions={{
                            headerShown: false,
                          }}
                        >
                          <Stack.Screen name="Login" component={Login} />
                          <Stack.Screen name="Map" component={Map} />
                        </Stack.Navigator>
                      }
                      <CustomAlert />
                      <FlashMessage position="top" style={{ marginTop: 16 }} />
                    </NavigationContainer> */}
                    <AppNavigator />
                  </AuthProvider>
                </GlobalProvider>
              </RadioProvider>
            </OrientationProvider>
          </ThemeProvider>
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
