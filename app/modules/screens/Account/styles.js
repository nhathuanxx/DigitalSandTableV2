import { StyleSheet, Dimensions, StatusBar } from "react-native";
const { width, height } = Dimensions.get("window");
import { Colors as Themes, Fonts, Helpers, Images, Metrics } from "@app/theme";

const createStyles = (isDarkTheme) => {
  const Colors = Themes[isDarkTheme ? 'darkMode' : 'lightMode'];
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: Colors.backgroundGrey,
    },
    headerAccount: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    btnBack: {
      paddingLeft: Metrics.icon,
      paddingVertical: Metrics.icon,
      paddingRight: Metrics.normal,
    },
    headerText: {
      color: Colors.white,
      ...Fonts.large,
    },
    btnTaskBgr: {
      padding: Metrics.normal,
      borderWidth: 1,
      borderColor: Colors.slider,
      marginHorizontal: Metrics.regular,
      borderRadius: Metrics.normal,
    },
    content: {
      flex: 1,
      flexDirection: 'column',
      marginVertical: Metrics.regular,
      // backgroundColor: Colors.bgr_account,
      justifyContent: 'center'
    },
    iconStyle: {
      height: Metrics.medium,
      width: Metrics.medium,
    },
    myVehicleArea: {
      flex: 1,
      borderRadius: Metrics.regular,
      overflow: 'hidden',

    },
    line: {
      height: 1,
      backgroundColor: Colors.border,
    },
    myVehicleHeader: {
      paddingHorizontal: Metrics.regular,
      height: Metrics.medium * 2,
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: Colors.background,
    },
    iconCar: {
      marginTop: Metrics.tiny / 2,
      marginRight: Metrics.normal,
    },
    myVehicleText: {
      flex: 1,
      color: Colors.text,
      ...Fonts.regular,
    },
    btnAdd: {
      paddingVertical: Metrics.small,
    },
    btnAddText: {
      color: Colors.blueText,
      ...Fonts.regular,
    },
    listEmpty: {
      paddingVertical: Metrics.large,
      alignItems: 'center',
      backgroundColor: Colors.background,
      borderBottomRightRadius: Metrics.regular,
      borderBottomLeftRadius: Metrics.regular,
    },
    emptyText: {
      color: Colors.textGrey,
    },
    vehicleList: {
      // flex: 1,
      backgroundColor: Colors.background,
    },
    vehicleListContent: {
      flex: 1,
      paddingBottom: Metrics.large * 2
    },
    //
    menuBox: {
      position: 'absolute',
      right: Metrics.tiny / 2,
      flexDirection: 'column',
      zIndex: 100,
      borderRadius: Metrics.small,
      backgroundColor: Colors.backgroundGrey,
      paddingVertical: Metrics.tiny,
      elevation: Metrics.tiny,
    },
    menuItemBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: Metrics.small,
      paddingRight: Metrics.normal,
      paddingLeft: Metrics.regular,
      marginRight: -Metrics.tiny / 2,
      justifyContent: 'space-between',
    },
    iconBlue: {
      tintColor: Colors.blueText,
    },
    menuItemBtnText: {
      color: Colors.text,
      marginRight: Metrics.regular,
      ...Fonts.regular,
    },
    //
    footerList: {
      // height: Metrics.large * 4,
    },
    errorAlertText: {
      color: Colors.red,
      ...Helpers.textBoldfive
    },
    navbar: {
      flexDirection: 'row',
      paddingVertical: Metrics.normal,
      paddingHorizontal: Metrics.regular,
      justifyContent: 'space-between',
      marginBottom: Metrics.regular,
      backgroundColor: Colors.background,
      borderRadius: Metrics.regular,
      width: '100%'


    },
    btnNavbarItem: {
      alignItems: 'center'
    },
    navbarViewIcon: {
      backgroundColor: Colors.created,
      padding: Metrics.small,
      borderRadius: Metrics.regular,
    },
    navbarIcon: {
      height: Metrics.medium,
      width: Metrics.medium,
      tintColor: Colors.white
    },
    navbarItemText: {
      ...Fonts.small,
      color: Colors.text,
      marginTop: Metrics.tiny,
    },

  })
};

export default createStyles;
