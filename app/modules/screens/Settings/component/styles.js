import { StyleSheet, Dimensions, StatusBar } from "react-native";
import { Colors as Themes, Fonts, Helpers, Metrics } from "@app/theme";

const createStyles = (isDarkTheme) => {
  const Colors = Themes[isDarkTheme ? 'darkMode' : 'lightMode'];
  return StyleSheet.create({
    settingContainer: {
      height: '100%',
      elevation: Metrics.small,
      backgroundColor: Colors.white,
    },
    //header
    headerSetting: {
      // paddingTop: StatusBar.currentHeight,
      flexDirection: 'row',
      alignItems: 'center',
      elevation: Metrics.tiny,
      backgroundColor: Colors.background,
    },
    btnClose: {
      // borderWidth: 1,
      paddingVertical: Metrics.regular,
      paddingLeft: Metrics.medium,
      paddingRight: Metrics.regular,
    },
    icClose: {
      width: Metrics.regular,
      height: Metrics.regular,
      tintColor: Colors.text,
    },
    settingName: {
      color: Colors.text,
      ...Fonts.regular,
      ...Helpers.textBold,
      flex: 1,
    },
    btnDefault: {
      paddingVertical: Metrics.regular,
      paddingHorizontal: Metrics.medium,
    },
    btnDefaultText: {
      color: Colors.textGrey,
    },
    //-------

    //footer
    footerSetting: {
      // position: 'absolute',
      // bottom: 0,
      width: '100%',
      paddingTop: Metrics.icon,
      flexDirection: 'row',
      justifyContent: 'space-between',
      elevation: Metrics.small,
      backgroundColor: Colors.background,
    },
    distanceView: {
      width: Metrics.normal
    },
    btnAction: {
      flex: 1,
      backgroundColor: Colors.blueText,
      paddingVertical: Metrics.small,
      borderRadius: Metrics.medium,
      borderColor: Colors.blueText,
      borderWidth: 1,
      alignItems: 'center',
    },
    btnCancel: {
      backgroundColor: Colors.transparent,
    },
    btnSaveText: {
      color: Colors.white,
      ...Helpers.textBoldfive,
    },
    btnCancelText: {
      color: Colors.blueText,
      ...Helpers.textBoldfive,
    },
    //----------

    //
    settingContent: {
      paddingHorizontal: Metrics.medium,
    },

    //element
    settingContent: {
      paddingHorizontal: Metrics.medium,
    },
    settingElement: {
      // borderWidth: 1,
      paddingVertical: Metrics.regular,
    },
    // radio button
    titleElement: {
    },
    title: {
      color: Colors.text,
      ...Helpers.textBoldfive,
      ...Fonts.regular,
      marginRight: Metrics.small,
    },
    selectArea: {
      marginTop: Metrics.normal
    },
    radioOption: {
      flexDirection: 'row',
      alignItems: 'center'
    },
    cirleRadioButton: {
      height: Metrics.icon,
      width: Metrics.icon,
      borderWidth: 1,
      borderRadius: Metrics.icon / 2,
      marginRight: Metrics.normal,
      marginVertical: Metrics.tiny,
      justifyContent: 'center',
      alignItems: 'center'
    },
    cirleRadioButtonIn: {
      height: Metrics.icon / 2,
      width: Metrics.icon / 2,
      borderRadius: Metrics.icon / 4,
    },
    radioLabelText: {
      ...Fonts.medium
    },
    // -------------

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

    unitText: {
      color: Colors.textGrey
    },
    sliderArea: {
      paddingTop: Metrics.large,
      paddingBottom: Metrics.small,
      marginLeft: Metrics.medium,
    },
    sliderValue: {
      position: 'absolute',
      ...Fonts.large,
      top: Metrics.normal,
      width: Metrics.medium * 2,
      textAlign: 'center',
      color: Colors.textGrey
    },
    sliderValueCurrent: {
      color: Colors.slider,
      ...Helpers.textBoldfive,
    },
    line: {
      height: 1,
      backgroundColor: Colors.gray_line_route,
    },
    thumbSlider: {
      backgroundColor: Colors.slider,
      borderWidth: Metrics.tiny,
      borderColor: Colors.white,
    },
    track: {
      height: Metrics.normal / 2,
      width: Metrics.large * 9,
      borderRadius: Metrics.tiny,
    },
    flexFull: {
      flex: 1,
    },
    lableStyle: {
      color: Colors.text,
    },
    logSetting: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between'
    },
    borderSlider: {
      borderColor: Colors.slider,
    },
    borderWhite: {
      borderColor: Colors.white,
    },
  })
};

export default createStyles;