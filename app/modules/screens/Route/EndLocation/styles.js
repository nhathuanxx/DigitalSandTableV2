import { StyleSheet, Dimensions } from "react-native";
const { width, height } = Dimensions.get("window");
import { Colors as Themes, Fonts, Helpers, Images, Metrics } from "@app/theme";

const createStyles = (isDarkTheme, width, height) => {
    const Colors = Themes[isDarkTheme ? 'darkMode' : 'lightMode'];
    return StyleSheet.create({
        container: {
            // height: height / 3,
            ...Helpers.positionAbso,
            ...Helpers.fullWidth,
            bottom: 0,
            alignItems: 'center'
        },
        body: {
            width: '90%',
            // height: '100%',
            backgroundColor: Colors.background,
            marginLeft: Metrics.small,
            marginRight: Metrics.small,
            paddingRight: Metrics.regular,
            paddingBottom: Metrics.regular,
            paddingLeft: Metrics.regular,
            paddingTop: Metrics.large,
            borderTopWidth: 3,
            borderTopColor: 'rgba(0, 0, 0, 0.1)',
            borderRightWidth: 3,
            borderRightColor: 'rgba(0, 0, 0, 0.1)',
            borderLeftWidth: 3,
            borderLeftColor: 'rgba(0, 0, 0, 0.1)',
            ...Helpers.center,
        },
        footer: {
            // height: 70,
            width: '100%',
            backgroundColor: Colors.background,
            ...Helpers.center,
            borderTopWidth: 4,
            borderTopColor: 'rgba(0, 0, 0, 0.25)',
        },
        icon: {
            height: 20,
            width: 20,
            marginRight: Metrics.normal,
            tintColor: Colors.blueText,
        },
        button: {
            ...Helpers.row,
            // backgroundColor: Colors.red,
            padding: Metrics.regular,
        },
        textBlue: {
            color: Colors.blueText,
        },
        textBlack: {
            color: Colors.text,
            ...Helpers.textBoldfive,
        },
        textGrey: {
            color: Colors.textGrey,
        },
        title: {
            ...Fonts.large,
            marginTop: Metrics.small,
            marginBottom: Metrics.small,
        },
        limitCircle: {
            width: Metrics.medium * 2,
            height: Metrics.medium * 2,
            borderRadius: Metrics.large,
            ...Helpers.positionAbso,
            top: -Metrics.medium,
            left: width / 2 - Metrics.large,
        },
        img: {
            width: Metrics.medium * 2,
            height: Metrics.medium * 2,
            borderRadius: Metrics.large,
        },
    })

};
export default createStyles;