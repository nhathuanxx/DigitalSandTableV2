import { StyleSheet } from "react-native";
import { Colors, Helpers, Metrics } from "@app/theme";

export default StyleSheet.create({
  itemContainer: {
    ...Helpers.fillCol,
    borderWidth: 1,
    borderRadius: Metrics.small,
    borderColor: Colors.light_gray,
    justifyContent: "space-around",
  },
  itemFirstRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  itemSecondRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
  },
  txtBold: {
    fontWeight: "bold",
    fontSize: 16,
  },
  txtGray: {
    color: Colors.txtGray,
    marginTop: 8,
  },
  txtBlack: {
    color: Colors.black,
    marginTop: 8,
  },
  txtNormal: {
    marginTop: 14,
    color: "black",
  },
  txtMainText: {
    fontWeight: "bold",
    fontSize: 16,
    flex: 1,
    marginRight: 16,
    color: "#16379E",
  },
  txtWithIcon: {
    color: "#454B52",
    fontSize: 14,
  },
  icon: {
    width: 14,
    height: undefined,
    aspectRatio: 1,
  },
  IconTextContainer: {
    justifyContent: "flex-start",
    flexDirection: "row",
    alignItems: "center",
  },
  colorCode: {
    color: "#959498",
  },
  itemBlock: {
    flex: 1,
    flexDirection: "column",
    marginHorizontal: Metrics.regular,
    marginVertical: Metrics.regular / 2,
    borderWidth: 1,
    borderRadius: 6,
    borderColor: "#E7E8EA",
    paddingLeft: 21,
    paddingRight: 12,
    height: 83,
    justifyContent: "space-around",
  },
});
