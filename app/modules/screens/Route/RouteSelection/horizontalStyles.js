import { StyleSheet, Dimensions } from "react-native";
import { Colors as Themes, Fonts, Helpers, Images, Metrics } from "@app/theme";

const createHorizontalStyles = (isDarkTheme, screenWidth, screenHeight) => {
  const Colors = Themes[isDarkTheme ? 'darkMode' : 'lightMode'];
  return StyleSheet.create({
    routeSelectionContainer: {
      ...Helpers.positionAbso,
      // minHeight: Metrics.large * 5,
      // backgroundColor: Colors.white,
      backgroundColor: Colors.backgroundGhoshLight,
      borderRadius: Metrics.small,
      paddingVertical: Metrics.small,
      width: screenWidth * 9 / 20,
      paddingHorizontal: Metrics.regular
    },
    routeOptions: {
      flex: 1,
      ...Helpers.row,
      ...Helpers.mainCenter,
    },
    displayStep: {
      // backgroundColor: Colors.blue_light,
      // height: Metrics.normal * 4,
      borderRadius: Metrics.large,
      marginTop: Metrics.small,
      // ...Helpers.center,
      flexDirection: 'row',
      ...Helpers.row,
      padding: Metrics.small,
      borderWidth: 0.5,
      borderColor: Colors.dark_gray,
    },
    displayStepText: {
      color: Colors.text,
      marginLeft: Metrics.tiny,
      ...Fonts.regular,
      // borderWidth: 1,
    },
    displayStepImg: {
      height: Metrics.icon,
      width: Metrics.icon,
    },
    routeOption: {
      backgroundColor: Colors.background,
      // height: Metrics.large,
      // minWidth: Metrics.regular * 7,
      flex: 1,
      borderRadius: Metrics.small,
      padding: Metrics.small,
      paddingLeft: Metrics.regular,
      // marginLeft: Metrics.regular,
      // marginRight: Metrics.regular,
      // ...Helpers.mainCenter,
    },
    distanceTextSelected: {
      color: Colors.blueText,
      ...Fonts.regular,
      marginTop: Metrics.tiny,
      marginBottom: Metrics.tiny,
      fontWeight: '700'
    },
    durationTextSelected: {
      color: Colors.blueText,
      ...Fonts.medium,
    },
    titleTextSelected: {
      color: Colors.blueText,
      ...Fonts.medium,
    },
    routeOptionUnSelect: {
      // backgroundColor: Colors.white,
      // height: Metrics.large,
      minWidth: Metrics.regular * 7,
      borderRadius: Metrics.small,
      padding: Metrics.small,
      marginLeft: Metrics.tiny,
      marginRight: Metrics.tiny,
      ...Helpers.mainCenter,
    },
    distanceTextUnSelected: {
      color: Colors.text,
      ...Fonts.large,
      marginTop: Metrics.small,
      marginBottom: Metrics.small,
      fontWeight: '700'
    },
    durationTextUnSelected: {
      color: Colors.text,
      ...Fonts.regular,
    },
    titleTextUnSelected: {
      // color: Colors.black,
      ...Fonts.regular,
    },
    buttonContainer: {
      ...Helpers.row,
      // borderWidth: 1,
      justifyContent: 'space-between'
    },
    buttonStart: {
      backgroundColor: Colors.blue_light,
      borderRadius: Metrics.large,
      marginTop: Metrics.small,
      ...Helpers.center,
      ...Helpers.row,
      marginLeft: Metrics.tiny,
      padding: Metrics.small,
      flex: 1,
    },
    buttonStartText: {
      color: Colors.white,
      marginLeft: Metrics.small,
      ...Fonts.regular,
    },
    buttonDetails: {
      backgroundColor: Colors.blue_light,
      height: Metrics.normal * 4,
      borderRadius: Metrics.large,
      marginTop: Metrics.small,
      ...Helpers.center,
      ...Helpers.row,
      paddingLeft: Metrics.regular,
      paddingRight: Metrics.regular,
      marginLeft: Metrics.regular,
      marginRight: Metrics.regular,
      flex: 1,
    },
  })
};

export default createHorizontalStyles;
