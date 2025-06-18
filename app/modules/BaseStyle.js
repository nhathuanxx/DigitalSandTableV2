import { Dimensions, StyleSheet, Platform } from "react-native";
import { Helpers, Metrics, Fonts, Colors } from "@app/theme";

const { width, height } = Dimensions.get("window");

export default StyleSheet.create({
  container: {
    ...Helpers.fill,
    backgroundColor: Colors.gray_bg,
  },
  thumbnail: {
    ...Metrics.smallVerticalPadding,
    ...Metrics.smallHorizontalPadding,
    ...Helpers.fillRow,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#ccc",
    overflow: "hidden",
  },
  textContainer: {
    ...Metrics.regularVerticalPadding,
    ...Metrics.regularHorizontalPadding,
    ...Helpers.fillRowCenter,
  },
  loading: {
    ...Helpers.center,
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  loadingView: {
    height: Metrics.large,
    ...Helpers.center,
    backgroundColor: Colors.white,
  },
  loadingViewFooter: {
    height: Metrics.large,
    ...Helpers.rowCenter,
    backgroundColor: Colors.white,
  },
  listContent: {
    marginTop: Metrics.small,
  },
  containerItem: {
    ...Helpers.fill,
    backgroundColor: Colors.white,
    flexDirection: "row",
  },
  profileImageContainer: {
    ...Helpers.fill,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    paddingTop: Metrics.regular,
  },
  profileImage: {
    height: 100,
    width: 100,
    borderRadius: 50,
  },
  shimmerImage: {
    height: 48,
    width: 48,
    borderRadius: 24,
  },
  toolbar: {
    ...Helpers.rowCross,
    ...Helpers.mainSpaceBetween,
    ...Metrics.regularHorizontalPadding,
    ...Metrics.regularVerticalPadding,
    backgroundColor: Colors.primary,
  },
  toolbarTitle: {
    ...Helpers.textBold,
    ...Fonts.large,
    color: Colors.white,
  },
  btnAdd: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
  },
  searchBarContainer: {
    // ...Helpers.rowCenter,
    backgroundColor: Colors.primary,
  },
  searchBar: {
    // ...Helpers.crossStretch,
    // ...Helpers.fill,
    // backgroundColor: Colors.yellow,
    // borderTopWidth: 0,
    // borderBottomWidth: 0,
  },
  searchBarInput: {
    backgroundColor: Colors.gray_bg,
    marginHorizontal: 8,
    borderRadius: Metrics.normal,
    fontStyle: "italic",
  },

  contactContainer: {
    backgroundColor: Colors.white,
    padding: Metrics.medium,
    ...Helpers.rowCross,
  },
  infoContainer: {
    backgroundColor: Colors.gray_bg,
    ...Helpers.fill,
  },
  title: {
    color: Colors.grayText,
    ...Fonts.medium,
  },
  infoContent: {
    ...Fonts.large,
  },
  optionContainer: {
    ...Helpers.rowCross,
    ...Helpers.mainSpaceBetween,
    ...Metrics.mediumHorizontalPadding,
    backgroundColor: Colors.white,
  },
  tabContainer: {
    backgroundColor: Colors.gray_bg,
  },
  rowBack: {
    backgroundColor: Colors.white,
    ...Helpers.fillRowCross,
    ...Helpers.mainSpaceBetween,
    paddingLeft: Metrics.regular,
  },
  backRightBtn: {
    alignItems: "center",
    bottom: 0,
    justifyContent: "center",
    position: "absolute",
    top: 0,
    width: 75,
    borderLeftColor: Colors.gray_bg,
    borderBottomWidth: 2,
    borderBottomColor: Colors.gray_bg,
  },
  btnDelete: {
    backgroundColor: Colors.gray,
    right: 50,
  },
  btnEdit: {
    backgroundColor: Colors.gray,
    right: 0,
  },
  swipeIcon: {
    height: 25,
    width: 25,
  },
  btnFilterContainer: {
    alignItems: "flex-start",
    flexDirection: "row",
    justifyContent: "center",
    backgroundColor: Colors.primary,
    padding: Metrics.small,
  },
  filterPanel: {
    ...Helpers.fill,
    backgroundColor: Colors.white,
    borderColor: Colors.gray_bg,
    borderTopLeftRadius: Metrics.medium,
    borderTopRightRadius: Metrics.medium,
  },
  filterHeader: {
    backgroundColor: Colors.white,
    shadowColor: Colors.black,
    paddingTop: Metrics.medium,
    borderTopLeftRadius: Metrics.medium,
    borderTopRightRadius: Metrics.medium,
  },
  filterPanelHeader: {
    alignItems: "center",
  },
  filterPanelHandle: {
    width: Metrics.large,
    height: Metrics.small,
    borderRadius: Metrics.tiny,
    backgroundColor: Colors.white,
    marginBottom: Metrics.small,
  },
  filterPanelTitle: {
    ...Fonts.normal,
    ...Helpers.smallVerticalPadding,
    ...Helpers.textCenter,
    color: Colors.white,
    fontWeight: "bold",
  },
  filterPanelSubtitle: {
    ...Fonts.medium,
    color: Colors.red,
    height: Metrics.medium,
    marginBottom: Metrics.medium,
  },
  filterPanelCancelButton: {
    ...Helpers.fill,
    padding: Metrics.small,
    borderRadius: Metrics.small,
    backgroundColor: Colors.white,
    borderColor: Colors.primary,
    borderWidth: 1,
    marginVertical: Metrics.small,
    marginHorizontal: Metrics.small,
  },
  filterPanelAcceptButton: {
    ...Helpers.fill,
    backgroundColor: Colors.primary,

    padding: Metrics.small,
    borderRadius: Metrics.small,
    marginVertical: Metrics.small,
    marginHorizontal: Metrics.small,
  },
  filterPanelCancelButtonTitle: {
    ...Fonts.normal,
    color: Colors.primary,
    ...Helpers.textCenter,
  },
  filterPanelAcceptButtonTitle: {
    ...Fonts.large,
    color: Colors.white,
    ...Helpers.textCenter,
  },
  filterWrapButton: {
    ...Helpers.rowCenter,
    marginBottom: Platform.OS === "android" ? 24 : 0,
  },
  headerContainer: {
    backgroundColor: Colors.white,
  },
  generalInfoContainer: {
    ...Helpers.center,
    // ...Metrics.regularVerticalPadding,
    backgroundColor: Colors.white,
  },
  txtName: {
    marginTop: Metrics.regular,
    ...Fonts.normal,
    ...Helpers.textCenter,
    paddingHorizontal: Metrics.regular,
    fontWeight: "bold",
  },
  txtCode: {
    marginVertical: Metrics.tiny,
    ...Fonts.regular,
    color: Colors.grayText,
    ...Helpers.textCenter,
  },
  tabHeader: {
    backgroundColor: Colors.white,
  },
  tabHeaderText: {
    ...Fonts.medium,
  },
  tableItem: {
    backgroundColor: Colors.white,
    borderBottomWidth: 0.25,
    borderBottomColor: Colors.light_gray,
    ...Helpers.smallVerticalPadding,
    marginBottom: Metrics.normal,
  },
  tableHeader: {
    marginTop: Metrics.normal,
    paddingTop: Metrics.normal,
    paddingBottom: Metrics.normal,
    backgroundColor: Colors.white,
  },
  tableTitle: {
    ...Fonts.large,
    marginLeft: Metrics.regular,
    color: "#f5bc6a",
  },
  nestedFlatListTextHorizontal: {
    ...Fonts.medium,
    // ...Helpers.textBold,
    ...Helpers.textCenter,
    flex: 4,
  },
  wrapNestedFlatListHorizontal: {
    ...Helpers.row,
    ...Helpers.center,
    padding: Metrics.tiny,
  },
  nestedFlatListItemHorizontal: {
    // borderWidth: 0.25,
    // borderColor: Colors.light_gray,
    ...Metrics.smallPadding,
    ...Helpers.column,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light_gray,
    paddingBottom: Metrics.small,
    paddingTop: Metrics.small,
  },
  nestedFlatListTextVertical: {
    ...Fonts.medium,
    padding: Metrics.tiny,
  },
  nestedFlatListItemVertical: {
    ...Helpers.column,
    borderColor: Colors.light_gray,
    padding: Metrics.small,
    borderWidth: 0.25,
    flex: 7,
  },
  nestFlatListRow: {
    ...Helpers.rowCross,
    ...Helpers.wrapContent,
    ...Helpers.mainSpaceBetween,
  },
  map: {
    // ...Helpers.fill,
    height: 1,
    width: width,
  },
  txtOrderNo: {
    ...Fonts.large,
    ...Helpers.textCenter,
    ...Helpers.fill,
  },
  btnChose: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.primary,
    height: 40,
    width: width - 40,
    borderRadius: 20,
    zIndex: 100,
  },
  txtChose: {
    color: Colors.white,
  },
  loadIndicator: {
    marginTop: 10,
  },
  addItemContainer: {
    ...Helpers.rowCross,
    ...Metrics.smallHorizontalPadding,
    ...Metrics.smallVerticalPadding,
    backgroundColor: Colors.white,
  },
  tableContainer: {
    backgroundColor: Colors.white,
    borderRadius: Metrics.tiny,
  },
  tableHeaderContainer: {
    ...Helpers.row,
    ...Helpers.mainSpaceBetween,
    backgroundColor: Colors.gray_bg,
    ...Metrics.regularHorizontalPadding,
    paddingBottom: Metrics.normal,
  },
  txtTableHeader: {
    ...Fonts.large,
    textTransform: "uppercase",
    color: Colors.grayText,
  },
  image: {
    width: Metrics.large * 2,
    height: Metrics.large * 2,
    // borderWidth: 1,
    // borderColor: Colors.light_gray
  },
  imageWrapContainer: {
    ...Helpers.fillColCenter,
    justifyContent: "center",
    alignItems: "center",
  },
  imageContainer: {
    ...Helpers.colCenter,
    paddingTop: Metrics.large,
    paddingBottom: Metrics.large,
  },
  listHeaderContainer: {
    ...Helpers.mainCenter,
    ...Helpers.crossEnd,
    ...Metrics.smallVerticalPadding,
    paddingRight: Metrics.regular,
  },
  menuItem: {
    ...Helpers.rowCenter,
    ...Helpers.mainStart,
  },
  menuItemText: {
    marginLeft: Metrics.small,
  },
  emptyText: {
    ...Fonts.large,
    margin: Metrics.small,
    color: Colors.grayText,
  },
  emptyContainer: {
    ...Helpers.fillCenter,
  },
  emptyImg: {
    width: 200,
    height: 200,
  },
  txtStatusFilter: {
    ...Metrics.smallPadding,
    borderRadius: Metrics.medium,
    marginLeft: Metrics.small,
    marginTop: Metrics.small,
  },
  dateLabel: {
    color: Colors.grayText,
  },
  statusFilterContainer: {
    flexWrap: "wrap",
    ...Helpers.crossStart,
    ...Helpers.row,
  },
  dateRangeContainer: {
    ...Helpers.fillRow,
    ...Metrics.regularHorizontalPadding,
    ...Metrics.regularHorizontalPadding,
  },
  txtCriteria: {
    ...Fonts.medium,
    ...Metrics.smallMargin,
  },
  filterHeaderContainer: {
    ...Helpers.fillRowCross,
    ...Helpers.mainSpaceBetween,
    backgroundColor: Colors.primary,
    ...Metrics.smallVerticalPadding,
  },
  addItemText: {
    marginLeft: Metrics.small,
    ...Fonts.large,
    color: Colors.primary,
  },
  redDot: {
    backgroundColor: Colors.red,
    width: Metrics.small,
    height: Metrics.small,
    borderRadius: Metrics.tiny,
  },
  itemContainer: {
    backgroundColor: Colors.white,
  },
  itemSeparator: {
    backgroundColor: Colors.gray_bg,
    // height: Metrics.small,
  },
  hitSlop: {
    top: 15,
    bottom: 15,
    left: 15,
    right: 15,
  },
  loadingOverlayStyle: {
    flex: 1,
    position: "absolute",
    top: 0,
    width: "100%",
    height: height,
    padding: 0,
    justifyContent: "center",
    opacity: 0.5,
  },
  overlay: {
    flex: 1,
    position: "absolute",
    left: 0,
    top: 0,
    width: width,
    height: height,
    padding: 0,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  btnSave: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.primary,
    height: Metrics.medium * 2,
    width: width - 40,
    borderRadius: Metrics.normal,
    zIndex: 100,
  },
  txtChoose: {
    color: Colors.white,
    alignSelf: "center",
    ...Helpers.textBold,
    fontSize: Metrics.regular,
    paddingLeft: Metrics.small,
  },
  icon: {
    width: Metrics.regular,
    height: Metrics.regular,
  },
  imageWrap: {
    ...Helpers.center,
    width: Metrics.large,
    height: Metrics.large,
    borderRadius: Metrics.large / 2,
    opacity: 0.8,
  },
});
//export const style;
