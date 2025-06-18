import { StyleSheet, Dimensions } from "react-native";
import { Colors as Themes, Fonts, Helpers, Images, Metrics } from "@app/theme";

const createHorizontalStyles = (isDarkTheme, screenWidth, screenHeight) => {
  const Colors = Themes[isDarkTheme ? 'darkMode' : 'lightMode'];
  return StyleSheet.create({
    container: {
      position: 'absolute',
      left: 0,
      bottom: 0,
      right: 0,
      zIndex: 100,
      paddingHorizontal: Metrics.small
    },
    styleMapContainer: {
      height: screenHeight * 2 / 3,
      backgroundColor: Colors.backgroundGhoshLight,
      paddingBottom: Metrics.normal,
      paddingTop: Metrics.small,
      // paddingLeft: Metrics.regular,
      // paddingRight: Metrics.regular,
      borderTopLeftRadius: Metrics.normal,
      borderTopRightRadius: Metrics.normal,
      // borderWidth: 1
    },
    styleMapContainerBackground: {
      // backgroundColor: Colors.blackOpacity,
      // opacity: 0.3,
    },
    backdrop: {
      position: "absolute",
      top: -Metrics.normal,
      left: -Metrics.small,
      bottom: 0,
      right: -Metrics.small,
      backgroundColor: 'rgba(0,0,0, 0.5)',
      elevation: Metrics.small,
      zIndex: 100,
    },
    styleMapTitle: {
      // backgroundColor: Colors.black,
      marginBottom: Metrics.small,
      marginRight: Metrics.small,
      color: Colors.text,
      ...Fonts.regular,
      fontWeight: '700',
    },
    styleMapOptions: {
      ...Helpers.fillRow,
    },
    spacerWidth: {
      width: Metrics.small
    },
    styleMapButton: {
      backgroundColor: Colors.blue_light,
      ...Helpers.center,
      height: Metrics.small * 5,
      marginTop: Metrics.small,
      color: Colors.white,
      borderRadius: Metrics.small * 5,
    },
    styleMapButtonText: {
      color: Colors.white,
      ...Fonts.regular,
    },
    option: {
      backgroundColor: Colors.background,
      width: screenWidth / 3,
      // flex: 1,
      marginBottom: Metrics.small,
      marginTop: Metrics.small,
      borderRadius: Metrics.normal,
      padding: Metrics.small,
    },
    optionTextUnSelected: {
      marginBottom: Metrics.small,
      color: Colors.text,
    },
    optionImage: {
      flex: 1,
      // overflow: 'hidden',
    },
    img: {
      // flex: 1,
      height: '100%',
      width: '100%',
      borderRadius: Metrics.normal,
    },
    optionSelected: {
      backgroundColor: Colors.background,
      width: screenWidth / 3,
      marginBottom: Metrics.small,
      marginTop: Metrics.small,
      borderRadius: Metrics.normal,
      padding: Metrics.small,
      borderWidth: 2,
      borderColor: Colors.blue_light,
    },
    optionTextSelected: {
      marginBottom: Metrics.small,
      color: Colors.blue_light,
      fontWeight: '600',
    },
    styleMapButtonContainer: {
      // backgroundColor: Colors.red,
      borderTopWidth: 0.5,
      borderTopColor: Colors.grayText,
    }
  })
};

export default createHorizontalStyles;
