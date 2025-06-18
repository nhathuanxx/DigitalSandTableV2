import { StyleSheet, Dimensions } from "react-native";
import { Colors as Themes, Fonts, Helpers, Images, Metrics } from "@app/theme";

const createStyles = (isDarkTheme, width, height) => {
    const Colors = Themes[isDarkTheme ? 'darkMode' : 'lightMode'];
    return StyleSheet.create({
        routeSelectionContainer: {
            ...Helpers.positionAbso,
            minHeight: Metrics.large * 5,
            // backgroundColor: Colors.white,
            backgroundColor: Colors.backgroundGhoshLight,
            left: Metrics.normal,
            right: Metrics.normal,
            // bottom: Metrics.regular,
            borderRadius: Metrics.small,
            padding: Metrics.small,
        },
        routeOptions: {
            flex: 1,
            ...Helpers.row,
            ...Helpers.mainCenter,
        },
        displayStep: {
            // backgroundColor: Colors.blue_light,
            height: Metrics.normal * 4,
            borderRadius: Metrics.large,
            marginTop: Metrics.small,
            ...Helpers.center,
            ...Helpers.row,
            paddingLeft: Metrics.regular,
            paddingRight: Metrics.regular,
            borderWidth: 0.5,
            borderColor: Colors.dark_gray,
        },
        displayStepText: {
            color: Colors.text,
            marginLeft: Metrics.small,
            ...Fonts.large,
        },
        displayStepImg: {
            height: Metrics.medium,
            width: Metrics.medium,
        },
        routeOption: {
            backgroundColor: Colors.background,
            // height: Metrics.large,
            // minWidth: Metrics.regular * 7,
            flex: 1,
            borderRadius: Metrics.small,
            padding: Metrics.small,
            paddingLeft: Metrics.regular,
            marginLeft: Metrics.regular,
            marginRight: Metrics.regular,
            ...Helpers.mainCenter,
        },
        distanceTextSelected: {
            color: Colors.blueText,
            ...Fonts.large,
            marginTop: Metrics.small,
            marginBottom: Metrics.small,
            fontWeight: '700'
        },
        durationTextSelected: {
            color: Colors.blueText,
            ...Fonts.regular,
        },
        titleTextSelected: {
            color: Colors.blueText,
            ...Fonts.regular,
        },
        routeOptionUnSelect: {
            // backgroundColor: Colors.white,
            // height: Metrics.large,
            minWidth: Metrics.regular * 7,
            borderRadius: Metrics.small,
            padding: Metrics.small,
            marginLeft: Metrics.tiny,
            marginRight: Metrics.tiny,
            ...Helpers.mainCenter,
        },
        distanceTextUnSelected: {
            color: Colors.text,
            ...Fonts.large,
            marginTop: Metrics.small,
            marginBottom: Metrics.small,
            fontWeight: '700'
        },
        durationTextUnSelected: {
            color: Colors.text,
            ...Fonts.regular,
        },
        titleTextUnSelected: {
            // color: Colors.black,
            ...Fonts.regular,
        },
        buttonContainer: {
            ...Helpers.row,
            flex: 1,
            // backgroundColor: Colors.red,
            paddingLeft: Metrics.regular,
            paddingRight: Metrics.regular,
        },
        buttonStart: {
            backgroundColor: Colors.blue_light,
            height: Metrics.normal * 4,
            borderRadius: Metrics.large,
            marginTop: Metrics.small,
            ...Helpers.center,
            ...Helpers.row,
            paddingLeft: Metrics.regular,
            paddingRight: Metrics.regular,
            marginLeft: Metrics.small,
            flex: 1,
        },
        buttonStartText: {
            color: Colors.white,
            marginLeft: Metrics.small,
            ...Fonts.large,
        },
        buttonDetails: {
            backgroundColor: Colors.blue_light,
            height: Metrics.normal * 4,
            borderRadius: Metrics.large,
            marginTop: Metrics.small,
            ...Helpers.center,
            ...Helpers.row,
            paddingLeft: Metrics.regular,
            paddingRight: Metrics.regular,
            marginLeft: Metrics.regular,
            marginRight: Metrics.regular,
            flex: 1,
        },
    })
};
export default createStyles;
