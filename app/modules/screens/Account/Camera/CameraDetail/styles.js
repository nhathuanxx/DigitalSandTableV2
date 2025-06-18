import { StyleSheet, Dimensions, StatusBar } from "react-native";
import { Colors as Themes, Fonts, Helpers, Images, Metrics } from "@app/theme";

const createStyles = (isDarkTheme, width, height) => {
  const Colors = Themes[isDarkTheme ? 'darkMode' : 'lightMode'];
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: Colors.backgroundGrey
    },
    containerFullScreen: {
      paddingVertical: StatusBar.currentHeight,
      alignItems: 'center',
    },
    content: {
      backgroundColor: Colors.backgroundGrey,
      flex: 1,
    },
    viewMap: {
      height: height / 2,
    },
    iconstyle: {
      height: Metrics.medium,
      width: Metrics.medium,
      tintColor: Colors.text,
    },
    videoArea: {
      width: '100%',
      backgroundColor: Colors.black_hue,
      minHeight: height / 4,
      justifyContent: 'center',
    },
    videoFullScreen: {
      height: '100%',
      aspectRatio: 16 / 9,
      backgroundColor: Colors.black_hue,
      justifyContent: 'center',
    },
    video: {
      width: '100%',
      aspectRatio: 16 / 9
    },
    viewLoad: {
      position: 'absolute',
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      justifyContent: "center",
      alignItems: 'center'
    },
    textError: {
      color: Colors.white,
    },
    viewCameraImage: {
      width: '100%',
      aspectRatio: 16 / 9,
      justifyContent: 'center',
      alignItems: 'center',
    },
    counter: {
      position: 'absolute',
      bottom: Metrics.small,
      right: Metrics.small,
    },
    countText: {
      ...Fonts.medium,
      ...Helpers.textBoldfive,
      color: Colors.white,
    },
    btnCloseVideo: {
      position: 'absolute',
      top: Metrics.tiny,
      left: 0,
      // borderWidth: 2,
      padding: Metrics.small,
    },
    viewControlRight: {
      position: 'absolute',
      top: Metrics.tiny,
      right: 0,
      zIndex: 4,
      // borderWidth: 1
    },
    btnCreenShot: {
      padding: Metrics.normal,
    },
    iconControlMedium: {
      width: Metrics.medium,
      height: Metrics.medium,
      tintColor: Colors.white,
    },
    titleArea: {
      paddingVertical: Metrics.small,
      paddingHorizontal: Metrics.normal,
    },
    titleView: {
      // borderWidth: 1,
      marginVertical: Metrics.small,
      backgroundColor: Colors.background,
      padding: Metrics.normal,
      borderRadius: Metrics.normal,
      elevation: Metrics.tiny,
    },
    titleText: {
      color: Colors.text,
    },
    textBold: {
      ...Helpers.textBoldfive
    },
    notFoundText: {
      fontStyle: 'italic',
      color: Colors.textGrey,
      ...Fonts.small,
    },
    alertCapture: {
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: Metrics.medium,
      justifyContent: 'center',
      alignItems: 'center'
    },
    alertCaptureText: {
      backgroundColor: Colors.backgroundGrey,
      paddingHorizontal: Metrics.normal,
      paddingVertical: Metrics.tiny,
      textAlign: 'center',
      width: width * 3 / 4,
      color: Colors.text,
      borderRadius: Metrics.small,
      elevation: Metrics.tiny,
    }
  })
}

export default createStyles;