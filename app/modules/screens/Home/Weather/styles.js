import { StyleSheet, Dimensions } from "react-native";
const { width, height } = Dimensions.get("window");
import { Colors as Themes, Fonts, Helpers, Images, Metrics } from "@app/theme";

const createStyles = (isDarkTheme) => {
    const Colors = Themes[isDarkTheme ? 'darkMode' : 'lightMode'];
    return StyleSheet.create({
        viewWeatherIconBottomLeft: {
            // ...Helpers.positionAbso,
            // bottom: Metrics.medium * 3,
            // left: 0,
            backgroundColor: Colors.background,
            padding: Metrics.tiny,
            borderRadius: Metrics.normal,
            maxHeight: Metrics.large,
            maxWidth: Metrics.medium * 3
        },

        viewWeatherIconBottomLeftContent: {
            ...Helpers.rowCross,
            ...Helpers.crossCenter,
        },

        iconStyle: {
            width: Metrics.medium,
            height: Metrics.regular,
        },

        viewWeatherIconTextContent: {
            ...Fonts.large,
            color: Colors.thirdText,

            marginLeft: Metrics.tiny,
            ...Helpers.textBoldfive,
        },
    })
};

export default createStyles;
