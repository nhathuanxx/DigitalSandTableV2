import { StyleSheet, Dimensions } from "react-native";
const { width, height } = Dimensions.get("window");
import { Colors as Themes, Fonts, Helpers, Images, Metrics } from "@app/theme";

const createStyles = (isDarkTheme) => {
    const Colors = Themes[isDarkTheme ? 'darkMode' : 'lightMode'];
    return StyleSheet.create({
        debugContainer: {
            width: width,
            ...Helpers.positionAbso,
            // height: 100,
            // backgroundColor: Colors.blue,
            top: 200,
            ...Helpers.center,
        },
        debugText: {
            color: Colors.red,
            ...Helpers.textBold,
            ...Fonts.large,
        },
    })
};
export default createStyles;