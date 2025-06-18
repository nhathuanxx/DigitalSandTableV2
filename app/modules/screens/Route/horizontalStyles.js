import { StyleSheet, Dimensions } from "react-native";
import { Colors as Themes, Fonts, Helpers, Images, Metrics } from "@app/theme";

const createHorizontalStyles = (isDarkTheme, screenWidth, screenHeight) => {
  const Colors = Themes[isDarkTheme ? 'darkMode' : 'lightMode'];
  return StyleSheet.create({
    container: {
      flex: 1,
    },

    contentTop: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      // flexDirection: 'row',
      // justifyContent: 'space-between'
      // borderWidth: 1,
    },
    viewBtnAction: {
      // marginLeft: Metrics.normal,
      width: screenWidth * 0.45,
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    btnActionRight: {
      flex: 1,
      alignItems: 'flex-end'
    },
    // btn radio
    viewIconRadio: {
      // marginTop: Metrics.tiny,
      backgroundColor: Colors.background,
      width: Metrics.icon * 2,
      height: Metrics.icon * 2,
      borderRadius: Metrics.normal,
      ...Helpers.center,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 2,
      // elevation: 4,
    },
    iconStyle: {
      width: Metrics.icon,
      height: Metrics.icon,
      resizeMode: 'contain',
    },
    iconRadio: {
      height: Metrics.icon,
      width: Metrics.medium,
    },
  })
};

export default createHorizontalStyles;
