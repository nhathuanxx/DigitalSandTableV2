import { StyleSheet, Dimensions } from "react-native";
const { width, height } = Dimensions.get("window");
import { Colors as Themes, Fonts, Helpers, Images, Metrics } from "@app/theme";


const createStyles = (isDarkTheme) => {
    const Colors = Themes[isDarkTheme ? 'darkMode' : 'lightMode'];
    return StyleSheet.create({
        locationSelectionContainer: {
            ...Helpers.positionAbso,
            backgroundColor: Colors.backgroundGrey,
            paddingHorizontal: Metrics.regular,
            ...Helpers.fullSize,
            borderRadius: Metrics.normal,
            ...Helpers.fillCol,
            // borderWidth: 3,
        },
        locationSelectionTitle: {
            // backgroundColor: Colors.red,
            ...Helpers.rowCross,
            paddingTop: Metrics.small,
            paddingBottom: Metrics.small,
        },
        locationSelectionInput: {
            backgroundColor: Colors.background,
            borderRadius: Metrics.small,
            marginTop: Metrics.normal,
            paddingVertical: Metrics.small,
            paddingLeft: Metrics.small,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
        },
        getLocationInMap: {
            backgroundColor: Colors.background,
            borderRadius: Metrics.small,
            marginTop: Metrics.normal,
            padding: Metrics.small,
            ...Helpers.rowCross,
        },
        currentLocation: {
            backgroundColor: Colors.background,
            borderRadius: Metrics.small,
            marginTop: Metrics.normal,
            padding: Metrics.small,
            ...Helpers.rowCross,
        },
        locationSelectionHistory: {
            backgroundColor: Colors.background,
            borderRadius: Metrics.small,
            marginTop: Metrics.normal,
        },

        locationSelectionTitleImg: {
            width: Metrics.medium,
            height: Metrics.medium,
            marginRight: Metrics.normal,
        },
        iconBack: {
            tintColor: Colors.secondaryText,
        },
        locationSelectionTitleText: {
            fontWeight: "600",
            color: Colors.text,
        },
        getLocationInMapImg: {
            width: Metrics.tiny * 5,
            height: Metrics.medium,
            marginRight: Metrics.normal,
        },
        getLocationInMapImgRight: {
            width: Metrics.normal,
            height: undefined,
            aspectRatio: 1,
            marginRight: Metrics.small

        },
        getLocationInMapLeft: {
            flex: 1,
            ...Helpers.rowCross,
        },
        searchDataHeader: {
            paddingHorizontal: Metrics.normal,
            paddingVertical: Metrics.small,
        },
        textGrey: {
            color: Colors.textGrey,
        },
        input: {
            paddingVertical: 0,
            height: Metrics.large,
            color: Colors.text,
            // backgroundColor: Colors.back
            flex: 1,
        },
        btnVoice: {
            paddingVertical: Metrics.tiny,
            paddingLeft: Metrics.small,
            paddingRight: Metrics.normal,
            flex: 1,
        },
        btnVoice: {
            paddingVertical: Metrics.tiny,
            paddingLeft: Metrics.small,
            paddingRight: Metrics.normal,
        },
        iconFrame: {
            width: Metrics.icon,
            height: Metrics.icon,
            tintColor: Colors.text,
        },
        emptyContainer: {
            ...Helpers.center,
        },
        emptyText: {
            marginBottom: Metrics.small,
            marginTop: Metrics.small,
            color: Colors.textBrightGrey
        },
        iconStar: {
            width: Metrics.icon,
            height: Metrics.icon,
        },
        iconColor: {
            tintColor: Colors.text
        },
        buttonStar: {
            height: Metrics.regular,
            width: Metrics.regular,
            ...Helpers.center,

        },
        searchDataItem: {
            ...Helpers.fillRowBetween,
            paddingVertical: Metrics.small,
            paddingHorizontal: Metrics.normal,
            borderTopWidth: 0.5,
            borderTopColor: Colors.gray,
        },
        searchDataText: {
            ...Helpers.fill,
            marginRight: Metrics.normal
        },
        locationSelectionText: {
            fontSize: 15,
            color: Colors.text
        },
        secondaryText: {
            ...Fonts.medium,
            color: Colors.textGrey,
        },

    })
};
export default createStyles;