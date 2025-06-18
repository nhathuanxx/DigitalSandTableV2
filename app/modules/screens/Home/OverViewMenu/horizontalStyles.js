import { StyleSheet, Dimensions } from "react-native";
const { width, height } = Dimensions.get("window");
import { Colors as Themes, Fonts, Helpers, Images, Metrics } from "@app/theme";

const createHorizontalStyles = (isDarkTheme) => {
  const Colors = Themes[isDarkTheme ? 'darkMode' : 'lightMode'];
  return StyleSheet.create({
    iconStyle: {
      width: Metrics.icon,
      height: Metrics.icon,
      tintColor: Colors.text,
    },
    iconBlack: {
      tintColor: Colors.white,
    },
    viewIconBotRightContainer: {
      ...Helpers.column,
      ...Helpers.crossEnd,
    },
    spacerHeight: {
      height: Metrics.small
    },
    viewIconBotRightContentMenu: {
      ...Helpers.rowMain,
      ...Helpers.rowCross,
      borderRadius: Metrics.small,
    },
    textStyle: {
      backgroundColor: Colors.blackOpacityMenu,
      color: Colors.white,
      paddingVertical: Metrics.tiny,
      paddingHorizontal: Metrics.small,
      borderRadius: Metrics.tiny,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 2,
      elevation: 4,
    },

    textStyle: {
      backgroundColor: Colors.blackOpacityMenu,
      color: Colors.white,
      paddingVertical: Metrics.tiny,
      paddingHorizontal: Metrics.small,
      borderRadius: Metrics.tiny,
    },

    iconStyleMMenu: {
      backgroundColor: Colors.background,
      padding: Metrics.small,
      marginLeft: Metrics.small,
      borderRadius: Metrics.medium,
      ...Helpers.center,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 2,
      elevation: 4,
    },

    iconStyleMenuClose: {
      backgroundColor: Colors.blackOpacityMenu,
      padding: Metrics.small,
      marginLeft: Metrics.small,
      borderRadius: Metrics.medium,
      ...Helpers.center,
    },
  })
};

export default createHorizontalStyles;
