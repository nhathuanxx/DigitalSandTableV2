// import { fetch } from "react-native-ssl-pinning";
import axios from "@app/libs/axios";
import { Platform } from "react-native";

export default class BaseService {
  constructor(baseURL = "https://rsapi.goong.io", defaultHeaders = {}, instanceAxios = axios) {
    this.baseURL = baseURL;
    this.baseHost = "rsapi.goong.io";
    this.defaultHeaders = {
      "Content-Type": "application/json",
      ...defaultHeaders,
    };
    this.instanceAxios = instanceAxios;
  }

  get(...args) {
    return this.execute("get", ...args);
  }

  post(...args) {
    return this.execute("post", ...args);
  }

  put(...args) {
    return this.execute("put", ...args);
  }

  delete(...args) {
    return this.execute("delete", ...args);
  }

  getHostname(url) {
    let hostname = url.replace(/^(https?:\/\/)/, '');
    hostname = hostname.split('/')[0];
    hostname = hostname.split(':')[0];
    return hostname;
  }

  async execute(method, ...args) {
    try {
      const response = await this.instanceAxios[method](...args);
      return Promise.resolve(response.data);
    } catch (error) {
      console.log('error fetch: ', error);
      return Promise.reject(error);
    }
  }
}
