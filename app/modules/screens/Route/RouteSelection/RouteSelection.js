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
    Alert,
    Platform,
} from "react-native";
import { connect } from "react-redux";
import React, { Fragment, useState, useRef, useEffect, useMemo } from "react";
import i18n from "@app/i18n/i18n";
import { Images, Colors as Themes, Metrics } from "@app/theme";
import * as appAction from "@app/storage/action/app";
import { getTimeFromValue, formatDistance, getTime, decodePolyline } from '@app/libs/utils.js';
import { useTheme } from "@app/modules/components/context/ThemeContext";
import createStyles from './styles';
import { useGetPlaceDetailFromLatLong } from "@app/hooks/place_detail.hook";
import { SafeAreaInsetsContext, SafeAreaView } from "react-native-safe-area-context";
import constants from "@app/config/constants";
import { useOrientation } from "@app/modules/components/context/OrientationContext";
import createHorizontalStyles from "./horizontalStyles";
import * as turf from '@turf/turf';


const RouteSelection = (props) => {
    const [suggestedRoute, setSuggestedRoute] = useState();
    const [selectedRouteIndex, setSelectedRouteIndex] = useState(0);
    const [isShowButton, setIsShowButton] = useState(true);
    const [timeValue, setTimeValue] = useState(0);
    const [distanceValue, setDistanceValue] = useState(0);
    const [dimensions, setDimensions] = useState(Dimensions.get("window"));


    const { isDarkTheme } = useTheme();
    const Colors = Themes[isDarkTheme ? 'darkMode' : 'lightMode'];
    const { isPortrait } = useOrientation();
    const styles = isPortrait ?
        createStyles(isDarkTheme, dimensions.width, dimensions.height)
        : createHorizontalStyles(isDarkTheme, dimensions.width, dimensions.height);

    const useFetchGetPlaceDetailFromLatLong = useGetPlaceDetailFromLatLong();

    useEffect(() => {
        const onChange = ({ window }) => setDimensions(window);
        const subscription = Dimensions.addEventListener("change", onChange);

        return () => {
            subscription?.remove();
        };
    }, []);

    useEffect(async () => {
        if (props.routeResult) {
            // console.log("-----cem====", props.routeResult[0].legs[0])
            // getTimeLineString(decodePolyline(props.routeResult[0].overview_polyline.points))
            let distance = 0;
            let time = 0;
            for (let leg of props.routeResult[0].legs) {
                distance += Math.floor(leg.distance.value / 100) * 100
                let timeLeg = 0;
                if (leg.distance.value < 1000) {
                    const time = getTime(leg.distance.value, 15 / constants.CONVERT_SPEED_M_TO_KM);
                    timeLeg = time;
                } else if (leg.distance.value >= 1000 && leg.distance.value < 5000) {
                    const time = getTime(leg.distance.value, 18 / constants.CONVERT_SPEED_M_TO_KM);
                    timeLeg = time;
                }
                else if (leg.distance.value >= 5000 && leg.distance.value < 10000) {
                    const time = getTime(leg.distance.value, 20 / constants.CONVERT_SPEED_M_TO_KM);
                    timeLeg = time;
                }
                else if (leg.distance.value >= 10000 && leg.distance.value < 20000) {
                    const time = getTime(leg.distance.value, 30 / constants.CONVERT_SPEED_M_TO_KM);
                    timeLeg = time;
                } else {
                    const time = getTime(leg.distance.value, 40 / constants.CONVERT_SPEED_M_TO_KM);
                    timeLeg = time;
                }
                time += Math.floor(timeLeg / constants.CONVERT_HOUR_TO_MINUTE)
            }
            setTimeValue(time * constants.CONVERT_HOUR_TO_MINUTE)
            console.log("________________-", distance)

            setDistanceValue(distance);
            const routes = props.routeResult
            const minDurationRoute = routes.reduce((minRoute, currentRoute) => {
                const minDuration = minRoute.legs[0].duration.value;
                const currentDuration = currentRoute.legs[0].duration.value;
                return currentDuration < minDuration ? currentRoute : minRoute;
            });
            setSuggestedRoute(minDurationRoute)
        }
        if (props.myLocation != null) {
            // const place = await getPlaceDetailFromLatLong(props.myLocation[1], props.myLocation[0]);
            if (props.navigationFrom != null) {
                if (props.navigationFrom.myLocation != null) {
                    setIsShowButton(false)
                } else {
                    setIsShowButton(true)
                }
            }
        }
    }, [props.routeResult])
    useEffect(() => {
        if (!props.route == null) {
            props.updateRoute(suggestedRoute)
            console.log(suggestedRoute)
        }
    }, [])

    const getPlaceDetailFromLatLong = async (lat, long) => {
        let place = null;
        const params = {
            latlng: `${lat},${long}`
        };

        try {
            const response = await useFetchGetPlaceDetailFromLatLong.mutateAsync(params);
            place = response.results[0];
        } catch (error) {
            Alert.alert(
                i18n.t("alert.attributes.warning"),
                error.message || i18n.t("alert.attributes.warning"),
                [
                    { text: i18n.t("alert.attributes.oke") },
                ]
            );
        }
        return place;
    }

    const getTimeLineString = (lineString) => {
        let totalTime = 0;  // Biến để lưu thời gian tổng cộng
        for (let i = 0; i < lineString.length - 1; i++) {
            const pointA = lineString[i];
            const pointB = lineString[i + 1];

            // Tính khoảng cách giữa 2 điểm A và B
            const distance = turf.distance(turf.point(pointA), turf.point(pointB), { units: 'kilometers' });

            // Áp dụng tốc độ thay đổi tùy theo khoảng cách
            let speed = constants.AVERAGE_SPEED;

            if (distance < 0.05) { //khỏang cách giữa 2 lineString: <50m
                speed = constants.SPEED_0_TO_50;
            }
            else if (distance >= 0.05 && distance < 0.1) {  //khỏang cách giữa 2 lineString: >50m <100m
                speed = constants.SPEED_50_TO_100;
            }
            else if (distance >= 0.1 && distance < 0.5) {  //khỏang cách giữa 2 lineString: >100m <500m
                speed = constants.SPEED_100_TO_500;
            }
            else if (distance >= 0.5 && distance < 1) {  //khỏang cách giữa 2 lineString: <500m >1km
                speed = constants.SPEED_500_TO_1000;
            }
            else {
                speed = constants.SPEED_1000;
            }

            // Tính thời gian cho đoạn đường này (tính theo giờ)
            const timeForSegment = distance / speed;  // Thời gian tính bằng giờ
            totalTime += timeForSegment;  // Cộng dồn thời gian
            console.log(`Khoảng cách giữa điểm ${i + 1} và ${i + 2}: ${distance} km, Tốc độ: ${speed} km/h, Thời gian: ${timeForSegment} giờ`);

        }
        setTimeValue(totalTime * constants.CONVERT_HOUR_TO_SECOND);

        // console.log("________________________-totalTime+++++++++", getTimeFromValue(
        //     totalTime * 3600,
        //     i18n.t("route.attributes.day"),
        //     i18n.t("route.attributes.hour"),
        //     i18n.t("route.attributes.minute"),
        // ))
    }

    const setRouteResult = (data) => {
        props.updateRoute(data)
    }
    const handleStepsRoute = () => {
        props.updateShowScreen("routeSteps");
    };

    const startRouting = () => {
        // if (props.isLoad == true) {
        props.updateIsRouting(true);
        props.updateShowScreen("routeSteps");
        props.updateIsReturn(true);
        // }
    }
    // const getTimeValue = (item) => {
    //     let time = 0;
    //     for (let leg of item.legs) {
    //         time += leg.duration.value;
    //     }
    //     console.log("_____=======tiem____-----___", item);
    //     return time;
    // };

    const renderRouteOptionItem = ({ item, index }) => {
        const isSelected = (index + 1) === selectedRouteIndex;
        return (
            <TouchableOpacity style={isSelected ? styles.routeOption : styles.routeOptionUnSelect}
                onPress={() => {
                    setSelectedRouteIndex(index + 1)
                    setRouteResult(item)
                }}
            >
                <Text style={isSelected ? styles.titleTextSelected : styles.titleTextUnSelected}>{`${i18n.t("route.attributes.option")} ${index + 1}`}</Text>
                <Text style={isSelected ? styles.distanceTextSelected : styles.distanceTextUnSelected}>
                    {getTimeFromValue(
                        timeValue,
                        i18n.t("route.attributes.day"),
                        i18n.t("route.attributes.hour"),
                        i18n.t("route.attributes.minute"),
                    )}
                </Text>
                <Text style={isSelected ? styles.durationTextSelected : styles.durationTextUnSelected}>{distanceValue}</Text>
            </TouchableOpacity>
        )
    }
    const renderRouteOptions = (data) => {

        return (
            <View>
                <FlatList
                    data={data}
                    renderItem={renderRouteOptionItem}
                />
            </View>
        )
    }
    return (

        <SafeAreaInsetsContext.Consumer>
            {(insets) => (
                <View style={[
                    styles.routeSelectionContainer,
                    {
                        bottom: Platform.OS === 'ios' ? insets.bottom / 2 + Metrics.tiny : Metrics.tiny,
                        left: (Platform.OS === 'ios' && !isPortrait) ? insets.left : Metrics.normal
                    }
                ]}
                >
                    <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}>
                        <View style={styles.routeOptions}>
                            {suggestedRoute ? (
                                <TouchableOpacity style={selectedRouteIndex == 0 ? styles.routeOption : styles.routeOptionUnSelect}
                                    onPress={() => {
                                        setSelectedRouteIndex(0)
                                        setRouteResult(null)
                                    }}
                                >
                                    <Text style={selectedRouteIndex == 0 ? styles.titleTextSelected : styles.titleTextUnSelected}>{i18n.t("route.attributes.suggestion")}</Text>
                                    <Text style={selectedRouteIndex == 0 ? styles.distanceTextSelected : styles.distanceTextUnSelected}>
                                        {getTimeFromValue(
                                            timeValue,
                                            i18n.t("route.attributes.day"),
                                            i18n.t("route.attributes.hour"),
                                            i18n.t("route.attributes.minute"),
                                        )}
                                    </Text>
                                    <Text style={selectedRouteIndex == 0 ? styles.durationTextSelected : styles.durationTextUnSelected}>{formatDistance(distanceValue)}</Text>
                                </TouchableOpacity>
                                // <></>
                            ) : null}
                            {Array.isArray(props.routeResult) && props.routeResult.length > 1 ? renderRouteOptions(props.routeResult)
                                : null
                            }
                        </View>
                    </ScrollView>
                    {!isShowButton &&
                        <View style={styles.buttonContainer}>

                            <TouchableOpacity style={styles.displayStep} onPress={handleStepsRoute}>
                                <Image
                                    source={Images.detailsRoute}
                                    style={[styles.displayStepImg, { tintColor: Colors.text }]}
                                />
                                <Text style={styles.displayStepText}>{i18n.t("route.attributes.details")}</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.buttonStart} onPress={startRouting}>
                                <Image
                                    source={Images.startRoute}
                                    style={styles.displayStepImg}
                                />
                                <Text style={styles.buttonStartText}>{i18n.t("route.attributes.start")}</Text>
                            </TouchableOpacity>

                        </View>
                    }
                    {isShowButton &&
                        <TouchableOpacity style={styles.buttonDetails} onPress={handleStepsRoute}>
                            <Image
                                source={Images.detailsRoute}
                                style={[styles.displayStepImg, { tintColor: Colors.white }]}
                            />
                            <Text style={styles.buttonStartText}>{i18n.t("route.attributes.routeDetails")}</Text>
                        </TouchableOpacity>
                    }
                </View>
            )}
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
        myLocation: state.app.myLocation,
        isRouting: state.app.isRouting,
        isLoad: state.app.isLoad,
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
    updateIsRouting: (isRouting) => dispatch(appAction.isRouting(isRouting)),
    updateIsReturn: (isReturn) => dispatch(appAction.isReturn(isReturn)),
});
export default connect(mapStateToProps, mapDispatchToProps)(RouteSelection);