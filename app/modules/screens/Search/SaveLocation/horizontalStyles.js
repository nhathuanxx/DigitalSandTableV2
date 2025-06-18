import { StyleSheet, Dimensions } from "react-native";
// const { width, height } = Dimensions.get("window");
import { Colors as Themes, Fonts, Helpers, Images, Metrics } from "@app/theme";

const createHorizontalStyles = (isDarkTheme, screenWidth, screenHeight) => {
  const Colors = Themes[isDarkTheme ? 'darkMode' : 'lightMode'];
  return StyleSheet.create({


    horizontalBar: {
      width: Metrics.medium,
      height: 2,
      backgroundColor: Colors.white,
      ...Helpers.selfCenter,
      marginBottom: Metrics.tiny,
      shadowColor: Colors.gray,
      shadowOffset: { width: 0, height: 20 },
      shadowOpacity: 0.5,
      shadowRadius: 5,
      elevation: 5,
    },

    content: {
      ...Helpers.fullWidth,
      borderRadius: Metrics.normal,
      ...Helpers.positionAbso,
      bottom: 0,
      left: 0,
      right: 0,
      // backgroundColor: Colors.background
    },
    title: {
      fontSize: 17,
      ...Helpers.textBold,
      marginVertical: Metrics.normal,
      color: Colors.text,
    },
    optionList: {
      flexDirection: 'row',
      justifyContent: 'space-between'
    },
    optionContainer: {
      ...Helpers.fillRowBetween,
      paddingVertical: Metrics.normal,
    },
    optionLeft: {
      ...Helpers.rowCross
    },
    iconWay: {
      width: Metrics.regular,
      height: Metrics.regular
    },
    optionText: {
      ...Fonts.regular,
      marginLeft: Metrics.small,
      color: Colors.text
    },
    checkbox: {
      width: Metrics.icon,
      height: Metrics.icon,
    },
    completeButton: {
      padding: Metrics.normal,
      backgroundColor: Colors.blue_light,
      ...Helpers.crossCenter,
      borderRadius: Metrics.medium,

    },
    completeButtonText: {
      color: Colors.white,
      ...Fonts.regular,
      fontWeight: '500',
    },
    icons: {
      backgroundColor: Colors.beige,
      ...Helpers.center,
      padding: Metrics.small,
      borderRadius: Metrics.normal,

    },
    contentCheck: {
      backgroundColor: Colors.background,
      marginBottom: Metrics.normal,
      borderRadius: Metrics.normal,
      flex: 1,
      paddingHorizontal: Metrics.small
    },
    spacer: {
      width: Metrics.normal,
    },
    buttonBottom: {
      paddingVertical: Metrics.normal,
      backgroundColor: Colors.background,
      borderTopColor: Colors.border,
      borderTopWidth: 1,

    },
    contentContainer: {
      backgroundColor: Colors.backgroundGrey,
      borderTopLeftRadius: 12,
      borderTopRightRadius: 12,
    },
  })
};

export default createHorizontalStyles;
