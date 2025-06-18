import { StyleSheet, Dimensions } from "react-native";
import { Metrics } from "@app/theme";

const styles = StyleSheet.create({
  hidden: {
    position: 'absolute',
    height: 0,
    width: 0
  },
  loading: {
    position: 'absolute',
    top: -Metrics.regular,
    left: -Metrics.regular,
    right: -Metrics.regular,
    bottom: -Metrics.regular,
    elevation: Metrics.regular,
    backgroundColor: 'rgba(0,0,0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 100,
  }
})

export default styles;