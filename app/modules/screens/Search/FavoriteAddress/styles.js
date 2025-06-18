import { StyleSheet, Dimensions } from "react-native";
import { Colors as Themes, Fonts, Helpers, Images, Metrics } from "@app/theme";
const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;

const createStyles = (isDarkTheme) => {
    const Colors = Themes[isDarkTheme ? 'darkMode' : 'lightMode'];
    return StyleSheet.create({
        container: {
            flex: 1,
            // ...Helpers.mainSpaceBetween,
            backgroundColor: Colors.backgroundGrey
        },
        content: {
            // ...Helpers.positionAbso,
            // top: Metrics.medium * 2,
            // flex: 1,

        },
        footer: {
            ...Helpers.positionAbso,
            bottom: 0,
            left: 0,
            right: 0
        },


        icArrowBack: {
            width: Metrics.regular,
            height: Metrics.regular,
            tintColor: Colors.text
        },
        header: {
            ...Helpers.rowCross,
            backgroundColor: Colors.background
        },
        textHeader: {
            ...Fonts.regular,
            fontWeight: '500',
            color: Colors.text,
        },
        headerBtnBack: {
            padding: Metrics.regular
        },
        // --------------------------------------------------------------------------------------------------------
        contentBanner: {
            backgroundColor: Colors.background
        },
        imageContent: {
            width: screenWidth,
            resizeMode: 'stretch',
        },
        contentContainer: {
            ...Helpers.fillRowBetween,
            paddingHorizontal: Metrics.medium,

            ...Helpers.positionAbso
        },
        textContainer: {
            ...Helpers.column,
            ...Helpers.fill,
            marginTop: Metrics.small
        },
        titleText: {
            ...Fonts.medium,
            ...Helpers.textBold,
            color: Colors.blue_light
        },
        descriptionText: {
            ...Fonts.small,
            color: Colors.blue_light,
            fontWeight: '500'
        },
        imageContentFrequently: {
            width: 75,
            height: 72,
            marginTop: -Metrics.regular
        },
        // ------------------------------------------------------------------------------------------------------------
        section: {
            marginTop: Metrics.small,
            paddingHorizontal: Metrics.small,
        },
        sectionContent: {
            paddingVertical: Metrics.small,
            ...Helpers.positionRela,
            borderRadius: Metrics.normal,
            backgroundColor: Colors.background,
        },
        leftSection: {
            ...Helpers.rowCross,

            paddingLeft: Metrics.small,
            paddingTop: Metrics.tiny,
            paddingBottom: Metrics.tiny,
            paddingRight: Metrics.normal,
        },
        leftSectionFavorite: {
            paddingBottom: Metrics.small,
        },
        iconSection: {
            width: Metrics.tiny * 5,
            height: Metrics.tiny * 5,
            marginRight: Metrics.small,
        },
        sectionTextTitle: {
            flex: 1,
            fontSize: 15,
            ...Helpers.textBold,
            color: Colors.text
        },
        rightIconSection: {
            ...Helpers.center,
            width: Metrics.large,
        },
        rightIconImage: {
            width: Metrics.regular,
            height: Metrics.regular,
            tintColor: Colors.textGrey,
        },
        middleSection: {
            marginTop: Metrics.small,
            ...Helpers.center,
            paddingBottom: Metrics.normal
        },
        sectionText: {
            fontSize: 15,
            color: Colors.blue_light,
            fontWeight: '500',
        },
        sectionTextAddress: {
            fontSize: 15,
            paddingHorizontal: Metrics.normal,
            color: Colors.textGrey,
        },
        sectionAddress: {

            paddingVertical: Metrics.tiny,
            marginRight: Metrics.large
        },

        sectionContentAgency: {
            marginTop: Metrics.normal,
            borderRadius: Metrics.normal,
            backgroundColor: Colors.background
        },

        navFooter: {
            ...Helpers.row,
            borderTopWidth: 1,
            borderTopColor: Colors.bright_light,
            paddingHorizontal: Metrics.normal,
            flex: 1,
        },
        textNav: {
            ...Helpers.column,
            ...Helpers.fill,
            marginRight: Metrics.regular,
            paddingVertical: Metrics.small,
            flex: 1,
        },
        titleTextNav: {

            ...Fonts.medium,
            ...Helpers.textBold,
            color: Colors.text,
            fontWeight: '500'
        },
        addressTextNav: {
            fontSize: 15,
            color: Colors.textGrey
        },
        menuIcon: {
            width: Metrics.regular,
            height: Metrics.regular,

        },
        ContentBottom: {
            marginTop: Metrics.normal,
            borderRadius: Metrics.normal,
            backgroundColor: Colors.white
        },
        // --------------------------------------------------------------------------------------------------
        footerAddLocation: {
            paddingHorizontal: Metrics.small,
            paddingTop: Metrics.normal,
            paddingBottom: Metrics.regular,
            backgroundColor: Colors.background,
            borderTopWidth: 0.5,
            borderTopColor: Colors.bright_light,
        },
        footerAddLocationBtn: {
            ...Helpers.rowCenter,
            backgroundColor: Colors.navyBlue,
            borderRadius: Metrics.medium,
            paddingHorizontal: Metrics.regular,
            paddingVertical: Metrics.normal,
        },
        iconExtraLocation: {
            width: Metrics.icon,
            height: Metrics.icon,
            marginRight: Metrics.small
        },
        footerAddLocationText: {
            color: Colors.white,
            ...Fonts.regular,
            fontWeight: '500',
        },
        // -------------------------------------------------------------------------------------------------------------------------------
        optionTitleContent: {
            paddingTop: Metrics.small,
            backgroundColor: Colors.backgroundGrey,
            borderTopLeftRadius: Metrics.regular,
            borderTopRightRadius: Metrics.regular,
            paddingHorizontal: Metrics.small,
            zIndex: 2,
            width: '100%',
        },
        spacerModal: {
            height: Metrics.small
        },
        optionTitle: {
            ...Fonts.regular,
            ...Helpers.textBold,
            color: Colors.text,
            marginBottom: Metrics.small,
            marginLeft: Metrics.tiny
            // paddingHorizontal: Metrics.medium
        },
        optionButton: {
            ...Helpers.rowCross,
            padding: Metrics.normal,
            // marginBottom: Metrics.small,
            borderRadius: Metrics.regular,
            backgroundColor: Colors.background,
            // marginHorizontal: Metrics.regular
        },
        iconFooter: {
            width: Metrics.medium,
            height: Metrics.medium,
            marginRight: Metrics.normal,
        },
        iconColor: {
            tintColor: Colors.text,
        },
        optionText: {
            fontSize: 15,
            color: Colors.text
        },
        optionTextColor: {
            color: Colors.red
        },
        absoluteOverlay: {
            ...Helpers.positionAbso,
            top: 0,
            bottom: 0,
            right: 0,
            left: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            justifyContent: 'flex-end'
        },
        overlayBackground: {
            ...StyleSheet.absoluteFillObject,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 1,
        },
        iconSelect: {
            ...Helpers.positionAbso,
            right: Metrics.normal,
            top: -Metrics.large,
            ...Helpers.center,
            width: Metrics.large,
            height: "100%"
        },

    })
};

export default createStyles;
