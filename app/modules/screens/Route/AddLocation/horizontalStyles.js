import { StyleSheet, Dimensions } from "react-native";
import { Colors as Themes, Fonts, Helpers, Images, Metrics } from "@app/theme";

const createHorizontalStyles = (isDarkTheme, screenWidth, screenHeight) => {
  const Colors = Themes[isDarkTheme ? 'darkMode' : 'lightMode'];
  return StyleSheet.create({
    navigationSearchInputContainer: {
      height: Metrics.medium * 9,
      backgroundColor: Colors.background,
      borderRadius: Metrics.small,
      padding: Metrics.small,
      // marginHorizontal: Metrics.normal,
      width: screenWidth * 9 / 20
    },
    navigationInput: {
      ...Helpers.fillRow,
    },
    navigationIcon: {
      height: Metrics.large,
      marginTop: Metrics.regular,
      ...Helpers.row,
    },
    navigationBack: {
      ...Helpers.crossCenter,
      width: Metrics.large,
    },
    navigationLocation: {
      // width: Metrics.large * 7,
      borderRadius: Metrics.normal,
      // backgroundColor: Colors.red,
      paddingTop: Metrics.small,
      paddingBottom: Metrics.small,
      paddingLeft: Metrics.small,
      paddingRight: Metrics.small,
      // ...Helpers.fillRowCross,
      flex: 1,
    },
    backImg: {
      height: Metrics.icon,
      tintColor: Colors.text,
    },
    back: {
      height: Metrics.large,
      ...Helpers.center,
      marginTop: Metrics.normal,
    },
    navigationImg: {
      width: Metrics.large,
      ...Helpers.center,
    },
    inputText: {
      flex: 1,
      height: Metrics.large,
      ...Helpers.mainCenter,
    },
    fromToImg: {
      height: Metrics.small,
      width: Metrics.small
    },
    inputLocationItem: {
      ...Helpers.fillRowCross,
    },
    inputBody: {
      flex: 1,
      ...Helpers.row,
      backgroundColor: Colors.backgroundGhoshLight,
      marginRight: Metrics.small,
      borderRadius: Metrics.small,
      paddingRight: Metrics.normal,
      height: Metrics.small * 5,
      ...Helpers.center,
      marginBottom: Metrics.small,
    },
    close: {
      ...Helpers.center,
      height: Metrics.small * 5,
      width: Metrics.icon,
      paddingRight: Metrics.tiny,
      paddingLeft: Metrics.tiny,
    },
    icon: {
      ...Helpers.center,
      marginLeft: Metrics.small,
    },
    img: {
      height: Metrics.icon,
      width: Metrics.icon,
      tintColor: Colors.textBrightGrey,
    },
    imgClose: {
      height: Metrics.icon,
      width: Metrics.icon,
      tintColor: Colors.text,
    },
    addLocationContainer: {
      ...Helpers.rowCross,
      ...Helpers.mainSpaceBetween,
      marginRight: Metrics.regular,
      marginLeft: Metrics.regular,
    },
    blackText: {
      color: Colors.text,
    },
    addButton: {
      ...Helpers.row,
      paddingTop: Metrics.small,
      paddingBottom: Metrics.small,
      ...Helpers.center,
    },
    blueText: {
      color: Colors.blueText,
      ...Helpers.textBoldfive,
      ...Fonts.regular,
    },
    addText: {
      ...Fonts.regular,
      ...Helpers.textBoldfive,
      marginLeft: Metrics.normal,
    },
    okButton: {
      // backgroundColor: Colors.red,
      paddingTop: Metrics.small,
      paddingBottom: Metrics.small,
    },
    grayText: {
      color: Colors.textGrey,
    },
    textSize: {
      ...Helpers.textBoldfive,
    },
  })
};

export default createHorizontalStyles;
