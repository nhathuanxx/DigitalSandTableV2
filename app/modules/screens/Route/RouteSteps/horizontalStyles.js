import { StyleSheet, Dimensions } from "react-native";
import { Colors as Themes, Fonts, Helpers, Images, Metrics } from "@app/theme";

const createHorizontalStyles = (isDarkTheme, screenWidth, screenHeight) => {
  const Colors = Themes[isDarkTheme ? 'darkMode' : 'lightMode'];
  console.log('height: hori----------- ', screenHeight)
  return StyleSheet.create({
    routeStepsContainer: {
      ...Helpers.positionAbso,
      bottom: 0,
      width: screenWidth * 9 / 20,
      backgroundColor: Colors.background,
      borderTopLeftRadius: Metrics.normal,
      borderTopRightRadius: Metrics.normal,
      overflow: 'hidden',
      borderTopWidth: 1,
      borderTopColor: Colors.border
      // elevation: Metrics.small
    },
    routeStepsContent: {
      backgroundColor: Colors.background,
      flex: 1,
    },
    routeStepsTittle: {
      height: screenHeight * 0.15,
      backgroundColor: Colors.background,
      ...Helpers.fillRowBetween,
      paddingLeft: Metrics.regular,
      paddingRight: Metrics.regular,
      borderBottomWidth: 0.5,
      borderBottomColor: Colors.grey_medium_light,
      marginBottom: Metrics.normal,
      // paddingTop: Metrics.regular,
      // paddingBottom: Metrics.regular,
    },
    routeSteps: {
      // paddingLeft: Metrics.normal,
      // paddingRight: Metrics.normal,
      paddingTop: Metrics.normal,
      // backgroundColor: Colors.red,
    },
    close: {
      ...Helpers.colCenter,
      // height: '100%',
      width: Metrics.large * 2,
    },
    text: {
      color: Colors.text,
      marginTop: Metrics.small,
    },
    title: {
      // flex: 1,
      ...Helpers.fillCenter,
      paddingLeft: Metrics.normal,
      paddingRight: Metrics.normal,
    },
    titleText: {
      textAlign: 'center',
      color: Colors.blue_light,
      ...Fonts.large,
      fontWeight: '600'
    },
    compact: {
      ...Helpers.colCenter,
      // height: '100%',
      width: Metrics.medium * 3,
      // paddingLeft: Metrics.small,
    },
    icon: {
      width: Metrics.regular,
      height: Metrics.regular,
      // marginBottom: Metrics.tiny / 2,
      tintColor: Colors.text,
    },
    line: {
      height: '70%',
      width: 1,
      backgroundColor: Colors.grey_medium_light,
    },
    stepText: {
      color: Colors.text,
      marginRight: Metrics.medium,
    },
    stepOption: {
      ...Helpers.fillRowCross,
      height: Metrics.large,
      marginBottom: Metrics.medium,
      marginLeft: Metrics.medium,
    },
    lineStep: {
      height: 0.5,
      backgroundColor: Colors.grey_medium_light,
      flex: 1,
      marginLeft: Metrics.small,
    },
    stepTime: {
      ...Helpers.rowCross,
      marginBottom: Metrics.small,
    },
    stepTimeText: {
      color: Colors.textGrey,
    },
    step: {
      flex: 1,
      marginLeft: Metrics.regular,
    },
    stepTitle: {
      // backgroundColor: Colors.red,
      ...Helpers.rowCross,
      marginBottom: Metrics.regular,
    },
    stepTitleText: {
      color: Colors.text,
      ...Helpers.textBoldfive,
      borderWidth: 0.5,
      borderRadius: Metrics.medium,
      paddingLeft: Metrics.small,
      paddingRight: Metrics.small,
      paddingTop: Metrics.tiny,
      paddingBottom: Metrics.tiny,
      maxWidth: 320,
    },
    lineStepStart: {
      height: 0.5,
      backgroundColor: Colors.text,
      width: Metrics.medium,
    },
    lineStepEnd: {
      height: 0.5,
      backgroundColor: Colors.text,
    },
  })
};

export default createHorizontalStyles;
