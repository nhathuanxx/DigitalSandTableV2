import { StyleSheet, Dimensions } from "react-native";
// const { width, height } = Dimensions.get("window");
import { Colors as Themes, Fonts, Helpers, Images, Metrics } from "@app/theme";

const createHorizontalStyles = (isDarkTheme, screenWidth, screenHeight) => {
  const Colors = Themes[isDarkTheme ? 'darkMode' : 'lightMode'];
  return StyleSheet.create({
    container: {
      // backgroundColor: Colors.backgroundGrey,
      flex: 1
    },
    content: {
      flex: 1,
      // width: screenWidth * 5 / 12,
      backgroundColor: Colors.backgroundGrey,
    },
    topContent: {
      flex: 1,
    },
    bgLocationInfo: {
      ...Helpers.fullWidth,
      height: screenHeight / 3,
      // width: 100%,
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
      // ...Helpers.positionRela,
      // // bottom: Metrics.regular,
      // left: 0,
      // right: 0,
      // borderWidth: 1,
      paddingVertical: Metrics.small,
      flex: 1,
    },
    locationInfo: {
      paddingHorizontal: Metrics.normal,
      paddingVertical: Metrics.tiny,
      backgroundColor: Colors.background,
      borderTopLeftRadius: Metrics.normal,
      borderTopRightRadius: Metrics.normal
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
      borderBottomLeftRadius: Metrics.small,
      borderBottomRightRadius: Metrics.small,
      backgroundColor: Colors.background,
      flex: 1
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
      // ...Helpers.fillRowBetween,
      flexDirection: 'row',
      alignItems: 'center',
      paddingTop: Metrics.small,
      // marginTop: 'auto',
      borderTopColor: Colors.bright_light,
      borderTopWidth: 1,
      backgroundColor: Colors.backgroundGrey,
      paddingHorizontal: Metrics.normal,
    },
    spacer: {
      width: Metrics.large
    },
    flexRow: {
      flexDirection: 'row'
    },
    card: {
      // ...Helpers.fillCenter,
      // borderWidth: 1,
      paddingRight: Metrics.large,
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center'
    },
    cardWithBorder: {
      ...Helpers.rowCenter,
      borderRadius: Metrics.medium,
      paddingVertical: Metrics.small,
      paddingHorizontal: Metrics.normal,
      // marginHorizontal: 2
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

export default createHorizontalStyles;
