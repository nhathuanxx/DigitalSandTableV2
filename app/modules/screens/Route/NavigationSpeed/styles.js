import { StyleSheet, Dimensions, StatusBar } from "react-native";
const { width, height } = Dimensions.get("window");
import { Colors as Themes, Fonts, Helpers, Images, Metrics } from "@app/theme";

const createStyles = (isDarkTheme) => {
    const Colors = Themes[isDarkTheme ? 'darkMode' : 'lightMode'];
    return StyleSheet.create({
        container: {
            // ...Helpers.positionAbso,
            // top: 0,
            // left: 0
        },
        speedCircle: {
            width: Metrics.medium * 3,
            height: Metrics.medium * 3,
            borderRadius: Metrics.medium * 3,
            borderWidth: Metrics.tiny,
            borderColor: Colors.blueText,
            ...Helpers.center,
            backgroundColor: Colors.background,
        },
        speedNumber: {
            fontSize: Metrics.medium,
            color: Colors.blueText,
            fontWeight: 'bold',
        },
        unit: {
            ...Fonts.small,
            color: Colors.blueText,
        },
        limitCircle: {
            width: Metrics.large,
            height: Metrics.large,
            borderRadius: Metrics.large,
            borderWidth: Metrics.tiny / 2,
            borderColor: Colors.red,
            ...Helpers.center,
            backgroundColor: Colors.background,
            ...Helpers.positionAbso,
            bottom: -20,
        },
        limitNumber: {
            ...Fonts.small,
            color: Colors.text,
            fontWeight: 'bold',
        },
    })
};
export default createStyles;