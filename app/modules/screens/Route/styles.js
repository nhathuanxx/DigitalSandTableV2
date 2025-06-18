import { StyleSheet, Dimensions } from "react-native";
const { width, height } = Dimensions.get("window");
import { Colors as Themes, Fonts, Helpers, Images, Metrics } from "@app/theme";

const createStyles = (isDarkTheme) => {
    const Colors = Themes[isDarkTheme ? 'darkMode' : 'lightMode'];
    return StyleSheet.create({
        container: {
            flex: 1,
        },

        contentTop: {
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            // borderWidth: 1,
        },
        viewBtnAction: {
            marginTop: Metrics.small,
            marginHorizontal: Metrics.normal,
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'space-between'
        },
        btnActionRight: {
            flex: 1,
            alignItems: 'flex-end'
        },
        viewIconRadio: {
            // marginTop: Metrics.tiny,
            backgroundColor: Colors.background,
            width: Metrics.icon * 2,
            height: Metrics.icon * 2,
            borderRadius: Metrics.normal,
            ...Helpers.center,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.3,
            shadowRadius: 2,
            // elevation: 4,
        },
        iconStyle: {
            width: Metrics.icon,
            height: Metrics.icon,
            resizeMode: 'contain',
        },
        iconRadio: {
            height: Metrics.icon,
            width: Metrics.medium,
        },
    })
};
export default createStyles;
