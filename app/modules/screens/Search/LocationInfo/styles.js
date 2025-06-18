import { StyleSheet, Dimensions } from "react-native";

import { Colors as Themes, Fonts, Helpers, Images, Metrics } from "@app/theme";
import { positionStyle } from "react-native-flash-message";
const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;

const createStyles = (isDarkTheme) => {
    const Colors = Themes[isDarkTheme ? 'darkMode' : 'lightMode'];
    return StyleSheet.create({
        container: {
            backgroundColor: Colors.backgroundGrey,
            flex: 1
        },
        content: {
            // borderWidth: 1,
            flex: 1,
        },
        topContent: {
            // borderWidth: 2,
            flex: 1,
        },
        bgLocationInfo: {
            ...Helpers.fullWidth,
            resizeMode: 'cover',
        },
        btnBackView: {
            ...Helpers.positionAbso,
            top: 0,
            left: 0,
            right: 0,
            zIndex: 1,
        },
        btnBack: {
            paddingHorizontal: Metrics.normal,
            paddingVertical: Metrics.small
        },
        arrowBack: {
            width: Metrics.large,
            height: Metrics.large,
        },
        contentLocationInfo: {
            marginTop: - Metrics.regular,
            flex: 1,
            // borderWidth: 1,
        },
        locationInfo: {
            marginHorizontal: Metrics.normal,
            paddingHorizontal: Metrics.normal,
            paddingVertical: Metrics.tiny,
            backgroundColor: Colors.background,
            borderRadius: Metrics.normal,
        },
        textLocationInfo: {
            ...Fonts.large,
            ...Helpers.textBoldfive,
            color: Colors.text,

        },
        LocationInfoAddress: {
            ...Fonts.medium,
            color: Colors.textGrey,
            ...Helpers.wrapContent,
            marginBottom: Metrics.tiny,
        },

        textDescription: {
            ...Fonts.medium,
            color: Colors.textGrey,
            ...Helpers.wrapContent,
        },
        distanceContainer: {
            backgroundColor: Colors.grayish_blue,
            // backgroundColor: Colors.blue,
            borderRadius: Metrics.tiny,
            paddingHorizontal: Metrics.tiny,
            alignSelf: 'flex-start',
            paddingVertical: 2,
        },
        distanceText: {
            ...Fonts.medium,
            fontWeight: '500',
        },
        // ------------------------------------------------------------------------------------------------------------
        linkAddressLocationInfo: {
            paddingHorizontal: Metrics.normal,
            paddingVertical: Metrics.small,
        },
        text_link_address: {
            fontSize: 15,
            color: Colors.textGrey,

        },
        // ------------------------------------------------------------------------------------
        iconRightLocationInfo: {
            width: Metrics.icon,
            height: Metrics.icon,
            tintColor: Colors.text,
        },
        infoTextAddress: {
            // ...Fonts.regular,
            fontSize: 15,
            ...Helpers.textBoldfive,
            color: Colors.text,
        },
        LocationInfoList: {
            paddingHorizontal: Metrics.normal,
            paddingVertical: Metrics.small,
            ...Helpers.fillRowBetween,
            borderTopColor: Colors.bright_light,
            borderTopWidth: 0.5,
        },
        contentListLocationInfo: {
            ...Helpers.fill,
            marginRight: Metrics.large,
        },
        iconArrow: {
            ...Helpers.colCross,
            tintColor: Colors.text,
        },
        distance: {
            ...Fonts.small,
            color: Colors.textBrightGrey,
            marginLeft: Metrics.tiny,
            fontWeight: '500',
        },
        contentLinkAddress: {
            marginHorizontal: Metrics.normal,
            marginTop: Metrics.small,
            borderRadius: Metrics.small,
            backgroundColor: Colors.background,
            flex: 1,
        },
        // --------------------------------------------------------------------------------------------
        iconBottom: {
            width: Metrics.icon,
            height: Metrics.icon,
        },
        iconColor: {
            tintColor: Colors.text
        },
        bottomContent: {
            ...Helpers.fillRowBetween,
            paddingTop: Metrics.small,
            // paddingHorizontal: Metrics.normal,
            borderTopColor: Colors.bright_light,
            backgroundColor: Colors.backgroundGrey,
        },
        flexRow: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginRight: Metrics.tiny
        },
        spacer: {
            width: Metrics.tiny / 2
        },
        menuBottom: {
            flex: 1,
        },
        card: {
            justifyContent: 'center',
            alignItems: 'center',
        },
        cardWithBorder: {
            ...Helpers.rowCenter,
            borderRadius: Metrics.medium,
            paddingVertical: Metrics.small,
            paddingHorizontal: Metrics.normal,
        },
        iconWay: {
            width: Metrics.medium,
            height: Metrics.medium,
            marginRight: 2,
            tintColor: Colors.white,
        },
        text: {
            ...Fonts.regular,
            color: Colors.text,
            ...Helpers.textBoldfive,
        },
        textMenu: {
            fontSize: 10,
            color: Colors.text,
            ...Helpers.textBoldfive,
            marginTop: Metrics.tiny,
        },
        textWay: {
            color: Colors.white,
        },
        colorWay: {
            backgroundColor: Colors.blue_light,
        },
        overlay: {
            ...Helpers.positionAbso,
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.3)',
            ...Helpers.center
        },
        border: {
            borderWidth: 1,
            borderColor: Colors.textGrey,
        },
    })
};



export default createStyles;
