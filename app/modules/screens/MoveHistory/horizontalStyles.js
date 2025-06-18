import { StyleSheet, Dimensions } from "react-native";
// const { width, height } = Dimensions.get("window");
import { Colors as Themes, Fonts, Helpers, Images, Metrics } from "@app/theme";

const createHorizontalStyles = (isDarkTheme, width, height) => {
  const Colors = Themes[isDarkTheme ? 'darkMode' : 'lightMode'];
  return StyleSheet.create({

    container: {
      ...Helpers.fillCol,
    },
    content: {
      position: 'absolute',
      top: 0,
      right: 0,
      left: 0,
      bottom: 0,
      flexDirection: 'row',
      justifyContent: 'space-between'
    },
    contentLeft: {
      width: width * 0.45,
      // backgroundColor: Colors.backgroundGrey
      // alignItems: 'flex-end'
    },
    contentRight: {
      flex: 1,
      alignItems: 'flex-end'
    },
    topBack: {
      ...Helpers.rowCross,
      paddingHorizontal: Metrics.regular,
      paddingVertical: Metrics.small,
      borderBottomWidth: 1,
      borderBottomColor: Colors.border,

    },
    topTextMove: {
      fontSize: 17,
      fontWeight: '600',
      color: Colors.text,
      marginLeft: Metrics.regular,

    },
    icArrowBack: {
      width: Metrics.regular,
      height: Metrics.regular,
      tintColor: Colors.text
    },
    containerDay: {
      ...Helpers.fillRowBetween,
      paddingLeft: Metrics.tiny,
      paddingVertical: Metrics.tiny,
    },
    dateView: {
      backgroundColor: Colors.background,
      zIndex: 2,
      width: '100%'
    },
    bottom: {
      backgroundColor: Colors.background,
      borderTopLeftRadius: Metrics.normal,
      borderTopRightRadius: Metrics.normal,
      flex: 1,
      marginTop: Metrics.tiny
    },
    bottomContainer: {
      paddingHorizontal: Metrics.regular,
      paddingVertical: Metrics.normal,
      borderBottomWidth: 1,
      borderBottomColor: Colors.border,
    },
    bottomText: {
      fontSize: 17,
      color: Colors.blue_light,
      fontWeight: '500'
    },
    dateContainer: {
      ...Helpers.row,
      ...Helpers.fill,
      ...Helpers.mainSpaceBetween,
      paddingVertical: Metrics.tiny,
      paddingHorizontal: Metrics.tiny,
      // borderColor: 'red',
      // borderWidth: 1,
    },
    iconDatePicker: {
      paddingHorizontal: Metrics.small,
      width: Metrics.large
    },
    selectedDate: {
      backgroundColor: '#09c6f9',
    },
    selectedText: {
      color: Colors.white
    },
    dateColumn: {
      ...Helpers.crossCenter,
      paddingTop: Metrics.tiny,
      paddingBottom: Metrics.tiny,
      paddingLeft: Metrics.normal,
      paddingRight: Metrics.normal,
      borderRadius: Metrics.small,
    },
    separator: {
      height: '90%',
      width: 1,
      backgroundColor: Colors.border,
    },
    dayText: {
      fontSize: 13,
      fontWeight: '400',
      color: Colors.textGrey
    },
    dateText: {
      fontSize: 14,
      ...Helpers.textBold,
      color: Colors.text
      // marginTop: 4
    },
    calendar: {
      width: Metrics.medium,
      height: Metrics.medium,
      tintColor: Colors.text
    },
    bottomDistance: {
      ...Helpers.rowCross,
    },
    dash: {
      marginHorizontal: Metrics.normal,
      fontSize: 15,
      color: Colors.textGrey
    },
    textDistance: {
      fontSize: 15,
      color: Colors.textGrey
    },
    // ------------------------------------------------------------------------
    notDataContainer: {
      flex: 1,
      marginTop: Metrics.tiny,
      borderTopLeftRadius: Metrics.normal,
      borderTopRightRadius: Metrics.normal,
      ...Helpers.center,
      backgroundColor: Colors.background,
      zIndex: 1,
    },
    notDataBot: {
      ...Helpers.fill,
      ...Helpers.rowCenter,
      ...Helpers.textCenter,
    },
    textNotData: {
      ...Helpers.textCenter,
      fontSize: 15,
      marginLeft: Metrics.tiny,
      color: Colors.write_bright
    },
    containerDayWithBorder: {
      borderBottomWidth: 1,
      borderBottomColor: Colors.border,
    },

    imageIcon: {
      width: Metrics.icon,
      height: Metrics.icon,
      tintColor: Colors.text,
    },
    // -----------------------------------------------------------------------------------------------
    iconRegular: {
      width: Metrics.regular,
      height: Metrics.regular,
      tintColor: Colors.text

    },
    viewContentIconTop: {
      backgroundColor: Colors.background,
      borderRadius: Metrics.normal,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 2,
      elevation: 4,
      maxWidth: Metrics.medium * 2,
    },
    underline: {
      borderBottomWidth: 1,
      borderBottomColor: Colors.border,
    },
    iconPadding: {
      justifyContent: 'center',
      padding: Metrics.normal,
    },
    // -------------------------------------------------------------------------------------------------
    containerRowBottom: {
      paddingHorizontal: Metrics.normal,
    },

    rowImagesTop: {
      ...Helpers.positionAbso,
      bottom: -10,
      left: 0,
      ...Helpers.column,
    },
    rowImagesBot: {
      ...Helpers.positionAbso,
      bottom: 22,
      left: 0,
      ...Helpers.column,
    },
    iconStyleBottom: {
      width: Metrics.regular,
      height: Metrics.regular,
      marginTop: 2
    },
    iconStyleTop: {
      width: Metrics.regular,
      height: Metrics.regular,
      marginTop: 2
    },
    iconStyleBottomDotsTop: {
      width: 2,
      height: 26,
      marginLeft: 7,
      marginTop: 5
    },
    iconStyleBottomDotsBot: {
      width: 2,
      height: 26,
      marginLeft: 7,
      marginBottom: 2
    },
    rowTextTop: {
      marginLeft: Metrics.large,
      paddingRight: Metrics.medium,
      paddingVertical: Metrics.small,
    },
    rowTextBot: {
      marginLeft: Metrics.large,
      paddingVertical: Metrics.small,
      paddingRight: Metrics.medium,
    },
    textTitle: {
      fontSize: 17,
      fontWeight: '600',
      color: Colors.text,
    },
    textContent: {
      fontSize: 15,
      color: Colors.textGrey
    }


  })
};

export default createHorizontalStyles;
