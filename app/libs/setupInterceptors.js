import axiosInstance from "@app/libs/axios";
import { getTokens, setTokens, getPartner } from "@app/libs/auth";
import DeviceInfo from "react-native-device-info";
import { Alert, PermissionsAndroid, Platform } from "react-native";
import { check, PERMISSIONS, RESULTS } from "react-native-permissions";
import storage from "@app/libs/storage";
import * as constants from "@app/config/constants";
// import * as loginAction from "@app/storage/action/login";
import axiosBase from "axios";

const setup = (store) => {
  // for multiple requests
  let isRefreshing = false;
  let failedQueue = [];

  const processQueue = (error, token = null) => {
    failedQueue.forEach((prom) => {
      if (error) {
        prom.reject(error);
      } else {
        prom.resolve(token);
      }
    });

    failedQueue = [];
  };
  axiosInstance.interceptors.request.use(
    async (config) => {
      const token = await getTokens().access_token;
      // const token = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImNjYThmYTJhLWE2MjMtNGFmYi05Mjk2LThkMTQ3YzY5Njg0ZiIsImRvbWFpbiI6Iml1diIsIm5iZiI6MTcxMzE0NzQ2NiwiZXhwIjoxNzEzNzUyMjY2LCJpYXQiOjE3MTMxNDc0NjZ9.ULpcXi3XW_D4TxJ9Q60ockygjjM2sBcvfQIUW3gzxro"
      const partner = await getPartner().partner;
      const domain = "https://rsapi.goong.io"
      // console.log("access token " + token)
      // (db.getDomainCode()?.domain ? db.getDomainCode().domain : "") + "/api";
      if (domain) {
        config.baseURL = domain;
      }
      if (token) {
        config.headers.Authorization = token;
      }
      if (partner) {
        config.headers.partner = partner;
      }

      config.headers.device_id = DeviceInfo.getDeviceId();
      config.headers.unique_id = await DeviceInfo.getUniqueId();
      config.headers.latitude = 0;
      config.headers.longtitude = 0;

      if (Platform.OS === "ios") {
        const result = check(PERMISSIONS.IOS.LOCATION_ALWAYS);
        // if (result == RESULTS.GRANTED) {
        //   const info = Geolocation.getCurrentPosition();
        //   config.headers.latitude = info?.coords?.latitude || 0;
        //   config.headers.longtitude = info?.coords?.longtitude || 0;
        // }
      }
      if (Platform.OS === "android") {
        const response = await PermissionsAndroid.check(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        );
        // if (response == PermissionsAndroid.RESULTS.GRANTED) {
        //   const info = Geolocation.getCurrentPosition();
        //   config.headers.latitude = info?.coords?.latitude || 0;
        //   config.headers.longtitude = info?.coords?.longtitude || 0;
        // }
      }
      return config;
    },
    (error) => {
      // console.error("err", error);
      return Promise.reject(error);
    },
  );
  axiosInstance.interceptors.response.use(
    (response) => {
      console.log('response', response.config.url);

      return response;
    },
    async (error) => {
      console.log("error config" + JSON.stringify(error));
      const originalRequest = error?.config;

      // eslint-disable-next-line no-underscore-dangle
      if (error?.response?.status === 401 && !originalRequest._retry) {
        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          })
            .then((token) => {
              originalRequest.headers.common["Authorization"] = token;
              return axiosInstance(originalRequest);
            })
            .catch((err) => Promise.reject(err));
        }

        // eslint-disable-next-line no-underscore-dangle

        const refresh_token = await getTokens().refresh_token;
        if (typeof refresh_token != "undefined" && refresh_token != "") {
          originalRequest._retry = true;
          isRefreshing = true;
          return new Promise((resolve, reject) => {
            axiosInstance
              .post("/refresh_token", { refresh_token })
              .then(({ data }) => {
                setTokens(data);
                axiosInstance.defaults.headers.common["Authorization"] =
                  data.access_token;
                originalRequest.headers.common["Authorization"] =
                  data.access_token;
                processQueue(null, data.access_token);
                resolve(axiosInstance(originalRequest));
              })
              .catch((err) => {
                processQueue(err, null);
                reject(err);
              })
              .finally(() => {
                isRefreshing = false;
              });
          });
        } else {
          const token = await getTokens().access_token;
          const fcmToken = await storage.get("@FCM_TOKEN");
          db.deleteDatabase();
          store.dispatch(loginAction.signIn(constants.USER_LOGOUT_SAVED));
          storage.clear();
          const axios = axiosBase.create({
            baseURL: error.config.baseURL,
            timeout: 10000,
          });

          axios.defaults.headers.common["Content-Type"] = "application/json";
          axios.defaults.headers.common["Authorization"] = token;
          axios
            .post("/logout", {
              token: token,
              fcmToken: fcmToken,
            })
            .then(() => {
              // console.log(response);
              // if (response.errorCode == 0) {
              //   db.deleteDatabase();
              //   store.dispatch(loginAction.signIn(constants.USER_LOGOUT_SAVED));
              // }
              // return Promise.reject(error);
            });
          return Promise.reject(error);
        }
      }

      return Promise.reject(error);
    },
  );
};

export default setup;
