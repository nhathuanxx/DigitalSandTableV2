import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { Platform, PermissionsAndroid, Alert, BackHandler } from "react-native";
import Geolocation from 'react-native-geolocation-service';
import { check, request, PERMISSIONS, RESULTS, openSettings } from "react-native-permissions";
import DeviceInfo from "react-native-device-info";


const GlobalContext = createContext(undefined);

export const GlobalProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [location, setLocation] = useState(null);
  const [deviceId, setDeviceId] = useState(null);

  const checkAndRequestPermission = async () => {
    try {
      if (Platform.OS === "android") {
        const status = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);
        if (status) return true;

        const result = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);
        if (result === PermissionsAndroid.RESULTS.GRANTED) return true;

        if (result === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
          // Từ chối vĩnh viễn, phải mở setting
          return false;
        }
        return false;
      } else {
        const status = await check(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
        if (status === RESULTS.GRANTED || status === RESULTS.LIMITED) return true;

        if (status === RESULTS.BLOCKED) {
          // Từ chối vĩnh viễn
          return false;
        }

        const result = await request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
        return result === RESULTS.GRANTED || result === RESULTS.LIMITED;
      }
    } catch (error) {
      console.warn("Lỗi xin quyền vị trí:", error);
      return false;
    }
  };

  const confirmExitOrRetry = () => {
    Alert.alert(
      "Yêu cầu quyền vị trí",
      "Ứng dụng cần quyền truy cập vị trí để hoạt động chính xác. Bạn có muốn thử lại hoặc mở cài đặt để bật quyền?",
      [
        {
          text: "Mở cài đặt",
          style: "default",
          onPress: () => {
            openSettings().catch(() => {
              Alert.alert("Không thể mở cài đặt");
            });
          },
        },
        {
          text: "Thoát",
          style: "destructive",
          onPress: () => BackHandler.exitApp(),
        },
      ],
      { cancelable: false }
    );
  };

  useEffect(() => {
    let watchId = null;

    const init = async () => {
      const granted = await checkAndRequestPermission();

      if (!granted) {
        confirmExitOrRetry();
        return;
      }

      // Lấy deviceId 1 lần
      const id = await DeviceInfo.getUniqueId();
      setDeviceId(id);

      // Bắt đầu theo dõi vị trí thay đổi liên tục
      watchId = Geolocation.watchPosition(
        pos => {
          setLocation({
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
          });
        },
        err => {
          console.error("Lỗi lấy vị trí:", err);
          // Nếu bị lỗi nghiêm trọng có thể hỏi lại quyền hoặc thoát
          // Bạn có thể xử lý thêm ở đây nếu muốn
        },
        {
          enableHighAccuracy: true,
          distanceFilter: 10, // chỉ cập nhật khi di chuyển > 10m
          interval: 5000, // Android: lấy vị trí mỗi 5 giây
          fastestInterval: 2000, // Android
          showsBackgroundLocationIndicator: false, // iOS, tắt indicator nếu không cần
        }
      );
    };

    init();

    return () => {
      if (watchId !== null) {
        Geolocation.clearWatch(watchId);
      }
    };
  }, []);

  const isReady = location !== null && deviceId !== null;

  return (
    <GlobalContext.Provider value={{ isLoading, setIsLoading, location, deviceId }}>
      {isReady ? children : null}
    </GlobalContext.Provider>
  );
};

export const useGlobal = () => {
  const context = useContext(GlobalContext);
  if (!context) {
    throw new Error("useGlobal must be used within a GlobalProvider");
  }
  return context;
};
