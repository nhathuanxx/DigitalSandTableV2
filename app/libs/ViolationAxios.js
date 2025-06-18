import axios from "axios";
import * as db from "@app/storage/sqliteDbUtils";
import { VIOLATION_URL } from "@app/config/constants";
// import { fetch } from "react-native-ssl-pinning";
import { Platform } from "react-native";



const fetchVehicleViolation = async (plateNumber, vehicleId, category_id, abortController) => {
  // console.log('plate number : -- ' + plateNumber + '   ' + vehicleId + ' -  ' + category_id + ' --- violation -- ');
  return new Promise(async (resolve, reject) => {
    let timeout = false;
    const timeoutId = setTimeout(() => {
      timeout = true;
      abortController.abort();
    }, 20000);
    try {
      const requestData = {
        vin_number: plateNumber,
        car_type: category_id,
        source: 1,
      };

      const config = {
        method: 'post',
        url: `${VIOLATION_URL}/vehicles/violation`,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        data: new URLSearchParams(requestData).toString(),
        signal: abortController.signal,
      };

      const response = await axios.request(config);

      clearTimeout(timeoutId);
      const isSuccess = response.data.success;
      const errMessage = response.data.error_message;

      if (isSuccess) {
        db.setLastUpdate(vehicleId);
        // console.log('response fetch violation: ' + response.data.data);
        db.saveViolationRange(response.data.data, vehicleId);
        resolve(true);
      } else {
        resolve(false, errMessage);
      }
    } catch (error) {
      if (axios.isCancel(error)) {
        if (timeout) {
          reject(new Error('timeout'));
          console.log('Request cancelled: timeout');
        } else {
          reject(error);
          console.log('Request cancelled ----:', error.message);
        }
      } else {
        console.log('error api: ', error.code);
        reject(error);
      }
    }
  })
};

export { fetchVehicleViolation };
