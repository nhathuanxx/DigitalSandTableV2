import { StyleSheet, Dimensions } from "react-native";
const { width, height } = Dimensions.get("window");
import { Colors as Themes, Fonts, Helpers, Images, Metrics } from "@app/theme";
import CreateColors from "@app/theme/Colors";

const createStyles = (isDarkTheme) => {
    const Colors = Themes[isDarkTheme ? 'darkMode' : 'lightMode'];
    return StyleSheet.create({
        navigationSearchInputContainer: {
            // ...Helpers.positionAbso,
            minHeight: Metrics.large * 4,
            backgroundColor: Colors.background,
            marginHorizontal: Metrics.normal,
            // right: Metrics.normal,
            // top: Metrics.large,
            borderRadius: Metrics.small,
            padding: Metrics.small,
        },
        navigationInput: {
            ...Helpers.fillRow,
        },
        navigationIcon: {
            height: Metrics.large,
            marginTop: Metrics.regular,
            ...Helpers.row,
        },
        navigationBack: {
            ...Helpers.crossCenter,
            width: Metrics.normal * 3,
            // backgroundColor: Colors.red,
            flex: 1,
        },
        navigationLocation: {
            width: Metrics.large * 7,
            borderRadius: Metrics.normal,
            backgroundColor: Colors.backgroundGhoshLight,
            paddingTop: Metrics.small,
            paddingBottom: Metrics.small,
            paddingLeft: Metrics.small,
            paddingRight: Metrics.small,
            ...Helpers.fillRowCross,

        },
        inputLocation: {
            ...Helpers.fillCol,
            flex: 1,
        },
        inputLocationItem: {
            ...Helpers.fillRowCross,
        },
        navigationImg: {
            width: Metrics.large,
            ...Helpers.center,
        },
        inputText: {
            flex: 1,
            height: Metrics.large,
            ...Helpers.mainCenter,
            // color: Colors.text,
        },
        centerInputText: {
            ...Helpers.fillRowCross,
        },
        line: {
            height: 0.5,
            backgroundColor: Colors.gray,
            // width: Metrics.medium * 7,
            flex: 1
        },
        input: {
            paddingVertical: 0,
            height: Metrics.large,
        },
        iconCenter: {
            height: Metrics.regular * 3,
            width: Metrics.tiny * 7,
            ...Helpers.center,
            marginLeft: Metrics.tiny,
        },
        fromToImg: {
            height: Metrics.small,
            width: Metrics.small
        },
        centerImg: {
            height: Metrics.regular,
            aspectRatio: 1,
            resizeMode: 'contain',
        },
        addSwapVoidImg: {
            height: Metrics.regular,
            width: Metrics.regular,
            tintColor: Colors.secondaryText,
        },
        iconFunction: {
            ...Helpers.row,
        },
        backImg: {
            height: Metrics.regular,
            width: Metrics.small,
            marginTop: Metrics.normal,
            tintColor: Colors.text,
        },
        vehicle: {
            ...Helpers.row,
            backgroundColor: Colors.textBrightGrey,
            height: Metrics.large,
            ...Helpers.selfStart,
            paddingLeft: Metrics.normal,
            paddingRight: Metrics.normal,
            ...Helpers.center,
            borderRadius: Metrics.medium,
            marginRight: Metrics.normal,
            overflow: 'hidden',
        },
        vehicleIcon: {
            // resizeMode: 'contain',
            // height: Metrics.tiny * 4,
            width: Metrics.tiny * 7
            // aspectRatio: 4,
        },
        vehicleText: {
            color: Colors.white,
            marginLeft: Metrics.tiny,
            ...Helpers.textBoldfive,
        },
        textGrey: {
            color: Colors.textBrightGrey,
        },
        locationSelectionText: {
            color: Colors.text
        },
        vehicleUnSelected: {
            ...Helpers.row,
            // backgroundColor: Colors.write_bright,
            height: Metrics.large,
            ...Helpers.selfStart,
            paddingLeft: Metrics.normal,
            paddingRight: Metrics.normal,
            ...Helpers.center,
            borderRadius: Metrics.medium,
            marginRight: Metrics.normal,
            overflow: 'hidden',
        },
        vehicleTextUnSelect: {
            color: Colors.independence,
            marginLeft: Metrics.tiny,
            ...Helpers.textBoldfive,
        },
        twoDotsImg: {
            height: Metrics.small,
            aspectRatio: 1,
            resizeMode: 'contain',
            tintColor: "#C5CDDE"
        },
        inputLocations: {
            ...Helpers.fillCol,
            height: Metrics.medium * 5,
        },
    })
};
export default createStyles;
