import { StyleSheet, Dimensions } from "react-native";
import { Colors as Themes, Fonts, Helpers, Images, Metrics } from "@app/theme";

const createHorizontalStyles = (isDarkTheme, screenWidth, screenHeight) => {
  const Colors = Themes[isDarkTheme ? 'darkMode' : 'lightMode'];
  return StyleSheet.create({
    navigationStepContainer: {
      // minHeight: Metrics.large * 5,
      // width: width,
      // ...Helpers.positionAbso,
      width: screenWidth * 9 / 20,
      // height: screenHeight / 4,
      borderRadius: Metrics.regular,
    },
    navigationStepBody: {
      flex: 1,
      // backgroundColor: Colors.red,
      // paddingBottom: Metrics.medium,
      // paddingRight: Metrics.medium,
      // paddingLeft: Metrics.medium,
      padding: Metrics.normal,
      ...Helpers.row,
    },
    icon: {
      ...Helpers.center,
    },
    body: {
      // flex: 1,
      // backgroundColor: Colors.red,
      ...Helpers.fillColMain,
      paddingLeft: Metrics.small,
    },
    textWhite: {
      color: Colors.white
    },
    fistText: {
      ...Helpers.fillRowCross,
      // backgroundColor: Colors.blue,
    },
    textBold: {
      fontWeight: '500',
      fontSize: 24,
    },
    textDirection: {
      marginLeft: Metrics.normal,
      fontSize: 17,
    },
    img: {
      height: Metrics.large * 2,
      width: Metrics.large * 2,
      tintColor: Colors.white,
    }
  })
};

export default createHorizontalStyles;
