import { StyleSheet, Dimensions } from "react-native";
const { width, height } = Dimensions.get("window");
import { Colors as Themes, Fonts, Helpers, Images, Metrics } from "@app/theme";

const createStyles = (isDarkTheme) => {
  const Colors = Themes[isDarkTheme ? 'darkMode' : 'lightMode'];
  return StyleSheet.create({
    myLocationContainer: {
      width: Metrics.medium,
      height: Metrics.medium,
      backgroundColor: Colors.blue_light,
      borderRadius: Metrics.medium,
      borderWidth: Metrics.tiny,
      borderColor: Colors.white,
    },
    myLocation: {
      width: Metrics.medium * 3,
      height: Metrics.medium * 3,
      backgroundColor: 'rgba(0, 121, 249, 0.2)',
      // opacity: 0.5,
      ...Helpers.center,
      borderRadius: Metrics.medium * 3,
    },
    stepContainer: {
      width: Metrics.tiny,
      height: Metrics.tiny,
      backgroundColor: Colors.white,
      borderRadius: Metrics.tiny,
      borderWidth: 1,
      // borderColor: Colors.white,
    },
    startContainer: {
      width: Metrics.regular,
      height: Metrics.regular,
      backgroundColor: Colors.white,
      borderRadius: Metrics.regular,
      borderWidth: Metrics.tiny,
      borderColor: Colors.black,
    },
    locationToContainer: {
      width: Metrics.tiny * 5,
      height: Metrics.tiny * 5,
      backgroundColor: Colors.white,
      borderRadius: Metrics.regular,
      borderWidth: 1,
      borderColor: Colors.black,
      justifyContent: 'center', // căn giữa theo trục dọc
      alignItems: 'center',     // căn giữa theo trục ngang
    },
    text: {
      color: Colors.black,
      fontSize: Metrics.normal,
      fontWeight: '600',
    },
  })
};
export default createStyles;
