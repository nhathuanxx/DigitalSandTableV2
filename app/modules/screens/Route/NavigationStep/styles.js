import { StyleSheet, Dimensions } from "react-native";
const { width, height } = Dimensions.get("window");
import { Colors as Themes, Fonts, Helpers, Images, Metrics } from "@app/theme";

const createStyles = (isDarkTheme) => {
    const Colors = Themes[isDarkTheme ? 'darkMode' : 'lightMode'];
    return StyleSheet.create({
        navigationStepContainer: {
            minHeight: Metrics.large * 5,
            // width: width,
        },
        navigationStepBody: {
            flex: 1,
            // backgroundColor: Colors.red,
            paddingBottom: Metrics.medium,
            paddingRight: Metrics.medium,
            paddingLeft: Metrics.medium,
            ...Helpers.row,
        },
        icon: {
            ...Helpers.center,
        },
        body: {
            // flex: 1,
            // backgroundColor: Colors.red,
            ...Helpers.fillColMain,
            paddingLeft: Metrics.small,
        },
        textWhite: {
            color: Colors.white
        },
        fistText: {
            ...Helpers.fillRowCross,
            // backgroundColor: Colors.blue,
        },
        textBold: {
            fontWeight: '500',
            fontSize: 24,
        },
        textDirection: {
            marginLeft: Metrics.normal,
            fontSize: 17,
        },
        img: {
            height: Metrics.small * 10,
            width: Metrics.small * 10,
            tintColor: Colors.white,
        }
    })
};
export default createStyles;