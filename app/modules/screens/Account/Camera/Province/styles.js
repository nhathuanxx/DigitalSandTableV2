import { StyleSheet, Dimensions, StatusBar } from "react-native";
const { width, height } = Dimensions.get("window");
import { Colors as Themes, Fonts, Helpers, Images, Metrics } from "@app/theme";

const createStyles = (isDarkTheme) => {
  const Colors = Themes[isDarkTheme ? 'darkMode' : 'lightMode'];
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: Colors.backgroundGrey
    },
    content: {
      marginTop: Metrics.regular,
      backgroundColor: Colors.backgroundGrey,
      paddingHorizontal: Metrics.small,
      marginTop: Metrics.regular,
      flex: 1,
    },
    provinceList: {
      backgroundColor: Colors.backgroundGrey,
      flex: 1,
    },
    footerScroll: {
      height: Metrics.large
    },
    provinceItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: Metrics.regular,
      paddingVertical: Metrics.normal,
      borderRadius: Metrics.normal,
      // elevation: 2,
      borderWidth: 1,
      borderColor: Colors.border,
      backgroundColor: Colors.background,
      marginBottom: Metrics.small,
    },
    provinceText: {
      color: Colors.text,
      ...Helpers.textBold,
      ...Fonts.regular,
    },
    iconVideo: {
      height: Metrics.medium,
      width: Metrics.medium,
      tintColor: Colors.blueText,
      marginRight: Metrics.regular,
    },
  })
}

export default createStyles;