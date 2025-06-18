import { StyleSheet, Dimensions, StatusBar } from "react-native";
const { width, height } = Dimensions.get("window");
import { Colors as Themes, Fonts, Helpers, Images, Metrics } from "@app/theme";

const createStyles = (isDarkTheme) => {
  const Colors = Themes[isDarkTheme ? 'darkMode' : 'lightMode'];
  return StyleSheet.create({
    line: {
      height: 1,
      backgroundColor: Colors.border,
    },
    vehicleItem: {
      flexDirection: "row",
      paddingHorizontal: Metrics.regular,
      paddingVertical: Metrics.small,
      alignItems: 'center',
      // borderWidth: 1,
    },
    iconVehicle: {
      // borderWidth: 1,
      backgroundColor: Colors.light_blue,
      padding: Metrics.small,
      borderRadius: Metrics.medium,
      marginRight: Metrics.small,
    },
    vehicleInfo: {
      flex: 1,
      // borderWidth: 1,
    },
    vehicleName: {
      color: Colors.text,
      ...Fonts.regular,
    },
    btnDetail: {
      // borderWidth: 1,
      marginRight: -Metrics.small,
      paddingVertical: Metrics.small,
      paddingLeft: Metrics.small,
    },
    footerItem: {
      marginHorizontal: Metrics.regular,
      marginBottom: Metrics.regular,
      borderWidth: 1,
      borderColor: Colors.border,
      borderRadius: Metrics.small,
      flexDirection: 'row',
      padding: Metrics.small,
      alignItems: 'center',
    },
    violationText: {
      flex: 1,
      ...Fonts.small,
      textAlign: 'center',
      ...Helpers.textBoldfive,
    },
    textGrey: {
      color: Colors.textGrey,
    },
    textBlue: {
      color: Colors.blueText,
    },
    textRed: {
      color: Colors.red,
    },
    btnLookup: {
      padding: Metrics.small,
      borderRadius: Metrics.medium,
      backgroundColor: Colors.backgroundGrey,
      // elevation: Metrics.tiny,
    },
    iconColor: {
      tintColor: Colors.text,
    },
    lineVertical: {
      height: '100%',
      width: 1,
      backgroundColor: Colors.border
    },
    //
    addVehiclecontainer: {
      position: 'absolute',
      bottom: 0,
      right: 0,
      left: 0,
      // top: StatusBar.currentHeight,
      backgroundColor: Colors.background,
      borderTopLeftRadius: Metrics.medium,
      borderTopRightRadius: Metrics.medium,
      // borderWidth: 1,
      overflow: 'hidden',
      elevation: Metrics.small,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      // padding: Metrics.regular,
    },
    iconMedium: {
      height: Metrics.medium,
      width: Metrics.medium,
    },
    iconLarge: {
      height: Metrics.large,
      width: Metrics.large,
    },
    iconRegular: {
      height: Metrics.regular,
      width: Metrics.regular,
    },
    btnClose: {
      padding: Metrics.normal,
    },
    headerText: {
      paddingLeft: Metrics.regular,
      flex: 1,
      color: Colors.text,
      ...Helpers.textBoldfive,
      ...Fonts.large,
    },
    content: {
      paddingBottom: Metrics.regular,
      flex: 1
    },
    inputBox: {
      // borderWidth: 1,
      marginTop: Metrics.regular,
    },
    lable: {
      flexDirection: 'row',
    },
    lableText: {
      color: Colors.inputLable,
      ...Fonts.regular,
      marginBottom: Metrics.small,
    },
    required: {
      color: Colors.red,
      marginLeft: Metrics.tiny
    },
    textInput: {
      borderWidth: 1,
      borderColor: Colors.border,
      borderRadius: Metrics.small,
      paddingHorizontal: Metrics.regular,
      ...Fonts.medium,
      color: Colors.text,
      // paddingVertical: Metrics.normal,
      height: Metrics.medium * 2,
    },
    picker: {
      // borderWidth: 1,
      // overflow: 'hidden',
      // padding: 0,
    },
    dropdown: {
      borderRadius: Metrics.small,
      borderColor: Colors.border,
      borderWidth: 1,
      backgroundColor: Colors.transparent,
      paddingHorizontal: Metrics.regular,
      // paddingVertical: Metrics.small,
      height: Metrics.medium * 2,
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
    switchBox: {
      // borderWidth: 1,
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: Metrics.regular,
    },
    switchLable: {
      ...Fonts.regular,
      color: Colors.text,
      flex: 1,
    },
    switch: {
      // borderWidth: 1,
      // borderColor: Colors.border,
      // paddingHorizontal: 1,
      // borderRadius: 12,
      // overflow: 'hidden'
    },
    borderSlider: {
      borderColor: Colors.blueText
    },
    borderWhite: {
      borderColor: Colors.background,
    },
    errorText: {
      color: Colors.red,
    },
    footer: {
      // borderWidth: 1,
      // position: 'absolute',
      // bottom: 0,
      paddingTop: Metrics.normal,
      width: '100%',
      flexDirection: 'row',
      borderTopWidth: 1,
      borderTopColor: Colors.border,
      backgroundColor: Colors.background,
    },
    distanceView: {
      width: Metrics.small
    },
    btnAction: {
      flex: 1,
      backgroundColor: Colors.blueText,
      paddingVertical: Metrics.normal,
      borderRadius: Metrics.medium,
      borderColor: Colors.blueText,
      borderWidth: 1,
      alignItems: 'center'
    },
    btnCancel: {
      backgroundColor: Colors.transparent,
      borderColor: Colors.blueText,
    },
    btnSaveText: {
      color: Colors.white,
      ...Helpers.textBoldfive,
    },
    btnCancelText: {
      color: Colors.blueText,
      ...Helpers.textBoldfive,
    },


  })
};

export default createStyles;