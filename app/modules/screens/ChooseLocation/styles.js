import { StyleSheet, Dimensions } from "react-native";
const { width, height } = Dimensions.get("window");
import { Colors as Themes, Fonts, Helpers, Images, Metrics } from "@app/theme";
import { color } from "react-native-reanimated";

const createStyles = (isDarkTheme) => {
    const Colors = Themes[isDarkTheme ? 'darkMode' : 'lightMode'];
    return StyleSheet.create({
        content: {
            position: 'absolute',
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            paddingHorizontal: Metrics.small,
            justifyContent: 'space-between'
        },
        contentTop: {
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            flexDirection: 'row',
            paddingTop: Metrics.regular
        },
        contentTopLeft: {
            flexDirection: 'row',
            alignItems: 'center'
        },
        btnback: {
            paddingVertical: Metrics.small,
            paddingRight: Metrics.regular,
            paddingLeft: Metrics.small
        },
        optionStyleBtn: {
            padding: Metrics.small,
        },
        underline: {
            height: 1,
            width: '80%',
            backgroundColor: Colors.border
        },
        icon_Style: {
            width: Metrics.icon,
            height: Metrics.icon,
            tintColor: Colors.text,
        },
        textContentTop: {
            fontSize: 17,
            fontWeight: '600',
            color: Colors.text,

        },
        icArrowBack: {
            width: Metrics.regular,
            height: Metrics.regular,
            tintColor: Colors.text
        },
        blackIcon: {
            tintColor: Colors.black_hue,
        },
        whiteIcon: {
            tintColor: Colors.white,
        },
        blackText: {
            color: Colors.black_hue,
        },
        whiteText: {
            color: Colors.white,
        },
        container: {
            ...Helpers.positionAbso,
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
        },
        viewTitleIconTop: {
            ...Helpers.crossCenter
        },
        iconStyle: {
            width: Metrics.medium,
            height: Metrics.regular,
        },
        viewContentIconTop: {
            // ...Helpers.positionAbso,
            // right: Metrics.tiny,
            // top: Metrics.medium * 2,
            // top: Metrics.icon * 2,
            backgroundColor: Colors.background,
            // padding: Metrics.small,
            borderRadius: Metrics.normal,
            // marginTop: Metrics.regular,
            // ...Helpers.fill,
            // marginRight: Metrics.small,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.3,
            shadowRadius: 2,
            elevation: 4,
        },

        viewHeaderIconTop: {
            ...Helpers.crossCenter,
        },
        boxTransfer: {
            paddingTop: Metrics.tiny,
        },
        normalMargin: {
            paddingTop: Metrics.tiny,
        },
        topMargin: {
            paddingBottom: Metrics.tiny,
        },

        // -------------------------------------------------------------------------------
        viewMyLoacation: {
            alignItems: 'flex-end',
            marginBottom: Metrics.small
        },
        icon: {
            width: Metrics.medium,
            height: Metrics.medium,
            tintColor: Colors.text,
        },
        iconLocationBackground: {
            backgroundColor: Colors.background,
            padding: Metrics.small,
            borderRadius: Metrics.regular,
            ...Helpers.center,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.3,
            shadowRadius: 2,
            elevation: 4,
        },
        containerText: {
            // marginHorizontal: Metrics.normal,
            paddingHorizontal: Metrics.regular,
            paddingVertical: Metrics.normal,
            backgroundColor: Colors.background,
            borderRadius: Metrics.normal,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.3,
            shadowRadius: 2,
            elevation: 4,
            // marginBottom: 16,
            ...Helpers.rowCross
        },
        iconHand: {
            width: 80,
            height: 80,
        },
        textContentHand: {
            flex: 1,
            alignItems: 'center'
        },
        textHand: {
            fontSize: 15,
            color: Colors.text,

        },
        containerTextLocation: {
            paddingHorizontal: Metrics.regular,
            paddingVertical: Metrics.small,
            backgroundColor: Colors.background,
            borderRadius: Metrics.normal,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.3,
            shadowRadius: 2,
            elevation: 4,
            ...Helpers.column
            // alignItems: 'center'
        },
        selectedLocationText: {
            fontSize: 17,
            fontWeight: '600',
            color: Colors.text,
            marginBottom: Metrics.tiny
        },
        selectedLocationDescription: {
            fontSize: 15,
            color: Colors.textGrey,
        },
        selectedDistances: {
            fontSize: 15,
            color: Colors.textGrey,
        },
        saveButton: {
            marginTop: Metrics.regular,
            backgroundColor: Colors.navyBlue, // Thay bằng màu nền bạn muốn
            paddingVertical: Metrics.normal,
            paddingHorizontal: Metrics.medium,
            borderRadius: Metrics.large,
            ...Helpers.crossCenter,
            marginBottom: Metrics.tiny
        },
        saveButtonText: {
            color: Colors.white,
            fontSize: 15,
            fontWeight: '500',
        },

        selectedLocationContainer: {
            marginBottom: Metrics.small,
            marginTop: Metrics.small,
        }




    })
};

export default createStyles;
