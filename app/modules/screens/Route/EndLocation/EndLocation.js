import {
    TouchableOpacity,
    Dimensions,
    StyleSheet,
    Text,
    View,
    Image,
    FlatList,
    TextInput,
    ScrollView,
    StatusBar
} from "react-native";
import createStyles from './styles';
import { connect } from "react-redux";
import React, { Fragment, useState, useRef, useEffect, useMemo, useCallback } from "react";
import { Images } from "@app/theme";
import * as appAction from "@app/storage/action/app";
import { SafeAreaInsetsContext, SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "@app/modules/components/context/ThemeContext";
import i18n from "@app/i18n/i18n";
import { useNavigation } from "@react-navigation/native";
import Tts from 'react-native-tts';
import { formatDistance, getDefaultVoiceLanguage } from "@app/libs/utils";
import storage from "@app/libs/storage";

const EndLocation = (props) => {

    const [dimensions, setDimensions] = useState(Dimensions.get("window"));

    const { isDarkTheme } = useTheme();
    const styles = createStyles(isDarkTheme, dimensions.width, dimensions.height);
    const navigation = useNavigation();

    useEffect(() => {
        // console.log("_______________routeResult===========", props.navigationToArray)
        const fetchLanguage = async () => {
            const lang = await getLanguage();
            // cài ngôn ngữ
            Tts.setDefaultLanguage(getDefaultVoiceLanguage(lang));
        };
        fetchLanguage();
        Tts.setDucking(true);
        if (props.navigationToArray.length < 1) {
            // console.log("_______________routeResult===========", props.navigationTo)
            Tts.speak(`${i18n.t("route.attributes.destination")} ${props.navigationTo.name ? props.navigationTo.name : props.navigationTo.structured_formatting.main_text}`);
        } else {
            Tts.speak(`${i18n.t("route.attributes.destination")} ${props.navigationToArray[0].name ? props.navigationToArray[0].name : props.navigationToArray[0].structured_formatting.main_text}`);
        }

        const onChange = ({ window }) => setDimensions(window);
        const subscription = Dimensions.addEventListener("change", onChange);

        return () => {
            subscription?.remove();
        };
    }, []);

    const getLanguage = async () => {
        const language = await storage.get("language");
        return language ? language : 'vi'
    };

    const done = () => {
        navigation.navigate('Overview')
        props.updateIsRouting(false);
        props.updateShowScreen("overview");
        props.updateNavigationFrom(null);
        props.updateNavigationTo(null);
        props.updateMapView({});
        props.updateIsEndPoint(false);
        props.updateNavigationToArray([]);
        props.updateEndLocationIndex(-1);
        props.updateStepIndex(0)
    }
    return (
        <SafeAreaInsetsContext.Consumer>
            {(insets) => (
                <View style={styles.container}>
                    <View style={styles.body}>
                        <Text style={[styles.textBlack]}>{i18n.t("route.attributes.endPoint")}</Text>
                        {/* <Text style={[styles.textBlack, styles.title]}>{props.navigationTo ? props.navigationTo.structured_formatting.main_text : props.navigationToArray[props.navigationToArray.length - 1].structured_formatting.main_text}</Text>
                        <Text numberOfLines={1} ellipsizeMode="tail" style={[styles.textGrey]}> */}
                        {/* {props.navigationTo?.structured_formatting.secondary_text} */}
                        {/* {props.navigationTo ? props.navigationTo.structured_formatting.secondary_text : props.navigationToArray[props.navigationToArray.length - 1].structured_formatting.secondary_text}
                        </Text> */}
                    </View>
                    <View style={[styles.footer]}>
                        <TouchableOpacity style={styles.button} onPress={done}>
                            <Image source={Images.tick} style={styles.icon} />
                            <Text style={styles.textBlue}>{i18n.t("route.attributes.done")}</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.limitCircle}>
                        <Image source={Images.logo} style={styles.img} />
                    </View>
                </View>
            )}
        </SafeAreaInsetsContext.Consumer >

    )
}

function mapStateToProps(state) {
    return {
        speed: state.app.speed,
        navigationTo: state.app.navigationTo,
        navigationToArray: state.app.navigationToArray,
        routeResult: state.app.routeResult,
        navigationTo: state.app.navigationTo,
        navigationToArray: state.app.navigationToArray,

    };
}
const mapDispatchToProps = (dispatch) => ({
    updateShowScreen: (show) => dispatch(appAction.showScreen(show)),
    updateEndLocationIndex: (endLocationIndex) => dispatch(appAction.endLocationIndex(endLocationIndex)),
    updateIsRouting: (isRouting) => dispatch(appAction.isRouting(isRouting)),
    updateNavigationFrom: (from) => dispatch(appAction.navigationFrom(from)),
    updateNavigationTo: (to) => dispatch(appAction.navigationTo(to)),
    updatePlace: (place) => dispatch(appAction.place(place)),
    updateMapView: (mapView) => dispatch(appAction.mapView(mapView)),
    updateIsEndPoint: (isEndPoint) => dispatch(appAction.isEndPoint(isEndPoint)),
    updateNavigationToArray: (navigationToArray) => dispatch(appAction.navigationToArray(navigationToArray)),
    updateStepIndex: (stepIndex) => dispatch(appAction.stepIndex(stepIndex)),
});
export default connect(mapStateToProps, mapDispatchToProps)(EndLocation);