import { StyleSheet, Dimensions, StatusBar } from "react-native";
import { Colors as Themes, Fonts, Helpers, Metrics } from "@app/theme";

const createSettingScreenStyle = (isDarkTheme) => {
  const Colors = Themes[isDarkTheme ? 'darkMode' : 'lightMode'];
  return StyleSheet.create({
    settingContainer: {
      height: '100%',
      elevation: Metrics.small,
      backgroundColor: Colors.background,
    },
    settingContent: {
      flex: 1,
    },
    settingElement: {
      // borderWidth: 1,
      paddingVertical: Metrics.regular,
    },
    titleElement: {
      flexDirection: 'row',
      alignItems: 'center'
    },
    title: {
      color: Colors.text,
      ...Helpers.textBoldfive,
      ...Fonts.regular,
      marginRight: Metrics.small,
    },
    line: {
      height: 1,
      backgroundColor: Colors.border,
    },
    flexFull: {
      flex: 1,
      backgroundColor: Colors.backgroundGrey,
    },
    logSetting: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between'
    },
    // borderSlider: {
    //   borderColor: Colors.slider,
    // },
    // borderWhite: {
    //   borderColor: Colors.white,
    // },
  })
};

export default createSettingScreenStyle;