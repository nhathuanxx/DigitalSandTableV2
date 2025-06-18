import { StyleSheet, Dimensions } from "react-native";
import { Colors as Themes, Fonts, Helpers, Images, Metrics } from "@app/theme";
// const { width, height } = Dimensions.get("window");

// Lấy chiều cao của màn hình
// const { height: screenHeight } = Dimensions.get('window');

const createStyles = (isDarkTheme, width, height) => {
    const Colors = Themes[isDarkTheme ? 'darkMode' : 'lightMode'];
    return StyleSheet.create({
        container: {
            // ...Helpers.fullSize,
            backgroundColor: Colors.blackOpacity,
            ...Helpers.center,
            ...Helpers.positionAbso,
            top: -Metrics.normal,
            left: -Metrics.normal,
            right: -Metrics.normal,
            bottom: -Metrics.normal,
            zIndex: 1000,
            elevation: Metrics.normal,
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
        body: {
            // flex: 1,
            ...Helpers.row,
            ...Helpers.crossCenter,
            color: Colors.textGrey,
        },
        bodyRight: {
            flex: 1,
            paddingLeft: Metrics.medium,
        },
        bodyText: {
            color: Colors.textGrey,
        },
        image: {
            width: Metrics.large * 2,
            height: Metrics.large * 2,
        },
    })
};

export default createStyles;