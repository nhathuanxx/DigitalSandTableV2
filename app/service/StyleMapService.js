import BaseService from "./BaseService";
import { getTokens, setTokens, getPartner } from "@app/libs/auth";
import keys from "../config/keys";
import constants from "../config/constants";
import storage from "@app/libs/storage";
import stylesMap from '@app/config/mapStyles';

let baseUrl = "";
class StyleMapService extends BaseService {

    getSubURLMapStyle(name) {
        const style = stylesMap.STYLES.find(style => style.name === name);
        return style ? style.subURL : null;
    }

    getStyleMap(value) {

        if (value !== null) {
            return `${constants.MAP_TILES_URL}${this.getSubURLMapStyle(value)}?api_key=${keys.MAP_API_KEY}`
        } else {
            return `${constants.MAP_TILES_URL}${stylesMap.STYLES[0].subURL}?api_key=${keys.MAP_API_KEY}`
        }
    }
}

export default new StyleMapService();
