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
import LinearGradient from 'react-native-linear-gradient';
import { useTheme } from "@app/modules/components/context/ThemeContext";

const NavigationSpeed = (props) => {
    const { isDarkTheme } = useTheme();
    const styles = createStyles(isDarkTheme);


    return (
        <View style={[styles.container, { top: props.top, left: props.left }]}>
            <View style={styles.speedCircle}>
                <Text style={styles.speedNumber}>{props.speed}</Text>
                <Text style={styles.unit}>km/h</Text>
            </View>

            {/* thẻ hiển thị tốc độ tối đa
            <View style={styles.limitCircle}>
                <Text style={styles.limitNumber}>90</Text>
            </View> */}
        </View>
    )
}

function mapStateToProps(state) {
    return {
        speed: state.app.speed,
    };
}
const mapDispatchToProps = (dispatch) => ({

});
export default connect(mapStateToProps, mapDispatchToProps)(NavigationSpeed);