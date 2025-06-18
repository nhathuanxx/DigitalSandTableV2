import { StyleSheet, Dimensions } from "react-native";
// const { width, height } = Dimensions.get("window");
import { Colors as Themes, Fonts, Helpers, Images, Metrics } from "@app/theme";
import { helpers } from "@turf/turf";

const createHorizontalStyles = (isDarkTheme, screenWidth, screenHeight) => {
  const Colors = Themes[isDarkTheme ? 'darkMode' : 'lightMode'];
  return StyleSheet.create({
    container: {
      flex: 1,
      // ...Helpers.mainSpaceBetween,
      backgroundColor: Colors.backgroundGrey
    },
    content: {
      marginBottom: Metrics.small,
      flex: 1,
    },
    footer: {
      // ...Helpers.positionAbso,
      // bottom: 0,
      // left: 0,
      // right: 0
    },


    icArrowBack: {
      width: Metrics.regular,
      height: Metrics.regular,
      tintColor: Colors.text
    },
    header: {
      ...Helpers.rowCross,
      backgroundColor: Colors.background,
      // borderBottomLeftRadius: Metrics.regular,
      // borderBottomRightRadius: Metrics.regular,
    },
    textHeader: {
      ...Fonts.regular,
      fontWeight: '500',
      color: Colors.text,
    },
    headerBtnBack: {
      padding: Metrics.regular
    },
    // --------------------------------------------------------------------------------------------------------
    contentTop: {
      flexDirection: 'row',
      // flexWrap: 'wrap',
      height: screenHeight / 4,
      paddingHorizontal: Metrics.small,
      marginVertical: Metrics.small
    },
    contentTopItem: {
      width: '30%',
      flex: 1,
      paddingHorizontal: 0,
    },
    contentBanner: {
      backgroundColor: Colors.background,
      borderRadius: Metrics.small,
      overflow: 'hidden'
    },
    spacer: {
      width: Metrics.small
    },
    imageContent: {
      width: '100%',
      height: '100%',
    },
    contentContainer: {
      overflow: 'hidden',
      ...Helpers.positionAbso,
      top: 0,
      right: 0,
      left: 0,
      bottom: 0,
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingHorizontal: Metrics.small,
      paddingVertical: Metrics.normal,
    },
    textContainer: {
      ...Helpers.column,
      ...Helpers.fill,
      // marginTop: Metrics.small
    },
    titleText: {
      ...Fonts.medium,
      ...Helpers.textBold,
      color: Colors.blue_light
    },
    descriptionText: {
      ...Fonts.tiny,
      color: Colors.blue_light,
      fontWeight: '500'
    },
    imageContentFrequently: {
      width: Metrics.small * 7,
      height: Metrics.small * 7,
    },
    // ------------------------------------------------------------------------------------------------------------
    section: {
      paddingHorizontal: Metrics.small,
      flex: 1,
    },
    sectionContent: {
      paddingVertical: Metrics.small,
      ...Helpers.positionRela,
      borderRadius: Metrics.normal,
      backgroundColor: Colors.background,
      flex: 1,
    },
    fullHeight: {
      height: '100%'
    },
    leftSection: {
      ...Helpers.rowCross,

      paddingLeft: Metrics.small,
      paddingTop: Metrics.tiny,
      paddingBottom: Metrics.tiny,
      paddingRight: Metrics.normal,
    },
    leftSectionFavorite: {
      paddingBottom: Metrics.small,
    },
    iconSection: {
      width: Metrics.tiny * 5,
      height: Metrics.tiny * 5,
      marginRight: Metrics.small,
    },
    sectionTextTitle: {
      flex: 1,
      fontSize: 15,
      ...Helpers.textBold,
      color: Colors.text
    },
    rightIconSection: {
      ...Helpers.center,
      width: Metrics.large,
    },
    rightIconImage: {
      width: Metrics.regular,
      height: Metrics.regular,
      tintColor: Colors.textGrey,
    },
    middleSection: {
      marginTop: Metrics.small,
      ...Helpers.center,
      paddingBottom: Metrics.normal
    },
    sectionText: {
      fontSize: 15,
      color: Colors.blue_light,
      fontWeight: '500',
    },
    sectionTextAddress: {
      fontSize: 15,
      paddingHorizontal: Metrics.normal,
      color: Colors.textGrey,
    },
    sectionAddress: {

      paddingVertical: Metrics.tiny,
      marginRight: Metrics.large
    },

    sectionContentAgency: {
      // marginTop: Metrics.normal,
      borderRadius: Metrics.normal,
      backgroundColor: Colors.background
    },

    navFooter: {
      ...Helpers.row,
      borderTopWidth: 1,
      borderTopColor: Colors.bright_light,
      paddingHorizontal: Metrics.normal,
      flex: 1,
    },
    textNav: {
      ...Helpers.column,
      ...Helpers.fill,
      marginRight: Metrics.regular,
      paddingVertical: Metrics.small,
      flex: 1,
    },
    titleTextNav: {

      ...Fonts.medium,
      ...Helpers.textBold,
      color: Colors.text,
      fontWeight: '500'
    },
    addressTextNav: {
      fontSize: 15,
      color: Colors.textGrey
    },
    menuIcon: {
      width: Metrics.regular,
      height: Metrics.regular,

    },
    ContentBottom: {
      marginTop: Metrics.normal,
      borderRadius: Metrics.normal,
      backgroundColor: Colors.white
    },
    // --------------------------------------------------------------------------------------------------
    footerAddLocation: {
      paddingHorizontal: Metrics.small,
      paddingTop: Metrics.normal,
      backgroundColor: Colors.background,
      borderTopWidth: 0.5,
      borderTopColor: Colors.bright_light,
      // borderTopLeftRadius: Metrics.regular,
      // borderTopRightRadius: Metrics.regular,
    },
    footerAddLocationBtn: {
      ...Helpers.rowCenter,
      backgroundColor: Colors.navyBlue,
      borderRadius: Metrics.medium,
      paddingHorizontal: Metrics.regular,
      paddingVertical: Metrics.normal,
    },
    iconExtraLocation: {
      width: Metrics.icon,
      height: Metrics.icon,
      marginRight: Metrics.small
    },
    footerAddLocationText: {
      color: Colors.white,
      ...Fonts.regular,
      fontWeight: '500',
    },
    // -------------------------------------------------------------------------------------------------------------------------------
    spacerModal: {
      width: Metrics.small,
    },
    optionTitleContent: {
      paddingTop: Metrics.small,
      backgroundColor: Colors.backgroundGrey,
      borderTopLeftRadius: Metrics.regular,
      borderTopRightRadius: Metrics.regular,
      zIndex: 2,
      width: '100%',
    },
    optionTitle: {
      fontSize: 15,
      ...Helpers.textBold,
      color: Colors.text,
      marginBottom: Metrics.small,
    },
    optionList: {
      flexDirection: 'row',
    },
    optionButton: {
      flex: 1,
      padding: Metrics.normal,
      flexDirection: 'row',
      borderRadius: Metrics.regular,
      backgroundColor: Colors.background,
    },
    iconFooter: {
      width: Metrics.medium,
      height: Metrics.medium,
      marginRight: Metrics.normal,
    },
    iconColor: {
      tintColor: Colors.text,
    },
    optionText: {
      fontSize: 15,
      color: Colors.text
    },
    optionTextColor: {
      color: Colors.red
    },
    absoluteOverlay: {
      ...Helpers.positionAbso,
      top: 0,
      bottom: 0,
      right: 0,
      left: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'flex-end'
    },
    overlayBackground: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      zIndex: 1,
    },
    iconSelect: {
      ...Helpers.positionAbso,
      right: Metrics.normal,
      top: -Metrics.large,
      ...Helpers.center,
      width: Metrics.large,
      height: "100%"
    },

  })
};

export default createHorizontalStyles;
