import BaseService from "./BaseService";
import { getTokens, setTokens, getPartner } from "@app/libs/auth";
import keys from "../config/keys";
import constants from "../config/constants";
import storage from "@app/libs/storage";

let baseUrl = "";
class WeatherService extends BaseService {

  async getWeather(params) {
    return this.get(`${constants.WEATHER_URL}/weather?lat=${params.params.lng}&lon=${params.params.lat}&units=metric&lang=${constants.WEATHER_NATION}&appid=${keys.WEATHER_KEY}`)
  }
}

export default new WeatherService();
