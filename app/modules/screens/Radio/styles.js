import { StyleSheet, Dimensions, StatusBar } from "react-native";
import { Colors as Themes, Fonts, Helpers, Images, Metrics } from "@app/theme";

const createStyles = (isDarkTheme) => {
  const Colors = Themes[isDarkTheme ? 'darkMode' : 'lightMode'];
  return StyleSheet.create({
    containerRadio: {
      flex: 1,
      zIndex: 1000,
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      elevation: Metrics.regular,
    },
    container: {
      backgroundColor: Colors.bgr_radio,
      width: '100%',
      paddingHorizontal: Metrics.regular,
      paddingBottom: Metrics.regular,
      // paddingTop: StatusBar.currentHeight + Metrics.regular,
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
    },
    containerList: {
      bottom: 0,
    },
    background: {
      position: "absolute",
      top: 0,
      left: -Metrics.small,
      bottom: 0,
      right: -Metrics.small,
      backgroundColor: 'rgba(0,0,0, 0.5)',
    },
    line: {
      height: 2,
      width: '100%',
      backgroundColor: Colors.line_radio,
      marginVertical: Metrics.small,
    },
    content: {

    },
    header: {
      // height: 40,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    headerLeft: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    iconLogo: {
      height: Metrics.medium,
      width: Metrics.medium * 2,
    },
    headerLeftText: {
      color: '#fff',
      ...Fonts.small,
      ...Helpers.textBoldfive,
      marginLeft: Metrics.tiny,
    },
    headerRightBtn: {
      backgroundColor: 'black',
      paddingVertical: Metrics.tiny,
      paddingHorizontal: Metrics.small,
      borderRadius: Metrics.regular,
    },
    headerRightBtnText: {
      color: '#fff',
      ...Fonts.small,
    },
    RadioArea: {
      alignItems: 'center',
    },
    titleChannel: {
      color: Colors.white,
      ...Fonts.large,
      ...Helpers.textBold,
      marginBottom: Metrics.small,
    },
    desc: {
      ...Fonts.small,
      color: Colors.desc_radio,
      ...Helpers.textBoldfive,
      marginBottom: Metrics.normal,
    },
    playerArea: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: Metrics.tiny,
    },
    btnPlay: {
      backgroundColor: Colors.bgr_icon,
      width: Metrics.medium * 2,
      height: Metrics.medium * 2,
      borderRadius: Metrics.medium,
      justifyContent: 'center',
      alignItems: 'center',
      marginHorizontal: Metrics.medium,
    },
    icPlay: {
      marginLeft: Metrics.tiny,
    },
    iconStyle: {
      width: Metrics.large,
      height: Metrics.medium,
    },
    btnSwitch: {
      padding: Metrics.tiny,
    },
    footer: {
    },
    btnShowList: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    iconSmall: {
      height: Metrics.normal,
      width: Metrics.normal,
    },
    iconBtnShowList: {
      padding: Metrics.tiny,
      borderRadius: Metrics.normal,
      marginRight: Metrics.tiny,
      backgroundColor: Colors.bgr_showList,
    },
    textBtnShowList: {
      color: '#fff',
      ...Fonts.small,
    },
    btnClose: {
      position: 'absolute',
      bottom: -Metrics.regular,
      right: Metrics.medium / 2,
      width: Metrics.small * 5,
      height: Metrics.small * 5,
      backgroundColor: Colors.white,
      borderRadius: Metrics.medium,
      justifyContent: "center",
      alignItems: 'center',
    },
    iconCloseBox: {
      width: Metrics.regular,
      height: Metrics.regular,
    },
    contentList: {
      flex: 1,
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      // marginLeft: -Metrics.tiny,
    },
    flexGrowFull: {
      flexGrow: 1,
      alignSelf: 'flex-start'
    },
    channelItem: {
      // flex: 1,
      ...Helpers.colCenter,
      marginBottom: Metrics.medium,
      // marginHorizontal: Metrics.tiny,
    },
    channelImageBox: {
      paddingHorizontal: Metrics.icon,
      paddingVertical: Metrics.medium,
      borderWidth: 2,
      borderColor: Colors.line_radio,
      borderRadius: Metrics.normal,
      marginBottom: Metrics.tiny,
    },
    channelImage: {
      width: Metrics.regular * 4,
      height: Metrics.medium * 2,
    },
    channelName: {
      width: Metrics.large * 3,
      height: Metrics.large,
      ...Fonts.small,
      ...Helpers.textBoldCenter,
      color: Colors.white,
    },
    selectedChannelImage: {
      borderColor: Colors.blue_bland,
    },
    selectedChannelName: {
      color: Colors.blue_bland,
    },
  })
};
export default createStyles;