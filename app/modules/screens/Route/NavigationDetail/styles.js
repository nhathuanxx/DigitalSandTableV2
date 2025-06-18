import { StyleSheet, Dimensions } from "react-native";
import { Colors as Themes, Fonts, Helpers, Images, Metrics } from "@app/theme";

const createStyles = (isDarkTheme, width, height) => {
    const Colors = Themes[isDarkTheme ? 'darkMode' : 'lightMode'];
    return StyleSheet.create({
        container: {
            ...Helpers.positionAbso,
            ...Helpers.fullWidth,
            bottom: 0,
        },
        routeStepsContent: {
            backgroundColor: Colors.background,
            flex: 1,
            borderTopRightRadius: Metrics.normal,
            borderTopLeftRadius: Metrics.normal,
            backgroundColor: Colors.backgroundGhoshLight,
        },
        routeStepsTittle: {
            height: height * 0.13,
            backgroundColor: Colors.background,
            ...Helpers.fillRowBetween,
            // paddingLeft: Metrics.regular,
            // paddingRight: Metrics.regular,
            borderTopRightRadius: Metrics.normal,
            borderTopLeftRadius: Metrics.normal,
        },
        body: {
            paddingTop: Metrics.normal,
            backgroundColor: Colors.backgroundGhoshLight,
            height: height * 0.4
        },
        close: {
            ...Helpers.colCenter,
            // width: Metrics.medium * 3,
            paddingLeft: Metrics.normal,
            paddingRight: Metrics.small,
        },
        text: {
            color: Colors.text,
            marginTop: Metrics.small,
            ...Helpers.textBoldfive,
        },
        title: {
            ...Helpers.fillCenter,
            paddingLeft: Metrics.normal,
            paddingRight: Metrics.normal,
        },
        titleText: {
            ...Helpers.textCenter,
            color: Colors.blueText,
            ...Fonts.large,
            fontWeight: '600'
        },
        compact: {
            alignItems: 'center',
            paddingHorizontal: Metrics.regular
        },
        icon: {
            width: Metrics.icon,
            height: Metrics.icon,
            marginBottom: Metrics.tiny,
            tintColor: Colors.text
        },
        line: {
            height: Metrics.large,
            width: 0.5,
            backgroundColor: Colors.grey_medium_light,
        },
        routing: {
            backgroundColor: Colors.background,
            flex: 1,
            marginLeft: Metrics.regular,
            marginRight: Metrics.regular,
            borderRadius: Metrics.normal,
            ...Helpers.mainCenter,
            padding: Metrics.normal,
            marginBottom: Metrics.regular,
        },
        buttonContainer: {
            ...Helpers.fullWidth,
            backgroundColor: Colors.background,
            ...Helpers.fillRowBetween,
            // paddingBottom: Metrics.small,
            borderTopWidth: 0.4,
            borderTopColor: Colors.grey_medium_light,
            paddingLeft: Metrics.regular,
            paddingRight: Metrics.regular,
            paddingTop: Metrics.normal,
        },
        button: {
            height: Metrics.medium * 2,
            width: '48%',
            ...Helpers.center,
            borderRadius: Metrics.medium * 2,
        },
        textButton: {
            color: Colors.white,
            ...Fonts.regular,
            ...Helpers.textBoldfive,
        },
        redButton: {
            backgroundColor: Colors.red,
        },
        blueButton: {
            backgroundColor: Colors.blueText,
        },
        time: {
            // backgroundColor: Colors.red,
            ...Helpers.center,
            marginBottom: Metrics.normal,
        },
        distance: {
            // backgroundColor: Colors.blue,
            ...Helpers.center,
            ...Helpers.row,
            marginBottom: Metrics.large,
        },
        road: {
            // backgroundColor: Colors.green,
            marginBottom: Metrics.large,
            paddingLeft: Metrics.medium,
            paddingRight: Metrics.medium,
        },
        options: {
            ...Helpers.center,
            ...Helpers.row,
            ...Helpers.mainSpaceBetween,
            // backgroundColor: Colors.black,
        },
        timeText: {
            // ...Fonts.large,
            fontSize: Metrics.medium,
            ...Helpers.textBoldfive,
            color: Colors.blueText,
        },
        distanceLine: {
            height: Metrics.medium,
            width: 1,
            backgroundColor: Colors.grey_medium_light,
            marginLeft: Metrics.regular,
            marginRight: Metrics.regular,
        },
        distanceIcon: {
            height: Metrics.icon,
            width: Metrics.icon,
            marginRight: Metrics.small,
        },
        distanceValue: {
            ...Helpers.rowCross,
        },
        distanceText: {
            color: Colors.text,
            fontSize: Metrics.regular,
        },
        containerMenu: {
            ...Helpers.crossCenter,
            marginRight: Metrics.small,
        },
        iconWrapper: {
            borderRadius: Metrics.regular,
            borderWidth: 1,
            borderColor: Colors.background,
            ...Helpers.center,
            marginBottom: Metrics.tiny,
            padding: Metrics.normal,
            backgroundColor: Colors.red,
        },
        imgContainerMenu: {
            width: Metrics.medium,
            height: Metrics.medium,
        },
        txtContainerMenu: {
            color: Colors.text,
            ...Fonts.normal,
        },
        progressContainer: {
            ...Helpers.fullWidth,
        },
        image: {
            width: Metrics.large * 2,
            height: Metrics.large * 2,
            ...Helpers.positionAbso,
            marginLeft: -Metrics.large,
            top: -28,
        },
        progressBar: {
            ...Helpers.fullWidth,
            height: Metrics.small,
            backgroundColor: Colors.background_route,
            borderRadius: Metrics.tiny,
        },
        progress: {
            height: '100%',
            backgroundColor: Colors.blueText,
            borderRadius: 5,
        },
        addressLocation: {
            ...Helpers.row,
            // backgroundColor: Colors.red,
        },
        textNumber: {
            color: Colors.black,
            fontSize: Metrics.normal,
            fontWeight: '600',
        },
        locationToContainer: {
            width: Metrics.tiny * 6,
            height: Metrics.tiny * 6,
            backgroundColor: Colors.white,
            borderRadius: Metrics.regular,
            borderWidth: 1,
            borderColor: Colors.black,
            justifyContent: 'center', // căn giữa theo trục dọc
            alignItems: 'center',     // căn giữa theo trục ngang
        },
        addressLocationText: {
            marginLeft: Metrics.normal,
            flex: 1,
        },
        addressLocationTitle: {
            ...Fonts.large,
            ...Helpers.textBoldfive,
            color: Colors.text,
        },
        addressText: {
            // paddingRight: Metrics.small,
            color: Colors.secondaryText,
        },
        completedTextView: {
            ...Helpers.center,
            marginTop: Metrics.normal,
        },
        completedText: {
            // ...Helpers.center,
            color: Colors.blueText,
            ...Helpers.textBoldfive,
            fontSize: Metrics.tiny * 5,
        },
        location: {
            marginBottom: Metrics.small,
            marginLeft: Metrics.large * 3,
            marginRight: Metrics.large * 3,
            ...Helpers.center,
            backgroundColor: Colors.background,
            borderRadius: Metrics.normal,
            borderColor: Colors.grayText,
            borderWidth: 1,
        },
        locationText: {
            paddingTop: Metrics.tiny,
            paddingBottom: Metrics.tiny,
            paddingLeft: Metrics.normal,
            paddingRight: Metrics.normal,
            color: Colors.text,
        },
        space: {
            marginLeft: Metrics.normal,
            marginRight: Metrics.normal,
            color: Colors.textGrey
        },
        timeTitle: {
            // backgroundColor: Colors.red,
            ...Helpers.center,
            // marginBottom: Metrics.normal,
        },
        timeTextTitle: {
            // ...Fonts.large,
            fontSize: Metrics.medium,
            ...Helpers.textBoldfive,
            color: Colors.blueText,
        },
        distanceTitle: {
            // backgroundColor: Colors.blue,
            ...Helpers.center,
            ...Helpers.row,
            marginTop: Metrics.small,
        },
    })
};
export default createStyles;