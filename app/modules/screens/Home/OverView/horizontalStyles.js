import { StyleSheet, Dimensions } from "react-native";
// const { width, height } = Dimensions.get("window");
import { Colors as Themes, Fonts, Helpers, Images, Metrics } from "@app/theme";

const createHorizontalStyles = (isDarkTheme, screenWidth, screenHeight) => {
  const Colors = Themes[isDarkTheme ? 'darkMode' : 'lightMode'];
  return StyleSheet.create({
    container: {
      flex: 1,
    },
    content: {
      position: 'absolute',
      top: 0,
      right: 0,
      left: 0,
      bottom: 0
    },
    contentTop: {
      position: 'absolute',
      top: 0,
      right: 0,
      left: 0,
      flexDirection: 'row',
      paddingHorizontal: Metrics.small,
    },
    contentBottom: {
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 0,
      paddingHorizontal: Metrics.small,
      flexDirection: 'row',
      justifyContent: 'space-between'
    },
    contentBottomLeft: {
      justifyContent: 'flex-end'
    },
    icon_Style: {
      width: Metrics.icon,
      height: Metrics.icon,
      tintColor: Colors.text,
    },

    iconStyleInput: {
      width: Metrics.medium,
      height: Metrics.medium,
      tintColor: Colors.text,
    },
    iconStyle: {
      width: Metrics.medium,
      height: Metrics.regular,
    },
    viewMenuTop: {
      flex: 1,
      alignItems: 'flex-end'
    },
    viewContentTopLeft: {
    },
    contentMenuTop: {
      // ...Helpers.positionAbso,
      // right: 0,
      backgroundColor: Colors.background,
      padding: Metrics.tiny,
      borderRadius: Metrics.normal,
      // marginTop: Metrics.regular,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 2,
      elevation: 4,
    },

    viewHeaderIconTop: {
      ...Helpers.crossCenter,
    },
    underline: {
      borderBottomWidth: 1,
      borderBottomColor: Colors.light_grey,
    },
    iconPadding: {
      paddingHorizontal: Metrics.tiny,
      paddingVertical: Metrics.small,
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
    // -----------------------------------------------------------------------------------------------------------------------------------------------------------
    viewIconBotRightButtonRoute: {
      ...Helpers.crossCenter,

    },

    viewWeatherIconTextContent: {
      ...Fonts.large,
      color: Colors.dark_green_light,

      marginLeft: Metrics.tiny,
      ...Helpers.textBoldfive,
    },

    viewWeatherIconBottomLeft: {
      ...Helpers.positionAbso,
      bottom: Metrics.medium * 3,
      left: Metrics.tiny,
      backgroundColor: Colors.background,
      padding: Metrics.tiny,
      borderRadius: Metrics.normal,
      marginLeft: Metrics.tiny,
      borderWidth: 1,
      borderColor: Colors.searchBorder,
    },
    viewWeatherIconBottomLeftContent: {
      ...Helpers.rowCross,
      ...Helpers.crossCenter,
    },
    viewIconBotRightContainer: {
      // ...Helpers.positionAbso,
      // bottom: Metrics.medium * 3,
      // right: 0,
      ...Helpers.column,
      ...Helpers.mainSpaceBetween,
      zIndex: 2
    },
    spacerHeight: {
      height: Metrics.small
    },
    viewIconBotRight: {
      borderRadius: Metrics.small,
      borderColor: Colors.border,
      // borderWidth: 1,
      padding: Metrics.small,
      ...Helpers.center,
      backgroundColor: Colors.background,
      shadowColor: Colors.shadow, // Màu của shadow
      shadowOffset: { width: 0, height: Metrics.small }, // Vị trí của shadow (x, y)
      shadowOpacity: 0.9, // Độ mờ của shadow (0-1)
      shadowRadius: Metrics.tiny, // Độ mờ của shadow (giá trị càng cao thì shadow càng mềm)
    },
    viewIconBotRightMenu: {
      borderRadius: Metrics.small,
      ...Helpers.center,
      backgroundColor: Colors.background,
      paddingTop: Metrics.tiny,
      paddingBottom: 2,
      shadowColor: Colors.shadow, // Màu của shadow
      shadowOffset: { width: 0, height: Metrics.small }, // Vị trí của shadow (x, y)
      shadowOpacity: 0.9, // Độ mờ của shadow (0-1)
      shadowRadius: Metrics.tiny, // Độ mờ của shadow (giá trị càng cao thì shadow càng mềm)
    },
    viewIconBotRightRoute: {
      borderRadius: Metrics.small,
      paddingLeft: Metrics.tiny,
      paddingRight: Metrics.tiny,
      paddingTop: Metrics.tiny,
      paddingBottom: 2,
      ...Helpers.center,
      backgroundColor: Colors.background,
      shadowColor: Colors.shadow,// Màu của shadow
      shadowOffset: { width: 0, height: Metrics.small }, // Vị trí của shadow (x, y)
      shadowOpacity: 0.9, // Độ mờ của shadow (0-1)
      shadowRadius: Metrics.tiny, // Độ mờ của shadow (giá trị càng cao thì shadow càng mềm)
    },
    viewIconRadio: {
      paddingHorizontal: 0,
      paddingVertical: Metrics.small,
    },
    iconRadio: {
      height: Metrics.icon,
      width: Metrics.large,
    },

    // -----------------------------------------------------------------------------------------------------------------------------------------------------------------------
    viewFooterInput: {
      ...Helpers.fillRowBetween,
      backgroundColor: Colors.background,
      borderRadius: Metrics.regular,
      shadowColor: Colors.shadow, // Màu của shadow
      shadowOffset: { width: 0, height: Metrics.small }, // Vị trí của shadow (x, y)
      shadowOpacity: 1, // Độ mờ của shadow (0-1)
      shadowRadius: Metrics.tiny, // Độ mờ của shadow (giá trị càng cao thì shadow càng mềm)
      elevation: Metrics.tiny,
      borderWidth: 1,
      borderColor: Colors.border,
      width: screenWidth * 9 / 20,
      marginTop: Metrics.small
    },
    viewFooterInputIconShare: {
      paddingLeft: Metrics.regular,
    },
    viewContentInput: {
      flex: 1,
      color: Colors.textBrightGrey,
      marginLeft: Metrics.regular,
      height: Metrics.medium * 2,
      ...Helpers.mainCenter,
    },
    viewFooterInputIconFrame: {
      paddingRight: Metrics.regular,
    },
    viewIconRight: {
      width: Metrics.icon,
      height: Metrics.icon,
    },
    viewIconRightRoute: {
      width: Metrics.normal,
      height: Metrics.regular,
    },
    viewIconRightRouteText: {
      ...Fonts.tiny,
      color: Colors.blue_light,
      ...Helpers.textBold,

    },
    viewIconMenu: {
      width: Metrics.medium,
      height: Metrics.regular,
      tintColor: Colors.text,
    },
    viewIconRightMenuText: {
      ...Fonts.tiny,
      color: Colors.text,
      ...Helpers.textBold,
    },
    inputSearchText: {
      ...Fonts.large,
      color: Colors.textBrightGrey,
    },
    // ----------------------------------------------------------------------------------------------
  })
};

export default createHorizontalStyles;
