import { StyleSheet, Dimensions, StatusBar } from "react-native";
const { width, height } = Dimensions.get("window");
import { Colors as Themes, Fonts, Helpers, Images, Metrics } from "@app/theme";

const createStyles = (isDarkTheme) => {
  const Colors = Themes[isDarkTheme ? 'darkMode' : 'lightMode'];
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: Colors.backgroundGrey,
    },
    header: {
      // paddingHorizontal: Metrics.small,
      // paddingTop: StatusBar.currentHeight,
      flexDirection: 'row',
      alignItems: 'center',
      position: 'absolute',
      top: -Metrics.tiny,
      left: -Metrics.tiny,
      right: -Metrics.tiny,
      zIndex: 100,
      backgroundColor: Colors.transparent,
    },
    bgrWhite: {
      backgroundColor: Colors.backgroundGrey,
      borderBottomWidth: 0.5,
      borderBottomColor: Colors.border
    },
    bgrTransparent: {
      backgroundColor: Colors.transparent,
    },
    iconRegular: {
      width: Metrics.regular,
      height: Metrics.regular,
    },
    iconMedium: {
      width: Metrics.medium,
      height: Metrics.medium,
    },
    iconBlue: {
      tintColor: Colors.blue_app,
    },
    iconColor: {
      tintColor: Colors.text,
    },
    btnCloseScreen: {
      paddingHorizontal: Metrics.regular + Metrics.tiny,
      paddingVertical: Metrics.regular,
    },
    footer: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: Colors.background,
      paddingHorizontal: Metrics.regular,
      paddingTop: Metrics.small,
      borderTopWidth: 0.5,
      borderTopColor: Colors.border
    },
    btnFooterArea: {
      flexDirection: 'row',
      justifyContent: 'center',
    },
    btnFooter: {
      paddingVertical: Metrics.normal,
      paddingHorizontal: Metrics.large,
      borderRadius: Metrics.medium,
      justifyContent: 'center',
      alignItems: 'center'
    },
    btnFooterText: {
      ...Helpers.textBoldfive,
      color: Colors.white,
    },
    distanceView: {
      width: Metrics.small
    },
    footerText: {
      ...Helpers.textBoldfive,
      ...Fonts.small,
      marginTop: Metrics.small,
      textAlign: 'center',
      color: Colors.textGrey
    },
    content: {
      flex: 1,
    },
    title: {
      paddingHorizontal: Metrics.regular,
      paddingTop: Metrics.large * 3,
      alignItems: 'center',
      borderColor: Colors.blue
    },
    listArea: {
      paddingHorizontal: Metrics.regular,
    },
    plateNumber: {
      borderWidth: 1,
      borderColor: Colors.text,
      fontSize: Metrics.medium,
      ...Helpers.textBold,
      color: Colors.text,
      paddingVertical: Metrics.tiny,
      paddingHorizontal: Metrics.small,
      borderRadius: Metrics.tiny,
    },
    textBlue: {
      color: Colors.slider,
    },
    textRed: {
      color: Colors.red,
    },
    textGrey: {
      color: Colors.textGrey
    },
    violationTitle: {
      marginTop: Metrics.regular,
      color: Colors.text,
      ...Fonts.large,
      ...Helpers.textBold,
    },
    updateTime: {
      marginTop: Metrics.small,
      color: Colors.textGrey,
    },
    violationDetail: {
      // marginHorizontal: Metrics.regular,
      marginTop: Metrics.regular,
      borderWidth: 1,
      borderColor: Colors.border,
      borderRadius: Metrics.small,
      flexDirection: 'row',
      justifyContent: 'space-around',
      padding: Metrics.small,
      alignItems: 'center',
      width: '100%',
    },
    lineVertical: {
      height: '100%',
      borderWidth: 0.5,
      borderColor: Colors.border,
      // ma
    },
    line: {
      height: 1,
      backgroundColor: Colors.border,
    },
    violationText: {
      ...Fonts.medium,
      color: Colors.blueText,
      ...Helpers.textBoldfive,
      // borderWidth: 1,
    },
    footerList: {
      height: Metrics.large * 4,
    },
    card: {
      borderWidth: 1,
      borderColor: Colors.border,
      borderRadius: Metrics.small,
      marginTop: Metrics.regular,
      // paddingVertical: Metrics.regular,
      backgroundColor: Colors.background,
      overflow: 'hidden'
    },
    cardHeader: {
      padding: Metrics.regular,
      // backgroundColor: Colors.backgroundPink,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between'
    },
    cardHeaderLeft: {
      flex: 6,
      paddingRight: Metrics.small,
    },
    cardTitle: {
      ...Fonts.large,
      ...Helpers.textBold,
      color: Colors.text,
    },
    violationTime: {
      color: Colors.text,
      ...Fonts.small,
    },
    cardItem: {
      paddingVertical: Metrics.regular,
    },
    titleItem: {
      color: Colors.text,
      ...Helpers.textBoldfive,
      ...Fonts.medium,
      marginBottom: Metrics.tiny,
    },
    contactItem: {
      flexDirection: 'row',
      justifyContent: "space-between",
      alignItems: 'center',
    },
    contactBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: Metrics.tiny,
    },
    contactText: {
      marginLeft: Metrics.small,
      color: Colors.red,
      ...Helpers.textBoldfive,
    },
    cardContent: {
      paddingHorizontal: Metrics.regular,
    },
    status: {
      flex: 3,
      ...Helpers.textBoldfive,
      paddingVertical: Metrics.tiny,
      paddingHorizontal: Metrics.small,
      borderRadius: Metrics.small,
      textAlign: 'center'
    },
    statusRed: {
      backgroundColor: Colors.lightPink,
      color: Colors.red,
    },
    statusBlue: {
      backgroundColor: Colors.lightBlue,
      color: Colors.blueText,
    },
    plateLocation: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    plateLocationText: {
      flex: 1,
      paddingLeft: Metrics.normal,
    },
    locationBtn: {
      marginLeft: - Metrics.tiny,
      // marginRight: Metrics.normal,
    },


  })
};

export default createStyles;