import BaseService from "./BaseService";
import { getTokens, setTokens, getPartner } from "@app/libs/auth";
import constants from "../config/constants";
import keys from "../config/keys";
import storage from "@app/libs/storage";

let baseUrl = `https://traffic-test.goong.io`;
class PlaceDetailService extends BaseService {

  async getDirection(params) {
    return this.get(`/Direction?origin=${params.locationFrom}&destination=${params.locationTo}&vehicle=${params.vehicle}&api_key=${keys.API_KEY}`)
  }

  async getAutoComplete(params) {
    return this.get(`/Place/AutoComplete?location=${params.location}&input=${params.searchText}&api_key=${keys.API_KEY}`)
  }

  async getPlaceDetail(params) {
    return this.get(`/geocode?place_id=${params.placeId}&api_key=${keys.API_KEY}`)
  }

  async getTrafficTest(params) {
    return this.get(`${constants.TRAFFIC_URL}/traffic-data?z=${params.params.z}&x=${params.params.x}&y=${params.params.y}&api_key=${keys.TRAFFIC_API_KEY}`)
  }

  async getPlaceDetailFromLatLong(params) {
    return this.get(`/geocode/?latlng=${params.latlng}&api_key=${keys.API_KEY}`)
  }

  async getPlaceDetailFromAddress(params) {
    return this.get(`/geocode/?address=${params.address}&api_key=${keys.API_KEY}`)
  }

}

export default new PlaceDetailService();
