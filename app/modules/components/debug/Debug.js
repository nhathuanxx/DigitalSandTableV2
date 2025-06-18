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
    StatusBar,
} from "react-native";
import createStyles from './styles';
import { connect } from "react-redux";
import React, { Fragment, useState, useRef, useEffect, useMemo, useCallback } from "react";
import { Images } from "@app/theme";
import * as appAction from "@app/storage/action/app";
import { SafeAreaInsetsContext, SafeAreaView } from "react-native-safe-area-context";
import LinearGradient from 'react-native-linear-gradient';
import { useTheme } from "@app/modules/components/context/ThemeContext";
import i18n from "@app/i18n/i18n";
import { getRouteDetailsIcon } from "@app/modules/components/config/routeStepIcon";
import Tts from 'react-native-tts';
import { getDistance } from 'geolib';
import storage from "@app/libs/storage";
import { formatDistance, getDefaultVoiceLanguage } from "@app/libs/utils";

const Debug = (props) => {
    const { isDarkTheme } = useTheme();

    const styles = createStyles(isDarkTheme);
    const [accuracyValue, setAccuracyValue] = useState(null);
    const [distanceMarkerValue, setDistanceMarkerValue] = useState(null);

    useEffect(() => {
        // console.log("++++++++++++++++++++", props.altitude)
        setAccuracyValue(props.accuracy)
    }, [props.accuracy]);

    useEffect(() => {
        // console.log("++++++++++++++++++++", props.altitude)
        setDistanceMarkerValue(props.distanceMarker)
    }, [props.distanceMarker]);

    return (
        <View style={styles.debugContainer}>
            <Text style={styles.debugText}>Độ chính xác GPS: {accuracyValue}</Text>
            <Text style={styles.debugText}>Khoảng cách với đường: {distanceMarkerValue}</Text>
            {/* <Text style={styles.debugText}>7777777777</Text>
            <Text style={styles.debugText}>7777777777</Text>
            <Text style={styles.debugText}>7777777777</Text> */}
        </View>
    )
}

function mapStateToProps(state) {
    return {
        stepIndex: state.app.stepIndex,
        endLocationIndex: state.app.endLocationIndex,
        routeResult: state.app.routeResult,
        myLocation: state.app.myLocation,

    };
}
const mapDispatchToProps = (dispatch) => ({

});
export default connect(mapStateToProps, mapDispatchToProps)(Debug);