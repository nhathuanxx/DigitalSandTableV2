import { StyleSheet, Dimensions } from "react-native";
// import { Colors as Themes, Fonts, Helpers, Images, Metrics } from "@app/theme";
import { Colors, Fonts, Helpers, Images, Metrics } from "@app/theme";
const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;
// const marginLeftValue = screenWidth * 0.05;

// const createStyles = (isDarkTheme) => {
//     const Colors = Themes[isDarkTheme ? 'darkMode' : 'lightMode'];
//     return StyleSheet.create({




const styles = StyleSheet.create({

    searchDirectionsContainer: {
        ...Helpers.positionAbso,
        top: Metrics.tiny,
        ...Helpers.fullWidth,
        ...Helpers.fill,
    },
    iconCloseInput: {
        width: Metrics.icon,
        height: Metrics.icon,
    },
    icArrowLeft: {
        width: Metrics.medium,
        height: Metrics.medium,
    },
    searchView: {

        padding: Metrics.small,
        ...Helpers.fill,
    },
    searchDirections: {
        padding: Metrics.small,
    },
    LocationInfo: {
        ...Helpers.positionAbso,
        ...Helpers.fullWidth,
        // flex: 1,
        backgroundColor: Colors.light_misty,
    },

    viewFooterInput: {
        ...Helpers.fillRowBetween,
        paddingHorizontal: Metrics.normal,
        backgroundColor: Colors.white,
        borderTopLeftRadius: Metrics.normal,
        borderTopRightRadius: Metrics.normal,
        borderBottomWidth: 2,
        borderBottomColor: Colors.bg_footer,

    },
    viewContentInput: {
        ...Helpers.fill,
        paddingHorizontal: Metrics.small,
        borderRadius: Metrics.tiny,
        ...Fonts.regular,
        marginLeft: Metrics.tiny,

    },
    viewFooterInputIconFrame: {
        marginLeft: Metrics.small,

    },
    viewFooterInputText: {
        ...Fonts.large,
        color: Colors.blue_light,
        fontWeight: '500'
    },
    // -------------------------------------------------------------------------------------------------
    viewContentService: {
        ...Helpers.fillRowBetween,
    },
    containerMenu: {
        ...Helpers.crossCenter,
    },
    iconWrapper: {
        borderRadius: Metrics.regular,
        borderWidth: 1,
        borderColor: Colors.white,
        ...Helpers.center,
        marginBottom: Metrics.tiny,
        padding: Metrics.small,

    },

    imgContainerMenu: {
        width: Metrics.icon,
        height: Metrics.icon,
    },

    viewHeaderService: {
        backgroundColor: Colors.white,
        padding: Metrics.small,
        borderBottomLeftRadius: Metrics.normal,
        borderBottomRightRadius: Metrics.normal,
    },
    txtContainerMenu: {
        color: Colors.black_hue,
        ...Fonts.small,
    },
    //  -----------------------------------------------------------------------------------------------------------------------------------------------
    containerVerticalLine: {
        backgroundColor: Colors.white,
        borderTopLeftRadius: Metrics.normal,
        borderTopRightRadius: Metrics.normal,
        marginTop: Metrics.small,
        borderBottomColor: Colors.bright_light,
        borderBottomWidth: 1,
        ...Helpers.mainSpaceBetween,
        ...Helpers.rowCross,
        paddingVertical: Metrics.regular,
        paddingHorizontal: Metrics.normal,
    },
    iconText: {
        ...Helpers.rowCross
    },
    item: {
        ...Helpers.rowCross,
    },
    iconVerticalLine: {
        width: Metrics.icon,
        height: Metrics.icon,
        marginRight: Metrics.tiny,
    },
    text: {
        ...Fonts.medium,
        color: Colors.black_hue,
    },
    verticalLine: {
        width: 1,
        height: Metrics.regular,
        backgroundColor: Colors.grey_light_hue,
        // marginLeft: marginLeftValue,
        // borderColor: 'red',
        // borderWidth: 1,
        ...Helpers.positionAbso,
        flex: 1,
        right: -Metrics.medium,
    },

    // ----------------------------------------------------------------------------------------------------------------------------------------
    locationList: {
        ...Helpers.fill,
        ...Helpers.mainStart,
        borderBottomColor: Colors.grey_light_hue,
        borderBottomWidth: 1,

    },
    flatList: {
        maxHeight: '100%',
    },
    viewLocationContent: {
        ...Helpers.row,
        ...Helpers.mainSpaceBetween,
        ...Helpers.crossStart,
        padding: Metrics.normal,
    },

    contentListLeftSection: {
        ...Helpers.column,
        ...Helpers.mainStart,
        ...Helpers.crossStart,
        marginRight: Metrics.large,
        ...Helpers.fill,
    },
    txtAddress: {
        fontSize: Metrics.regular,

        color: Colors.black,
        ...Helpers.textBoldfive,
    },
    address: {
        ...Fonts.regular,
        color: Colors.bright_gray,
        ...Helpers.wrapContent,
    },
    iconPathOnly: {
        ...Helpers.colCenter
    },
    iconRightDirections: {
        width: Metrics.medium,
        height: Metrics.medium,
    },
    distance: {
        ...Fonts.regular,
        color: Colors.medium_gray,
    },
    // ------------------------------------------------------------------

    ViewLocationContentList: {
        backgroundColor: Colors.white,
        marginTop: Metrics.small,
        borderRadius: Metrics.small,
    },

    iconStyleMenuClose: {
        backgroundColor: Colors.white,
        padding: Metrics.tiny,
        borderRadius: Metrics.regular,
        ...Helpers.center,
        backgroundColor: Colors.dark_gray,
    },
    iconClose: {
        width: Metrics.regular,
        height: Metrics.regular,
    },

    loadMoreContainer: {
        ...Helpers.mainCenter
    },
    loadMoreButton: {
        backgroundColor: Colors.white,
        borderBottomLeftRadius: Metrics.small,
        borderBottomRightRadius: Metrics.small,
        paddingVertical: Metrics.small,
        paddingHorizontal: Metrics.icon,
    },
    loadMoreText: {
        ...Fonts.large,
        color: Colors.write_bright,
        ...Helpers.textCenter
    },
    // --------------------------------------------------------------------------------------------------------------

    rowContainer: {
        backgroundColor: Colors.white,
        ...Helpers.fillRowBetween,
        paddingVertical: Metrics.regular,
        paddingHorizontal: Metrics.normal,
    },
    rowFront: {
        ...Helpers.center,
        backgroundColor: Colors.white,
        borderBottomColor: Colors.bright_light,
        borderBottomWidth: 1,
        height: 'auto',
    },
    leftContainer: {
        ...Helpers.rowCross,
        ...Helpers.fill,

    },
    iconStyleHistory: {
        marginRight: Metrics.small,
        width: Metrics.regular,
        height: Metrics.regular

    },
    textStyle: {
        ...Fonts.regular,
        color: Colors.black_hue,
        marginRight: Metrics.regular,
        ...Helpers.wrapContent,
        flexShrink: 1,
    },
    iconRight: {
        width: Metrics.icon,
        height: Metrics.icon,
    },
    rowBack: {
        ...Helpers.fillRowCross,
        ...Helpers.mainEnd,
    },
    backRightBtn: {
        ...Helpers.center,
        ...Helpers.positionAbso,
        top: 0,
        bottom: 0,
        width: Metrics.medium * 2,
    },
    backRightBtnRight: {
        backgroundColor: Colors.red,
        right: 0,
    },
    iconClose: {
        width: Metrics.regular,
        height: Metrics.icon,
        tintColor: Colors.white, // Đổi màu icon để phù hợp với nền
    },
    // ---------------------------------------------------------------------------------------------------
    searchHistoryDelete: {
        backgroundColor: Colors.white,
        borderBottomLeftRadius: Metrics.normal,
        borderBottomRightRadius: Metrics.normal,
        ...Helpers.center,
        paddingVertical: Metrics.normal,
    },
    searchHistory: {
        backgroundColor: Colors.white,
        borderBottomLeftRadius: Metrics.normal,
        borderBottomRightRadius: Metrics.normal,
        ...Helpers.center,
        paddingVertical: Metrics.regular,
    },
    searchHistoryText: {
        color: Colors.write_bright,
        ...Fonts.regular,
    },
    //  ---------------------------------------------Voice---------------------------------------------------------------------

});


export default styles;





//     })
// };


// export default createStyles;
