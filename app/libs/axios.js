import axiosBase from "axios";

const axios = axiosBase.create({
  baseURL: "https://rsapi.goong.io",
  timeout: 20000,
});

axios.defaults.headers.common["Content-Type"] = "application/json";

export default axios;
