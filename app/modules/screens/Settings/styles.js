import { StyleSheet, Dimensions, StatusBar } from "react-native";
import { Colors as Themes, Fonts, Helpers, Metrics } from "@app/theme";


const createStyles = (isDarkTheme, screenWidth, screenHeight) => {
  const Colors = Themes[isDarkTheme ? 'darkMode' : 'lightMode'];
  return StyleSheet.create({
    containerSettingBox: {
      flex: 1,
      zIndex: 1000,
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      elevation: Metrics.regular,
    },
    // bottom sheet
    bottomSheetSettings: {
      position: 'absolute',
      backgroundColor: Colors.background,
      borderTopLeftRadius: Metrics.regular,
      borderTopRightRadius: Metrics.regular,
      overflow: 'hidden',
      left: 0,
      bottom: 0,
      right: 0,
    },
    header: {
      paddingHorizontal: Metrics.medium,
      paddingTop: Metrics.medium,
    },
    headerText: {
      ...Helpers.textBold,
      ...Fonts.large,
      color: Colors.text,

    },
    content: {
      marginTop: Metrics.normal,
      flex: 1
      // height: screenHeight * 0.35,
    },
    titleContent: {
      paddingVertical: Metrics.tiny,
      paddingHorizontal: Metrics.medium,
      backgroundColor: Colors.backgroundGrey,
      color: Colors.textGrey,
      fontSize: Metrics.normal,
    },
    option: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: Metrics.medium,
      paddingVertical: Metrics.normal,
      // borderWidth: 1,
    },
    optionIcon: {
      tintColor: Colors.text,
    },
    optionText: {
      color: Colors.text,
      ...Fonts.medium,
      marginLeft: Metrics.normal,
      flex: 1,
    },
    optionIconRight: {
      width: Metrics.small,
      height: Metrics.normal,
      tintColor: Colors.textGrey
    },
    icMedium: {
      height: Metrics.medium,
      width: Metrics.medium,
    },
    backdrop: {
      position: "absolute",
      top: 0,
      left: -Metrics.small,
      bottom: 0,
      right: -Metrics.small,
      backgroundColor: 'rgba(0,0,0, 0.5)',
    },
    flexFull: {
      flex: 1,
    }
  })
};

export default createStyles;