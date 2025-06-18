import { StyleSheet, Dimensions } from "react-native";
// const { width, height } = Dimensions.get("window");
import { Colors as Themes, Fonts, Helpers, Images, Metrics } from "@app/theme";
import { color } from "react-native-reanimated";

const createHorizontalStyles = (isDarkTheme, screenWidth, screenHeight) => {
  const Colors = Themes[isDarkTheme ? 'darkMode' : 'lightMode'];
  return StyleSheet.create({

    content: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
    },
    contentLeft: {
      justifyContent: 'space-between',
    },

    footer: {
      width: '100%'
    },
    locationInput: {
      ...Helpers.fillRowBetween,
      paddingHorizontal: Metrics.normal,
      backgroundColor: Colors.background,
      borderRadius: Metrics.regular,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 2,
      elevation: 4,
      // width: '100%',
      height: Metrics.medium * 2,
      // flex: 1
      // borderWidth: 1,
      marginHorizontal: Metrics.small
    },
    arrowLeftIcon: {
      width: Metrics.medium,
      height: Metrics.medium,
      tintColor: Colors.textGrey,
    },
    searchTextInput: {
      ...Helpers.fill,
      backgroundColor: Colors.background,
      paddingHorizontal: Metrics.small,
      ...Fonts.large,
      color: Colors.text,
      height: Metrics.normal * 4,
      color: Colors.text,
      height: Metrics.medium * 2,
    },
    footerIconFrame: {
      marginLeft: Metrics.normal,
    },
    imageIcon: {
      width: Metrics.medium,
      height: Metrics.medium,
      tintColor: Colors.text,
    },
    topRightIconContainer: {
      ...Helpers.column,
    },
    iconButtonWrapper: {
      marginBottom: Metrics.regular,
    },
    iconCircleBackground: {
      backgroundColor: Colors.background,
      width: Metrics.normal * 3,
      height: Metrics.normal * 3,
      borderRadius: Metrics.normal,
      ...Helpers.center,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 2,
      elevation: 4,
    },
    boxIcon: {
      width: Metrics.icon,
      height: Metrics.icon,
      tintColor: Colors.text,
    },
    trafficLightIcon: {
      width: 27,
      height: 12,

    },
    // -------------------------------------
    contentRight: {
      justifyContent: 'space-between',
      alignItems: 'flex-end'
    },
    spacerHeight: {
      height: Metrics.small
    },
    menuBottom: {
      alignItems: 'flex-end',
      flexDirection: 'column',
    },
    iconList: {
      width: Metrics.icon,
      height: Metrics.icon,
      tintColor: Colors.text
    },
    iconListBackground: {
      alignSelf: 'flex-end',
      backgroundColor: Colors.background,
      padding: Metrics.small,
      borderRadius: Metrics.normal,
      ...Helpers.rowCenter,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 2,
      elevation: 4,
      marginTop: Metrics.small,
    },
    iconListText: {
      marginLeft: Metrics.tiny,
      color: Colors.text,
      ...Fonts.regular,
    },
    searchList: {
      ...Helpers.positionAbso,
      right: Metrics.small,
      bottom: Metrics.icon * 5,
      marginBottom: Metrics.normal,
      zIndex: 2,
      marginBottom: Metrics.medium,
    },
    searchLocationContainer: {
      ...Helpers.positionAbso,
      right: Metrics.small,
      // marginBottom: Metrics.regular,
      zIndex: 2,
      // borderColor: 'red',
      // borderWidth: 1
    },
    icon: {
      width: Metrics.medium,
      height: Metrics.medium,
      tintColor: Colors.text
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
    // -------------------------------------------------------------------------------------------
    horizontalBar: {
      width: Metrics.medium,
      height: Metrics.tiny,
      backgroundColor: Colors.charcoal_gray,
      ...Helpers.selfCenter,
      marginBottom: Metrics.tiny,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 2,
      elevation: 4,

    },
    // --------------------------------------------------------------------------------------
    containerText: {
      marginHorizontal: Metrics.small,
      paddingHorizontal: Metrics.regular,
      // paddingBottom: Metrics.regular,
      // paddingTop: Metrics.small,
      paddingVertical: Metrics.small,
      backgroundColor: Colors.background,
      borderTopLeftRadius: Metrics.normal,
      borderTopRightRadius: Metrics.normal,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 2,
      elevation: 4,
    },
    textLocation: {
      ...Fonts.regular,
      ...Helpers.textBoldfive,
      color: Colors.text,
      marginBottom: 1
    },
    locationAddress: {
      fontSize: 15,
      color: Colors.textGrey,
      ...Helpers.wrapContent,
      marginBottom: Metrics.tiny,
    },
    // ------------------------------------------------------------------
    iconBottom: {
      width: Metrics.icon,
      height: Metrics.icon,
    },
    iconColor: {
      tintColor: Colors.text
    },
    containerContentBottom: {
      ...Helpers.fillRowBetween,
      paddingHorizontal: Metrics.tiny,
      borderTopColor: Colors.border,
      borderTopWidth: 1,
      backgroundColor: Colors.backgroundGrey,
      zIndex: 2,
      justifyContent: 'space-around',
      paddingTop: Metrics.small,
    },
    card: {
      alignItems: 'center'
    },
    cardWithBorder: {
      ...Helpers.rowCenter,
      borderRadius: Metrics.medium,
      paddingVertical: Metrics.small,
      paddingHorizontal: Metrics.normal,
    },
    border: {
      borderWidth: 1,
      borderColor: Colors.textGrey,
    },
    iconWay: {
      width: Metrics.medium,
      height: Metrics.medium,
      marginRight: 2,
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
    //   -----------------------------------------------------------------------------------------------------------  
    container: {
      ...Helpers.fill,
    },
    searchContentAddress: {
      // ...Helpers.positionAbso,
      // bottom: 0,
      // right: 0,
      // left: 0,
      // zIndex: 2,
    },
    // -----------------------------------------
    locationList: {
      ...Helpers.fill,
      ...Helpers.mainStart,
    },
    flatList: {
      maxHeight: '100%', // Đảm bảo rằng FlatList sử dụng chiều cao tối đa của container
    },
    viewLocationContent: {
      ...Helpers.row,
      ...Helpers.mainSpaceBetween,
      ...Helpers.crossStart,
      padding: Metrics.normal,
      borderTopColor: Colors.grey_light_hue,
      borderTopWidth: 1,
      borderRadius: 12,
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
    distanceContainer: {
      backgroundColor: Colors.grayish_blue,
      borderRadius: Metrics.tiny,
      paddingVertical: 2,
      alignSelf: 'flex-start',
      borderRadius: Metrics.tiny,
      paddingHorizontal: Metrics.tiny,
      // marginTop: 4,
      // borderColor: 'red',
      // borderWidth: 1
    },

    distanceText: {
      ...Fonts.medium,
      fontWeight: '500'

    },
    viewIconRight: {
      width: Metrics.icon,
      height: Metrics.icon,
    },
    viewIconRadio: {
      height: Metrics.icon,
      width: Metrics.medium,
    },
    // ---------------------------------------------------------------------------------------------------------------------
    overlay: {
      ...Helpers.positionAbso,
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.3)',
      ...Helpers.center
    },
  })
};

export default createHorizontalStyles;
