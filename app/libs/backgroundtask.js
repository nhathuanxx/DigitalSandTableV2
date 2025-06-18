import BackgroundFetch from 'react-native-background-fetch';
import * as db from "@app/storage/sqliteDbUtils";
import axios from "axios";
import { configurePushNotifications, sendLocalNotification } from "@app/libs/NotificationService";
import { fetchVehicleViolation } from './ViolationAxios';
import storage from './storage';
import i18n from "@app/i18n/i18n";
import { AppState, Platform } from 'react-native';
import { UNSANCTIONED } from '@app/config/constants';
import analytics from '@react-native-firebase/analytics';

const getVehicle = (plateNumber, categoryId) => {
  return new Promise((resolve, reject) => {
    db.getVehicleByPlateNumber(plateNumber, categoryId, (status, result) => {
      if (status) {
        resolve(result);
      } else {
        reject(new Error('lỗi lấy thông tin xe'));
      }
    });
  });
};

const setLanguage = async () => {
  const language = await storage.get('language');
  if (language) {
    i18n.locale = language;
  } else {
    i18n.locale = 'vi';
  }
}

const MyHeadlessTask = async (taskId) => {

  const logSelectContent = async () => {
    await analytics().logEvent('BackgroundFetchEvent', {
      content: 'background fetch violation',
      item_id: 'backgroundFetchId',
    });
  }

  logSelectContent();

  if (AppState.currentState !== 'active') {
    await setLanguage();
  }
  configurePushNotifications();
  // sendLocalNotification('Message', 'start background fetch');

  const vehicleDefaultString = await storage.get('vehicleDefault');
  const vehicleDefault = vehicleDefaultString ? JSON.parse(vehicleDefaultString) : undefined;
  if (!vehicleDefault) {
    console.log('vehicleDefault is undefined');
    BackgroundFetch.finish(taskId);
  } else {
    let vehicle = {}
    await getVehicle(vehicleDefault.plateNumberFormatted, vehicleDefault.categoryId)
      .then(result => {
        vehicle = result || {};
      }).catch(err => {
        console.log('error get vehicle: ', err);
        BackgroundFetch.finish(taskId);
      })
    try {
      const maxRetries = 3;
      const newController = new AbortController();
      let success = false;
      console.log('background fetch vehicle: --- ', vehicle);
      for (let attempt = 1; attempt <= maxRetries; attempt++) {
        console.log(`fetch ${attempt}: ${vehicle.plate_number_formatted}`);
        success = await fetchVehicleViolation(vehicle.plate_number_formatted, vehicle.id, vehicle.category_id, newController);
        if (success) {
          break;
        }
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      console.log('fetch end ---- ', success);
      // thông báo cả khi fetch api lỗi
      const count = await db.getViolationCountByStatusAndVehicleId(vehicle.id, UNSANCTIONED);

      if (count && count > 0) {
        sendLocalNotification(
          `${i18n.t(`account.attributes.ViolationNoti`)}`,
          i18n.t(`account.attributes.unsanctionedViolation`, { plateNumber: vehicle.plate_number, count: count }),
          'Violation',
          { vehicleId: vehicle.id, plateNumberFormatted: vehicle.plate_number_formatted, categoryId: vehicle.category_id }
        );
      }

      BackgroundFetch.finish(taskId);

    } catch (error) {
      console.error('Unexpected error in MyHeadlessTask:', JSON.stringify(error));
      BackgroundFetch.finish(taskId);
    }
  }

};

const configureBackgroundFetch = () => {

  const commonConfig = {
    minimumFetchInterval: 15, // Khoảng thời gian tối thiểu giữa các lần fetch (phút)
    stopOnTerminate: false,   // Tiếp tục chạy khi app bị terminate
    startOnBoot: true,       // Khởi động khi device boot
    enableHeadless: true,    // Cho phép chạy trong headless mode
  };

  // Cấu hình riêng cho từng platform
  const platformConfig = Platform.select({
    android: {
      ...commonConfig,
      forceAlarmManager: true,  // Sử dụng AlarmManager để đảm bảo độ tin cậy
      periodic: true,           // Chạy định kỳ
    },
    ios: {
      ...commonConfig,
      requiresNetworkConnectivity: true, // Yêu cầu kết nối mạng
      requiresBatteryNotLow: true,       // Yêu cầu pin không yếu
      periodic: true,           // Chạy định kỳ
    }
  });

  BackgroundFetch.configure(
    platformConfig,
    // {
    //   minimumFetchInterval: Platform.OS === 'ios' ? 30 : 15, // iOS requires longer intervals
    //   stopOnTerminate: false,
    //   startOnBoot: Platform.OS === 'android', // Only applicable to Android
    //   enableHeadless: true,
    //   forceAlarmManager: Platform.OS === 'android', // Only for Android

    //   // iOS-specific configuration
    //   ...(Platform.OS === 'ios' && {
    //     requiredNetworkType: BackgroundFetch.NETWORK_TYPE_CELLULAR,
    //     requiresBatteryNotLow: true,
    //     requiresCharging: false,
    //     requiresDeviceIdle: false,
    //     requiresStorageNotLow: false,
    //   }),
    // },

    async (taskId) => {
      console.log("[BackgroundFetch] Task start:", taskId);
      await MyHeadlessTask(taskId);
    },

    (taskId) => {
      console.warn('[BackgroundFetch] task timed out:', taskId);
      BackgroundFetch.finish(taskId);
    }
  )
};

const startBackgroundFetch = async () => {
  const status = await BackgroundFetch.status();
  switch (status) {
    case BackgroundFetch.STATUS_RESTRICTED:
      console.log("BackgroundFetch restricted");
      break;
    case BackgroundFetch.STATUS_DENIED:
      console.log("BackgroundFetch denied");
      break;
    case BackgroundFetch.STATUS_AVAILABLE:
      await configureBackgroundFetch();
      await BackgroundFetch.start();
      console.log("BackgroundFetch enabled");
      break;
  };
}

BackgroundFetch.registerHeadlessTask(MyHeadlessTask);

const stopBackgroundFetch = () => {
  console.log('stop background fetch');
  BackgroundFetch.stop();
};

export { startBackgroundFetch, stopBackgroundFetch, configureBackgroundFetch };