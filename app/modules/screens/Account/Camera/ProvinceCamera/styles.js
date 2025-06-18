import { StyleSheet, Dimensions, StatusBar } from "react-native";
const { width, height } = Dimensions.get("window");

import { Colors as Themes, Fonts, Helpers, Images, Metrics } from "@app/theme";

const createStyles = (isDarkTheme) => {
  const Colors = Themes[isDarkTheme ? 'darkMode' : 'lightMode'];
  return StyleSheet.create({
    iconstyle: {
      height: Metrics.medium,
      width: Metrics.medium,
      tintColor: Colors.text,
    },
    videoArea: {
      width: '100%',
      paddingVertical: Metrics.tiny,
    },
    video: {
      width: '100%',
      height: height / 4,
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
    },
    btnCreenShot: {
      padding: Metrics.small,
    },
    iconControlMedium: {
      width: Metrics.medium,
      height: Metrics.medium,
      tintColor: Colors.white,
    },
    //
    container: {
      flex: 1,
      backgroundColor: Colors.backgroundGrey,
    },
    content: {
      flex: 1,
      marginTop: Metrics.regular,
      paddingHorizontal: Metrics.small,
      marginTop: Metrics.regular,
    },
    cameraArea: {
      flex: 1,
      backgroundColor: Colors.background,
      // borderWidth: 1,
      borderRadius: Metrics.normal,
      overflow: 'hidden',
    },
    cameraAreaHeader: {
      padding: Metrics.normal,
    },
    navbarFooter: {
      width: '100%',
    },
    boxSearch: {
      width: '100%',
      borderWidth: 1,
      borderColor: Colors.border,
      borderRadius: Metrics.small,
      marginBottom: Metrics.normal,
      paddingHorizontal: Metrics.regular,
      // paddingVertical: Metrics.regular,
      height: Metrics.medium * 2,
      color: Colors.text
      // backgroundColor: Colors.red
    },
    dropdown: {
      borderRadius: Metrics.small,
      borderColor: Colors.border,
      borderWidth: 1,
      backgroundColor: Colors.transparent,
      paddingHorizontal: Metrics.regular,
      height: Metrics.medium * 2,
      // paddingVertical: Metrics.small,
    },
    dropdownContainer: {
      backgroundColor: Colors.backgroundGrey,
      marginTop: Metrics.tiny,
      borderRadius: Metrics.regular,
      overflow: 'hidden',
      borderColor: Colors.border,
    },
    itemStyle: {
      backgroundColor: Colors.backgroundGrey,
      paddingHorizontal: Metrics.regular,
      paddingVertical: Metrics.regular,
    },
    textPicker: {
      color: Colors.text,
      ...Fonts.medium,
    },
    placeholder: {
      color: Colors.inputPlaceholder
    },
    //
    cameraList: {
      flex: 1,
      backgroundColor: Colors.background,
    },
    emptyText: {
      textAlign: 'center',
      color: Colors.textGrey,
    },
    cameraItem: {
      width: '100%',
      paddingHorizontal: Metrics.regular,
      paddingVertical: Metrics.normal,
      borderTopWidth: 1,
      borderTopColor: Colors.border,
      flexDirection: 'row',
      alignItems: 'center',
    },
    cameraItemImage: {
      width: Metrics.large * 4,
      height: Metrics.medium * 3,
    },
    viewItemImage: {
      width: Metrics.large * 4,
      height: Metrics.medium * 3,
      marginRight: Metrics.small,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: Colors.backgroundGrey,
    },
    cameraItemRight: {
      flex: 1,
    },
    cameraItemInfo: {
      width: '100%',
      flexDirection: 'row',
      alignItems: 'center',
      marginVertical: Metrics.tiny,
    },
    cameraItemIcon: {
      width: Metrics.regular,
      height: Metrics.regular,
      marginRight: Metrics.small,
    },
    iconBlue: {
      tintColor: Colors.blueText,
    },
    cameraItemText: {
      ...Fonts.medium,
      color: Colors.text,
      flex: 1,
    },
    textBold: {
      ...Helpers.textBoldfive,
    }
  })
}

export default createStyles;