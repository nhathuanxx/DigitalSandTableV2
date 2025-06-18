import { StyleSheet, Dimensions } from "react-native";
import { Colors as Themes, Fonts, Helpers, Images, Metrics } from "@app/theme";
const { width, height } = Dimensions.get("window");

// Lấy chiều cao của màn hình
const { height: screenHeight } = Dimensions.get('window');

const createStyles = (isDarkTheme) => {
  const Colors = Themes[isDarkTheme ? 'darkMode' : 'lightMode'];
  return StyleSheet.create({
    container: {
      // ...Helpers.fullSize,
      backgroundColor: Colors.blackOpacity,
      ...Helpers.center,
      ...Helpers.positionAbso,
      top: -Metrics.normal,
      left: -Metrics.normal,
      right: -Metrics.normal,
      bottom: -Metrics.normal,
      zIndex: 1000,
      elevation: Metrics.normal,
    },
    content: {
      width: width * 0.8,
      // height: Metrics.medium * 9,
      backgroundColor: Colors.backgroundGrey,
      borderRadius: Metrics.normal,
      paddingVertical: Metrics.regular,
      paddingHorizontal: Metrics.large,
    },
    body: {
      alignItems: 'center'
    },
    iconStyle: {
      width: Metrics.medium * 2,
      height: Metrics.medium * 2,
    },
    title: {
      ...Fonts.large,
      ...Helpers.textBold,
      color: Colors.text,
      marginTop: Metrics.small,
    },
    question: {
      marginTop: Metrics.small,
      color: Colors.text,
      textAlign: 'center'
    },
    footer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: Metrics.normal,
    },
    distanceView: {
      width: Metrics.small
    },
    btn: {
      paddingVertical: Metrics.small,
      borderWidth: 1,
      borderColor: Colors.blueText,
      borderRadius: Metrics.small,
      backgroundColor: Colors.blueText,
      flex: 1,
      alignItems: 'center'
    },
    btnText: {
      color: Colors.white,
    },
    btnCancel: {
      backgroundColor: Colors.red_orange,
      borderWidth: 1,
      borderColor: Colors.red_orange,
    }
  })
};

export default createStyles;
