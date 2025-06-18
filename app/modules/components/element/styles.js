import { StyleSheet, Dimensions } from "react-native";
import { Colors as Themes, Fonts, Helpers, Images, Metrics } from "@app/theme";

const createStyles = (isDarkTheme, width, height) => {
  const Colors = Themes[isDarkTheme ? 'darkMode' : 'lightMode'];
  return StyleSheet.create({
    dropdownElement: {
      height: Metrics.medium * 2,
      zIndex: 2,
    },
    seclectedView: {
      borderWidth: 1,
      borderRadius: Metrics.small,
      borderColor: Colors.border,
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    selectionText: {
      flex: 1,
      marginLeft: Metrics.regular
    },
    rightBtn: {
      height: '100%',
      justifyContent: 'center',
      paddingHorizontal: Metrics.regular,
    },
    iconRightSelection: {
      width: Metrics.icon,
      height: Metrics.icon,
      tintColor: Colors.text
    },
    optionView: {
      // position: 'absolute',
      // top: '100%',
      // right: 0,
      // left: 0,
      // height: 100,
      borderWidth: 1,
      borderColor: Colors.border,
      backgroundColor: Colors.background,
      borderRadius: Metrics.small,
      zIndex: 4,
      elevation: Metrics.tiny
    },
    modalOverlay: {
      flex: 1,
      justifyContent: 'flex-start',
      alignItems: 'flex-start',
      backgroundColor: 'transparent',
    },
    optionList: {
      borderWidth: 1,
      borderColor: Colors.border,
      backgroundColor: Colors.backgroundGrey,
      borderRadius: Metrics.small,
      height: height * 0.3
    },
    optionBtn: {
      paddingHorizontal: Metrics.regular,
      paddingVertical: Metrics.small,
    },
    optionLabel: {
      color: Colors.text
    },
    // marqueetext
    marqueeText: {
      color: Colors.text
    },
    //------------
    // smoothSliderElement
    smoothSliderElement: {
      flex: 1,
      paddingVertical: Metrics.regular
    },
    textTitleElement: {
      color: Colors.text,
      ...Helpers.textBoldfive,
      ...Fonts.regular,
      marginRight: Metrics.small,
    },
    smoothSliderContainer: {
      flex: 1,
      paddingHorizontal: Metrics.medium,
      paddingTop: Metrics.medium * 2
    },
    trackContainer: {
      borderRadius: Metrics.normal,
      backgroundColor: Colors.silver_gray
    },
    filledTrack: {
      borderRadius: Metrics.normal,
      backgroundColor: Colors.blueText,
      flex: 1,
      height: Metrics.normal / 2,
    },
    thumbView: {
      position: 'absolute',
      flexDirection: 'column',
      alignItems: 'center',
      // borderWidth: 1,
    },
    thumb: {
      borderWidth: 1,
      borderColor: Colors.blueText,
      backgroundColor: Colors.white,
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: Metrics.small
    },
    thumbInner: {
      backgroundColor: Colors.blueText
    },
    sliderValueText: {
      color: Colors.text,
      ...Fonts.medium,
    },
    limit: {
      marginTop: Metrics.normal,
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    limitText: {
      ...Fonts.medium,
      color: Colors.text,
      width: Metrics.medium * 2,
      textAlign: 'center'
    },
    //---------
    //switch
    switchContainer: {
      borderRadius: Metrics.normal,
      borderWidth: 1,
      justifyContent: 'center'
    },
    innerCirle: {
      width: Metrics.regular,
      height: Metrics.regular,
      borderRadius: Metrics.small
    },
    // ----
  })
};

export default createStyles;
