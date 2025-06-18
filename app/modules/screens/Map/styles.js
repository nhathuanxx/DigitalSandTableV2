import { StyleSheet, Dimensions } from "react-native";
const { width, height } = Dimensions.get("window");
import { Colors, Fonts, Helpers, Images, Metrics } from "@app/theme";

const styles = StyleSheet.create({
  iconCameraLocation: {
    width: Metrics.medium * 2,
    height: Metrics.medium * 2,
  },
  iconNavigation: {
    width: Metrics.medium * 3,
    height: Metrics.medium * 3,
  },
});
export default styles;
