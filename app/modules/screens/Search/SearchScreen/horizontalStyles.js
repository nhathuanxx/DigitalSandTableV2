import { StyleSheet, Dimensions } from "react-native";
import { Colors as Themes, Fonts, Helpers, Images, Metrics } from "@app/theme";

const createHorizontalStyles = (isDarkTheme, screenWidth, screenHeight) => {
  const Colors = Themes[isDarkTheme ? 'darkMode' : 'lightMode'];
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: Colors.backgroundGrey,
    },
    // headerService: {
    //   flexDirection: 'row',
    //   justifyContent: 'space-between',
    // },
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
      tintColor: Colors.secondaryText,
    },
    searchView: {
      backgroundColor: Colors.backgroundGrey,
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

    inputSearchView: {
      ...Helpers.fillRowBetween,
      paddingHorizontal: Metrics.normal,
      backgroundColor: Colors.background,
      borderRadius: Metrics.normal,
      borderBottomColor: Colors.border,
    },
    btnBack: {
      paddingVertical: Metrics.normal
    },
    viewContentInput: {
      ...Helpers.fill,
      paddingHorizontal: Metrics.normal,
      height: Metrics.medium * 2,
      borderRadius: Metrics.tiny,
      ...Fonts.regular,
      color: Colors.text,
    },
    viewFooterInputIconFrame: {
      paddingVertical: Metrics.normal,
      marginLeft: Metrics.small,
    },
    viewFooterInputText: {
      ...Fonts.large,
      color: Colors.blue_light,
      fontWeight: '500'
    },
    // -------------------------------------------------------------------------------------------------
    viewContentService: {
      // ...Helpers.fillRowBetween,
      flexDirection: 'row',
      flex: 1,
    },
    containerMenu: {
      ...Helpers.crossCenter,
      // marginRight: Metrics.regular,
      flexDirection: 'row',
      backgroundColor: Colors.background,
      borderRadius: Metrics.normal,
      paddingVertical: Metrics.small,
      paddingHorizontal: Metrics.small,
      width: Metrics.large * 5
    },
    spacer: {
      width: Metrics.small
    },
    iconWrapper: {
      borderRadius: Metrics.regular,
      // borderColor: Colors.border,
      ...Helpers.center,
      padding: Metrics.small,
      marginRight: Metrics.small,
    },

    imgContainerMenu: {
      width: Metrics.icon,
      height: Metrics.icon,
    },

    viewHeaderService: {
      marginTop: Metrics.small
    },
    txtContainerMenu: {
      color: Colors.text,
      ...Fonts.regular,
      flex: 1,
    },
    //  -----------------------------------------------------------------------------------------------------------------------------------------------
    containerVerticalLine: {
      backgroundColor: Colors.background,
      borderTopLeftRadius: Metrics.normal,
      borderTopRightRadius: Metrics.normal,
      marginTop: Metrics.small,
      borderBottomColor: Colors.border,
      borderBottomWidth: 1,
      // ...Helpers.mainSpaceBetween,
      ...Helpers.rowCross,
      paddingVertical: Metrics.normal,
      paddingHorizontal: Metrics.normal,
    },
    iconText: {
      paddingVertical: Metrics.tiny,
      ...Helpers.rowCross,
      flex: 1,
      justifyContent: 'center'
    },
    item: {
      flexDirection: 'row',
      flex: 1
    },
    iconVerticalLine: {
      width: Metrics.icon,
      height: Metrics.icon,
      marginRight: Metrics.tiny,
      tintColor: Colors.text,
    },
    text: {
      ...Fonts.medium,
      color: Colors.text,
    },
    verticalLine: {
      width: 1,
      height: Metrics.regular,
      backgroundColor: Colors.grey_light_hue,
      // marginLeft: marginLeftValue,
      // borderColor: 'red',
      // borderWidth: 1,
      // ...Helpers.positionAbso,
      // flex: 1,
      // right: -Metrics.medium,
    },

    // ----------------------------------------------------------------------------------------------------------------------------------------
    locationList: {
      ...Helpers.fill,
      ...Helpers.mainStart,
      borderBottomColor: Colors.secondaryBorder,
      borderBottomWidth: 0.7,
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

      color: Colors.text,
      ...Helpers.textBoldfive,
    },
    address: {
      ...Fonts.regular,
      color: Colors.textGrey, //
      ...Helpers.wrapContent,
    },
    iconPathOnly: {
      ...Helpers.colCenter
    },
    iconRightDirections: {
      width: Metrics.medium,
      height: Metrics.medium,
      tintColor: Colors.text,
    },
    distance: {
      ...Fonts.regular,
      color: Colors.medium_gray,
    },
    // ------------------------------------------------------------------

    ViewLocationContentList: {
      backgroundColor: Colors.background,
      marginTop: Metrics.small,
      borderRadius: Metrics.small,
      flex: 1,
      // borderWidth: 1
    },

    iconStyleMenuClose: {
      backgroundColor: Colors.background,
      padding: Metrics.tiny,
      borderRadius: Metrics.regular,
      ...Helpers.center,
      backgroundColor: Colors.dark_gray,
    },
    // iconClose: {
    //     width: Metrics.regular,
    //     height: Metrics.regular,
    // },

    loadMoreContainer: {
      ...Helpers.mainCenter
    },
    loadMoreButton: {
      backgroundColor: Colors.background,
      borderBottomLeftRadius: Metrics.small,
      borderBottomRightRadius: Metrics.small,
      paddingVertical: Metrics.small,
      paddingHorizontal: Metrics.icon,
    },
    loadMoreText: {
      ...Fonts.large,
      color: Colors.textBrightGrey,
      ...Helpers.textCenter
    },
    // --------------------------------------------------------------------------------------------------------------
    contentBottom: {
      flex: 1,
    },
    viewFooterHistory: {
      flex: 1
    },
    historyList: {
      maxHeight: '70%',
    },
    rowContainer: {
      backgroundColor: Colors.background,
      ...Helpers.rowCross,
      ...Helpers.scrollSpaceBetween,
      paddingVertical: Metrics.regular,
      paddingHorizontal: Metrics.normal,
    },
    rowFront: {
      // ...Helpers.center,
      backgroundColor: Colors.background,
      borderBottomColor: Colors.border,
      borderBottomWidth: 1,
      height: 'auto',
    },
    leftContainer: {
      ...Helpers.rowCross,
      ...Helpers.fill,
    },
    iconStyleHistory: {
      marginRight: Metrics.small,
      width: Metrics.icon,
      height: Metrics.icon,
      tintColor: Colors.text,
    },
    textStyle: {
      ...Fonts.regular,
      color: Colors.text,
      // color: Colors.black,
      marginRight: Metrics.regular,
      ...Helpers.wrapContent,
      flexShrink: 1,
    },
    iconRight: {
      width: Metrics.icon,
      height: Metrics.icon,
      tintColor: Colors.text
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
      width: Metrics.icon,
      height: Metrics.icon,
      tintColor: Colors.white, // Đổi màu icon để phù hợp với nền
    },
    iconVoice: {
      width: Metrics.medium,
      height: Metrics.medium,
      tintColor: Colors.text,
    },
    // ---------------------------------------------------------------------------------------------------
    searchHistoryDelete: {
      backgroundColor: Colors.background,
      borderBottomLeftRadius: Metrics.normal,
      borderBottomRightRadius: Metrics.normal,
      ...Helpers.center,
      // paddingVertical: Metrics.normal,
      borderTopWidth: 1,
      borderColor: Colors.border,
      // flex: 1,
      paddingVertical: Metrics.normal
    },
    searchHistory: {
      backgroundColor: Colors.background,
      borderBottomLeftRadius: Metrics.normal,
      borderBottomRightRadius: Metrics.normal,
      ...Helpers.center,
      paddingVertical: Metrics.regular,
    },
    searchHistoryText: {
      color: Colors.blueText,
      ...Fonts.medium,
      ...Helpers.textBoldfive,
    },
    //  ---------------------------------------------Voice---------------------------------------------------------------------
    viewShowVoiceSearch: {
      position: 'absolute',
      left: 0,
      right: 0,
      alignItems: 'center',
      elevation: Metrics.small,
    },
    btnVoiceSearch: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: Metrics.medium,
      paddingVertical: Metrics.small,
      borderRadius: Metrics.medium,
      backgroundColor: Colors.background,
      elevation: Metrics.tiny,
      shadowColor: Colors.textGrey, // Màu của shadow
      shadowOffset: { width: Metrics.tiny, height: Metrics.tiny }, // Vị trí của shadow (x, y)
      // shadowOpacity: 1,
      // shadowRadius: Metrics.tiny,
    },
    btnVoiceSearchIcon: {
      height: Metrics.medium,
      width: Metrics.medium,
      tintColor: Colors.text,
    },
    btnVoiceSearchText: {
      color: Colors.text,
      marginLeft: Metrics.small,
      ...Fonts.regular,
    },
    voiceContainer: {
      position: 'absolute',
      top: -Metrics.small,
      right: -Metrics.small,
      left: -Metrics.small,
      bottom: -Metrics.small,
      // paddingHorizontal: Metrics.medium,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      elevation: Metrics.small,
    },
    voiceBody: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: Metrics.icon,
      paddingHorizontal: Metrics.normal,
      borderRadius: Metrics.normal,
      backgroundColor: Colors.background,
      width: screenWidth / 2
    },
    voiceIcon: {
      width: Metrics.medium * 2,
      height: Metrics.medium * 2,
    },
    voiceBodyRight: {
      flex: 1,
      paddingLeft: Metrics.normal,
      paddingBottom: Metrics.tiny,
      // alignItems: 'center',
    },
    voiceResult: {
      ...Helpers.textBold,
      color: Colors.text,
    },
    voiceContentText: {
      textAlign: 'center',
      ...Helpers.textBold,
      color: Colors.blueText,
    },
    voiceDescText: {
      ...Fonts.medium,
      color: Colors.blueText,
      textAlign: 'center',
      marginTop: Metrics.tiny,
    },
    btnCloseVoice: {
      // borderWidth: 1,
      marginTop: Metrics.regular,
      paddingHorizontal: Metrics.medium,
      paddingVertical: Metrics.small,
    },
    btnCloseVoiceText: {
      color: Colors.text,
    },
    title: {
      ...Helpers.row,
    },
    titleCenter: {
      ...Helpers.rowCross,
    },
    addressStyle: {
      ...Fonts.regular,
      color: Colors.textBrightGrey,
      // color: Colors.black,
      marginRight: Metrics.regular,
      ...Helpers.wrapContent,
      flexShrink: 1,
    },
    textTitle: {
      width: screenWidth / 4 * 3
    },
    textIcon: {
      ...Fonts.regular,
      color: Colors.text,
    },
  })
};

export default createHorizontalStyles;
