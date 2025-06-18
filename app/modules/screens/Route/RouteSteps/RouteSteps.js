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
    Platform,
    // Animated,
} from "react-native";
import { connect } from "react-redux";
import React, { Fragment, useState, useRef, useEffect, useMemo, useCallback } from "react";
import i18n from "@app/i18n/i18n";
import { Images, Metrics } from "@app/theme";
import * as appAction from "@app/storage/action/app";
import { getTimeFromValue } from '@app/libs/utils.js'
import { SafeAreaInsetsContext, SafeAreaView } from "react-native-safe-area-context";
import { getRouteDetailsIcon } from "@app/modules/components/config/routeStepIcon";
import { useTheme } from "@app/modules/components/context/ThemeContext";
import createStyles from "./styles";
import _ from 'lodash';
import { useOrientation } from "@app/modules/components/context/OrientationContext";
import createHorizontalStyles from "./horizontalStyles";
import Animated, { Easing, FadeOut, SlideInDown, SlideInUp, SlideOutDown, SlideOutUp, useAnimatedStyle, useSharedValue, withDelay, withTiming } from "react-native-reanimated";

const RouteSteps = (props) => {
    const [expanded, setExpanded] = useState(false);
    const [stepsRoute, setStepsRoute] = useState([]);
    const [indexStepSelected, setIndexStepSelected] = useState("0_0");
    const screenHeight = Dimensions.get('window').height;
    const [viewHeight, setViewHeight] = useState(0);
    // const [dimensions, setDimensions] = useState(Dimensions.get("window"));


    const { isDarkTheme } = useTheme();
    const { isPortrait, dimensions } = useOrientation();
    const styles = isPortrait ?
        createStyles(isDarkTheme, dimensions.width, dimensions.height)
        : createHorizontalStyles(isDarkTheme, dimensions.width, dimensions.height);

    const height = useSharedValue(dimensions.height * 0.55);
    useEffect(() => {
        height.value = !expanded ? dimensions.height * 0.55 : dimensions.height * 0.15;
    }, [dimensions]);


    useEffect(() => {
        if (props.routeResult) {
            const routes = props.routeResult
            const minDurationRoute = routes.reduce((minRoute, currentRoute) => {
                const minDuration = minRoute.legs[0].duration.value;
                const currentDuration = currentRoute.legs[0].duration.value;
                return currentDuration < minDuration ? currentRoute : minRoute;
            });
            console.log("______min_________", minDurationRoute.legs)
            setStepsRoute(props.route != null ? props.routeResult[0].legs : minDurationRoute.legs)
        }

    }, [props.route])

    useEffect(() => {
        // console.log("__________-----steps----_____", stepsRoute[(_.split(indexStepSelected, '_')[0])].steps)

    }, [stepsRoute])

    // Sử dụng Animated cho component
    // const [height] = useState(new Animated.Value(dimensions.height * 0.6)); // Bắt đầu với 1/5 chiều cao
    const toggleExpand = () => {
        // const newHeight = expanded ? dimensions.height * 0.6 : dimensions.height * 0.13;
        // Animated.timing(height, {
        //     toValue: newHeight,
        //     duration: 300, // Thời gian animation
        //     useNativeDriver: false,
        // }).start();
        height.value = !expanded ? dimensions.height * 0.15 : dimensions.height * 0.55;
        setExpanded(!expanded);
    };
    const animatedStyle = useAnimatedStyle(() => {
        return {
            height: withTiming(height.value, {
                duration: 400,
                easing: Easing.inOut(Easing.ease),

            }),
        };
    });
    // const animatedStyle = useAnimatedStyle(() => ({
    //     height: withDelay(
    //         100, // Thời gian delay (ms)
    //         withTiming(height.value, {
    //             duration: 400, // Thời gian chuyển đổi (ms)
    //             easing: Easing.inOut(Easing.ease), // Hiệu ứng easing
    //         })
    //     ),
    // }));

    const closeSteps = () => {
        props.updateShowScreen(null);
        props.updateStepView(null)
    }

    const handleStepSelected = ((step, index) => {
        // console.log("_____________sterp______", step)
        setIndexStepSelected(index);
        toggleExpand();
        props.updateStepView({
            location: [step.end_location.lng, step.end_location.lat]
        })
    })

    const renderStep = useCallback((item, index) => {
        return (
            <View key={index}>
                <TouchableOpacity
                    style={[styles.stepOption]}
                    onPress={() => { handleStepSelected(item, index) }}
                >
                    <Image source={getRouteDetailsIcon(item.maneuver)} style={styles.icon} />
                    <View style={styles.step}>
                        <Text style={styles.stepText}>{item.html_instructions}</Text>
                        <View style={styles.stepTime}>
                            <Text style={styles.stepTimeText}>{`${item.distance.text} (${item.duration.text})`}</Text>
                            <View style={styles.lineStep} />
                        </View>
                    </View>
                </TouchableOpacity>
            </View>
        );
    }, []);

    const renderStepContainer = useCallback((item, indexContainer) => {
        return (
            <View style={styles.routeSteps} key={indexContainer}>
                {indexContainer > 0 ? (
                    <View style={styles.stepTitle}>
                        <View style={styles.test}>
                            <View style={[styles.lineStepStart, { marginBottom: Metrics.tiny }]} />
                            <View style={styles.lineStepStart} />
                        </View>
                        <Text style={styles.stepTitleText}>{item.end_address}</Text>
                        <View style={{ flex: 1 }}>
                            <View style={[styles.lineStepEnd, { marginBottom: Metrics.tiny }]} />
                            <View style={styles.lineStepEnd} />
                        </View>
                    </View>
                ) : null}

                {item.steps ? item.steps.map((item, index) => {
                    return (
                        renderStep(item, `${indexContainer}_${index}`)
                    )
                }) : null}
            </View>
        )
    }, [])

    return (
        <SafeAreaInsetsContext.Consumer>
            {(insets) => (
                <>
                    <Animated.View style={[
                        styles.routeStepsContainer, animatedStyle,
                        { left: isPortrait ? 0 : (Platform.OS === 'ios' ? insets.left : Metrics.normal) }
                    ]}>

                        <View style={styles.routeStepsTittle}>
                            <TouchableOpacity style={styles.close} onPress={closeSteps}>
                                <Image source={Images.blackClose} style={styles.icon} />
                                <Text style={styles.text}>{i18n.t("route.attributes.back")}</Text>
                            </TouchableOpacity>
                            <View style={styles.line}></View>
                            <View style={styles.title} >
                                <Text style={styles.titleText} numberOfLines={isPortrait ? 3 : 2} ellipsizeMode="tail">
                                    {stepsRoute.length > 0 ? stepsRoute[(_.split(indexStepSelected, '_')[0])].steps[(_.split(indexStepSelected, '_')[1])].html_instructions : null}
                                </Text>
                            </View>
                            <View style={styles.line}></View>
                            <TouchableOpacity style={styles.compact} onPress={toggleExpand}>
                                <Image source={expanded ? Images.upArrow : Images.downArrow} style={styles.icon} />
                                <Text style={styles.text}>{expanded ? i18n.t("route.attributes.display") : i18n.t("route.attributes.minimize")}</Text>
                            </TouchableOpacity>
                        </View>
                        {!expanded &&
                            <View
                                style={[{ height: dimensions.height * 0.4 }]}
                            // entering={SlideInDown.duration(300)
                            //     .springify()
                            //     .damping(20)
                            // }
                            // exiting={SlideOutDown.duration(300)
                            //     .springify()
                            //     .damping(20)
                            // }
                            >
                                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1 }}>
                                    {stepsRoute.length > 0 ? stepsRoute.map((item, index) => {
                                        return (
                                            renderStepContainer(item, index)
                                        )
                                    }) : null}
                                </ScrollView>
                            </View>
                        }

                        {/* </View> */}
                        {/* </SafeAreaView> */}
                    </Animated.View>
                </>
            )
            }
        </SafeAreaInsetsContext.Consumer >
    )
}

function mapStateToProps(state) {
    return {
        showScreen: state.app.showScreen,
        typeRouteInput: state.app.typeRouteInput,
        navigationFrom: state.app.navigationFrom,
        navigationTo: state.app.navigationTo,
        vehicle: state.app.vehicle,
        routeResult: state.app.routeResult,
        route: state.app.route,
        mapView: state.app.mapView,
    };
}
const mapDispatchToProps = (dispatch) => ({
    updateShowScreen: (show) => dispatch(appAction.showScreen(show)),
    updateTypeRouteInput: (type) => dispatch(appAction.typeRouteInput(type)),
    updateNavigationFrom: (from) => dispatch(appAction.navigationFrom(from)),
    updateNavigationTo: (to) => dispatch(appAction.navigationTo(to)),
    updateVehicle: (vehicle) => dispatch(appAction.vehicle(vehicle)),
    updateRouteResult: (routeResult) => dispatch(appAction.routeResult(routeResult)),
    updateRoute: (route) => dispatch(appAction.route(route)),
    // updateMapView: (mapView) => dispatch(appAction.mapView(mapView)),
    updateStepView: (stepView) => dispatch(appAction.stepView(stepView)),
});
export default connect(mapStateToProps, mapDispatchToProps)(RouteSteps);