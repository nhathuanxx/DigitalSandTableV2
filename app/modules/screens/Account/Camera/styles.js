import { StyleSheet, Dimensions, StatusBar } from "react-native";
const { width, height } = Dimensions.get("window");
import { Colors as Themes, Fonts, Helpers, Images, Metrics } from "@app/theme";

const createStyles = (isDarkTheme) => {
  const Colors = Themes[isDarkTheme ? 'darkMode' : 'lightMode'];
  return StyleSheet.create({
    header: {
      backgroundColor: Colors.background,
      flexDirection: 'row',
      alignItems: 'center',
    },
    btnBack: {
      paddingLeft: Metrics.icon,
      paddingVertical: Metrics.regular,
      paddingRight: Metrics.normal
    },
    headerText: {
      ...Helpers.textBold,
      color: Colors.text,
      ...Fonts.large
    },
    iconstyle: {
      height: Metrics.medium,
      width: Metrics.medium,
      tintColor: Colors.text,
    },
    iconDefaulImage: {
      height: Metrics.large,
      width: Metrics.large,
      tintColor: Colors.textGrey,
    },
  });
}
export default createStyles;