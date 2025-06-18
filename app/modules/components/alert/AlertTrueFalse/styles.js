import { StyleSheet, Dimensions } from "react-native";
import { Colors as Themes, Fonts, Helpers, Images, Metrics } from "@app/theme";
const { width, height } = Dimensions.get("window");

// Lấy chiều cao của màn hình
const { height: screenHeight } = Dimensions.get('window');
const createStyles = (isDarkTheme) => {
    const Colors = Themes[isDarkTheme ? 'darkMode' : 'lightMode'];
    return StyleSheet.create({
        container: {
            ...Helpers.fullSize,
            backgroundColor: Colors.blackOpacity,
            ...Helpers.center,
            ...Helpers.positionAbso,
            top: 0,
            left: 0,
        },
        content: {
            width: width * 0.9,
            // height: Metrics.medium * 9,
            backgroundColor: Colors.backgroundGrey,
            borderRadius: Metrics.normal,
            paddingBottom: Metrics.regular,
            paddingTop: Metrics.regular,
            paddingLeft: Metrics.regular,
            paddingRight: Metrics.regular,
        },
        text: {
            color: Colors.text,
            ...Fonts.regular,
            fontWeight: 'bold',
            marginBottom: Metrics.small,
        },
        textBody: {
            color: Colors.textGrey
        },
        body: {
            // flex: 1,
            ...Helpers.row,
            // ...Helpers.crossCenter,
        },
        bodyRight: {
            flex: 1,
            paddingLeft: Metrics.medium,
        },
        image: {
            width: Metrics.large * 2,
            height: Metrics.large * 2,
        },
        buttonContainer: {
            ...Helpers.row,
            ...Helpers.crossCenter,
            alignSelf: 'flex-end',
            marginTop: Metrics.regular,
        },
        button: {
            paddingBottom: Metrics.normal,
            paddingTop: Metrics.normal,
            paddingLeft: Metrics.regular,
            paddingRight: Metrics.regular,
            marginLeft: Metrics.regular,
            borderRadius: Metrics.medium,
        },
        buttonBlue: {
            backgroundColor: Colors.blue_light,
        },
        buttonWhite: {
            // backgroundColor: Colors.red,
            borderColor: Colors.blue_light,
            borderWidth: 1,
        },
        textBlack: {
            color: Colors.black,
        },
        textBlue: {
            color: Colors.blue_light,
        },
        textWhite: {
            color: Colors.white,
        },
    })
};

export default createStyles;
