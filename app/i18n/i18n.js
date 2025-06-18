// import I18n from "react-native-i18n";
import vi from "./locales/vi/vi";
import en from "./locales/en/en";
import my from "./locales/my/my";
// import * as Localisation from 'expo-localization';
import i18n from 'i18n-js';

i18n.defaultLocale = 'vi';
i18n.locale = 'vi'
i18n.fallbacks = true;

i18n.translations = {
    vi: vi,
    en: en,
    my: my
};


export default i18n;