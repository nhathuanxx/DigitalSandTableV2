import { StyleSheet, Dimensions } from "react-native";
const { width, height } = Dimensions.get("window");
import { Colors, Fonts, Helpers, Images, Metrics } from "@app/theme";

const styles = StyleSheet.create({
  toolbar: {
    ...Helpers.rowCross,
    ...Helpers.mainSpaceBetween,
    ...Metrics.regularHorizontalPadding,
    backgroundColor: Colors.white,
    height: Metrics.medium * 2,
    borderBottomColor: Colors.light_gray,
    borderBottomWidth: 1,
  },
  borderTextInput: {
    borderColor: Colors.line_color,
    borderWidth: 1,
    borderRadius: Metrics.tiny,
    height: 66,
  },
  attach: {
    marginTop: Metrics.small,
  },
  textAttach: {
    marginBottom: Metrics.small,
  },
  listImage: {
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  itemImage: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: Metrics.tiny,
  },
  image: {
    height: Metrics.medium * 2,
    width: Metrics.medium * 2,
    borderRadius: Metrics.tiny,
  },
  deleteImage: {
    position: "absolute",
    top: 0,
    right: -Metrics.tiny / 2,
  },
  dialogButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginLeft: Metrics.regular,
    marginRight: Metrics.regular,
    marginBottom: Metrics.medium,
  },
  dialogButtonOk: {
    borderColor: Colors.primary,
    borderWidth: 1,
    backgroundColor: Colors.primary,
    width: (width * 0.8) / 2 - Metrics.medium,
    height: 40,
    borderRadius: Metrics.tiny,
  },
  dialogButtonCancel: {
    width: (width * 0.8) / 2 - Metrics.medium,
    height: 40,
    borderRadius: Metrics.tiny,
    borderColor: Colors.cancel_cl,
    borderWidth: 1,
  },
  completeDialogContainer: {
    marginTop: Metrics.small,
  },
  prevBtnCenter: {
    ...Helpers.fillRowMain,
    alignItems: "center",
  },
  textCancel: {
    color: Colors.cancel_cl,
    fontWeight: "500",
    fontSize: Metrics.regular,
    // lineHeight: Metrics.regular,
  },
  textReturn: {
    color: Colors.white,
    fontWeight: "500",
    fontSize: Metrics.regular,
    lineHeight: Metrics.regular,
  },
  toolbarTitle: {
    ...Helpers.textBold,
    ...Fonts.large,
    color: Colors.primary,
  },
  container: {
    ...Helpers.fill,
    backgroundColor: "#F8F9FA",
  },

  buttonContainer: {
    marginTop: 8,
  },
  loading: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    ...Helpers.center,
  },
  listContent: {
    backgroundColor: Colors.bg_secondary,
    zIndex: 1,
    paddingTop: Metrics.small,
  },
  blurArea: {
    position: "absolute",
    top: 0,
    bottom: height / 1.5,
    left: 0,
    right: 0,
    backgroundColor: Colors.background_blur,
    zIndex: 100,
    opacity: 0.3,
  },
  sortContainer: {
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.gray,
  },
  filterTitle: {
    textAlign: "center",
    fontSize: 18,
  },
  filterLabel: {
    fontWeight: "bold",
    margin: Metrics.small,
  },
  loadMore: {
    height: Metrics.large,
    marginTop: Metrics.small,
    marginBottom: Metrics.small,
    ...Helpers.fillRowCenter,
  },
  textEmpty: {
    fontSize: Metrics.regular,
    marginTop: Metrics.small,
  },
  empty: {
    ...Helpers.fillCol,
    ...Helpers.center,
    marginTop: Metrics.medium * 4,
  },
  icon: {
    width: Metrics.medium,
    height: Metrics.medium,
  },
  chartItem: {
    margin: 16,
    backgroundColor: "#FFFFFF",
    paddingTop: 13,
    paddingHorizontal: 16,
    height: 460,
    borderRadius: 10,
  },
  chartHearder: {
    width: width - 240,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  chartTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  pickerContainer: {
    // flex: 0.6,
    flexDirection: 'row', // Sử dụng flexDirection: 'row' để đảm bảo Picker không bị che khuất
    width: 240,
    alignItems: 'center',
    justifyContent: 'flex-end', // Đưa Picker về phía bên phải
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    paddingHorizontal: 10,
  },
  picker: {
    flex: 1,
    color: 'black',
  },
  containerLabel: {
    // flex: 1,
    marginVertical: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  labelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 4, // Khoảng cách giữa các phần tử
    width: '80%', // Đảm bảo phần tử cha lấp đầy toàn bộ chiều rộng của màn hình
  },
  labelItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 4
  },
  labelCheck: {
    height: 16,
    width: 16,
    borderRadius: 5,
    backgroundColor: 'red',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 4
  },
  labelTitle: {
    fontSize: 10,
    fontWeight: '600'
  },
  // ---------------------------------------------------------------------------------------------------------------------------------



});
export default styles;
