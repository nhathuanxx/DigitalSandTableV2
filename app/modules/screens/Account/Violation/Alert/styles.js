import { StyleSheet, Dimensions, StatusBar } from "react-native";
const { width, height } = Dimensions.get("window");
import { Colors as Themes, Fonts, Helpers, Images, Metrics } from "@app/theme";

const createStyles = (isDarkTheme, screenWidth, screenHeight) => {
  const Colors = Themes[isDarkTheme ? 'darkMode' : 'lightMode'];
  return StyleSheet.create({
    container: {
      flex: 1,
      zIndex: 1000,
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      elevation: Metrics.small,
    },
    violationAlertContainer: {
      position: 'absolute',
      // top: StatusBar.currentHeight + Metrics.tiny * 7,
      right: (width - Metrics.regular) / 4,
      // left: 0,
      // right: 0,
      backgroundColor: 'rgba(0,0,0,0.7)',
      borderRadius: Metrics.normal,
      paddingHorizontal: Metrics.regular,
      paddingVertical: Metrics.icon,
      // maxHeight: screenHeight * 0.6
    },
    alertContent: {
      flexDirection: 'row',
      // borderWidth: 1,
    },
    alertContentRight: {
      flex: 1,
    },
    iconAlert: {
      height: Metrics.large,
      width: Metrics.large,
    },
    alertContentText: {
      color: Colors.white,
      marginLeft: Metrics.icon,
      marginTop: -Metrics.tiny,
      lineHeight: Metrics.icon,
    },
    btnSeeNow: {
      flexDirection: 'row',
    },
    seeNowText: {
      marginTop: Metrics.tiny,
      borderBottomWidth: 1,
      borderBottomColor: Colors.white,
    },
    btnNotShowAgain: {
      marginTop: Metrics.regular,
      flexDirection: 'row',
    },
    btnNotShowAgainText: {
      color: Colors.write_bright,
      fontStyle: 'italic',
    },
    textUnderLine: {
      borderBottomWidth: 1,
      borderBottomColor: Colors.write_bright,
    },
    backdrop: {
      position: "absolute",
      top: -Metrics.small,
      left: -Metrics.small,
      bottom: 0,
      right: -Metrics.regular,
      backgroundColor: 'rgba(0,0,0, 0.5)',
      elevation: Metrics.tiny,
    },
    alertSettingContainer: {
      // height: height / 2,
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: Colors.backgroundGrey,
      borderTopLeftRadius: Metrics.normal,
      borderTopRightRadius: Metrics.normal,
      elevation: Metrics.regular,
      paddingHorizontal: Metrics.small,
      paddingVertical: Metrics.regular,
      zIndex: 2,
      maxHeight: screenHeight * 0.6
    },
    title: {
      ...Helpers.textBold,
      paddingLeft: Metrics.small,
    },
    optionBtn: {
      paddingVertical: Metrics.regular,
      paddingHorizontal: Metrics.medium,
      backgroundColor: Colors.background,
      // elevation: Metrics.tiny / 2,/
      marginTop: Metrics.normal,
      borderRadius: Metrics.normal,
    },
    settingText: {
      ...Fonts.regular,
      ...Helpers.textBoldfive,
      color: Colors.text,
    },
    redText: {
      color: Colors.red,
    },

  })
};

export default createStyles;