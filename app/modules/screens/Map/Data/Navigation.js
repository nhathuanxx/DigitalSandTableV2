import {
    View,
    Image,
    Alert,
    Animated,
    Dimensions,
    Easing,
} from "react-native";
import { connect } from "react-redux";
import React, { Fragment, useState, useRef, useEffect, useCallback } from "react";
import * as appAction from "@app/storage/action/app";
import MapLibreGL from "@maplibre/maplibre-react-native";
import { haversineDistance } from '@app/libs/utils.js'
import { getDistance } from 'geolib';
import { Images } from "@app/theme";
import Geolocation from 'react-native-geolocation-service';
import constants from "@app/config/constants";
import styles from "../styles";
import i18n from "@app/i18n/i18n";
import * as turf from '@turf/turf';
import { decodePolyline } from '@app/libs/utils.js'
import { debounce } from 'lodash';
import throttle from 'lodash/throttle';
const { width, height } = Dimensions.get("window");
import { useOrientation } from "@app/modules/components/context/OrientationContext";



const Navigation = (props) => {
    const [isMove, setIsMove] = useState(false);
    const [navigationLocation, setNavigationLocation] = useState([105.82479740871187, 21.034814987184127]);
    const [lineString, setLineString] = useState([]);
    // const [pitchMarker, setPitchMarker] = useState(0);
    const [headingMarker, setHeadingMarker] = useState(0);
    const [adjustedHeading, setAdjustedHeading] = useState(0); // Hướng hiển thị thực tế của marker

    const watchId = useRef(null);
    const { isPortrait } = useOrientation();
    const [dimensions, setDimensions] = useState(Dimensions.get("window"));
    const animatedCoords = useRef(new Animated.ValueXY({
        x: props.myLocation != null ? props.myLocation[0] : 105.82479740871187,
        y: props.myLocation != null ? props.myLocation[1] : 21.034814987184127,
    })).current;

    // let index = 0;
    // const indexRef = useRef(0);
    let index = 0;
    const shapeSourceRef = useRef(null);

    let stopTimeout = null;

    useEffect(async () => {
        if (props.myLocation) {
            setNavigationLocation([props.myLocation[0], props.myLocation[1]])
        }
        const onChange = ({ window }) => setDimensions(window);
        const subscription = Dimensions.addEventListener("change", onChange);

        return () => {
            subscription?.remove();
        };
    }, []);

    useEffect(() => {

        const normalizedHeadingMarker = (headingMarker + 360) % 360;
        const normalizedMapHeading = (props.mapHeading + 360) % 360;
        const newHeading = (normalizedHeadingMarker - normalizedMapHeading + 360) % 360;
        setAdjustedHeading(newHeading);
        // console.log("-------heading=============", newHeading)
    }, [headingMarker, props.mapHeading]);

    // useEffect(() => {
    //     Animated.timing(animatedCoords, {
    //         toValue: { x: navigationLocation[0], y: navigationLocation[1] },
    //         duration: 1000,
    //         easing: Easing.linear,
    //         useNativeDriver: false,
    //     }).start();

    //     // Cập nhật trực tiếp ShapeSource bằng setNativeProps để tránh re-render
    //     animatedCoords.addListener(({ x, y }) => {
    //         if (shapeSourceRef.current) {
    //             shapeSourceRef.current.setNativeProps({
    //                 shape: {
    //                     type: 'Feature',
    //                     geometry: {
    //                         type: 'Point',
    //                         coordinates: [x, y],
    //                     },
    //                 },
    //             });
    //         }
    //     });

    //     return () => {
    //         animatedCoords.removeAllListeners();
    //     };
    // }, [navigationLocation]);

    useEffect(() => {
        // if (props.isRouting) {
        // console.log("========================", props.isRouteNavigation)
        if (props.myLocation) {
            if (watchId.current === null) {
                watchId.current = Geolocation.watchPosition(
                    (position) => {
                        // console.log("============màn==========", props.isRouteNavigation)
                        const { longitude, latitude, heading, speed, altitudeAccuracy, accuracy } = position.coords;
                        // let remainingDistance;
                        // console.log("___________Okeeee_________", altitudeAccuracy)
                        props.getAccuracy(accuracy)

                        //nếu độ chính xác GPS <10m thì mới tính
                        // if (accuracy < 10) {
                        props.updateMyLocation([longitude, latitude])
                        setHeadingMarker(heading);


                        if (props.routeResult != null) {

                            if (Array.isArray(props.navigationToArray)) {
                                // console.log("________________--props.navigationToArray_________", props.navigationToArray)

                                let check = true;
                                if (!props.routeResult[0].legs[(props.endLocationIndex + 1)]) {
                                    if (props.isRouting) {
                                        props.updateIsEndPoint(true)
                                    }
                                    check = false;
                                }
                                if (check) {
                                    const remainingDistance = haversineDistance([props.routeResult[0].legs[(props.endLocationIndex + 1)].end_location.lng, props.routeResult[0].legs[(props.endLocationIndex + 1)].end_location.lat], [longitude, latitude])
                                    if (remainingDistance < constants.MIN_DISTANCE_END) {
                                        // props.updateIsRouting(false)
                                        if (props.routeResult[0].legs[(props.endLocationIndex + 1)]) {
                                            props.updateEndLocationIndex((props.endLocationIndex + 1))
                                        } else {
                                            if (props.isRouting) {
                                                props.updateIsEndPoint(true)
                                            }
                                        }
                                    }
                                }
                            } else {
                                const remainingDistance = haversineDistance([props.routeResult[0].legs[0].end_location.lng, props.routeResult[0].legs[0].end_location.lat], [longitude, latitude])
                                if (remainingDistance < constants.MIN_DISTANCE_END) {
                                    // props.updateIsRouting(false)
                                    if (props.isRouting) {
                                        props.updateIsEndPoint(true)
                                    }
                                }
                            }
                        }
                        props.updateSpeed(Math.floor((speed > 0 ? speed : 0) * constants.CONVERT_SPEED_M_TO_KM))
                        // Thiết lập lại thời gian dừng
                        if (Math.floor((speed > 0 ? speed : 0) * constants.CONVERT_SPEED_M_TO_KM) < 2) {
                            if (stopTimeout) clearTimeout(stopTimeout);

                            stopTimeout = setTimeout(() => {
                                props.updateSpeed(0); // Đặt tốc độ về 0 nếu không có cập nhật mới
                                props.getSpeed(0)
                                setIsMove(false)
                            }, 2000); // 2000ms tương đương với 2 giây
                        }

                        setNavigationLocation([longitude, latitude]);
                        // setHeading(heading);
                        if (!props.isEndPoint && props.isRouting && props.routeResult != null && props.routeResult[0].legs.length > (props.endLocationIndex + 1)) {
                            // console.log('____________đang đi_________', props.routeResult[0].legs[(props.endLocationIndex + 1)].steps[index])
                            // if (props.routeResult[0].legs[(props.endLocationIndex + 1)].steps.length < index) {
                            const currentLocation = {
                                latitude: latitude,
                                longitude: longitude,
                            };
                            // console.log('_______test========_____-', props.routeResult[0].legs[(props.endLocationIndex + 1)].steps[index])
                            // if (props.routeResult[0].legs[(props.endLocationIndex + 1)].steps[index]) {
                            const distanceSetPitch = getDistance(
                                { latitude: latitude, longitude: longitude },
                                { latitude: props.routeResult[0].legs[(props.endLocationIndex + 1)].steps[index].end_location.lat, longitude: props.routeResult[0].legs[(props.endLocationIndex + 1)].steps[index].end_location.lng }
                            );
                            // xử lý thay góc hiển thị map khi đến step
                            // console.log("_________về giwuax___________", props.isReturn);
                            if (distanceSetPitch < constants.DISTANCE_SET_PITCH) {
                                if (props.isReturn) {
                                    if (props.camera.current &&
                                        typeof currentLocation.longitude === 'number' &&
                                        typeof currentLocation.latitude === 'number') {
                                        props.camera.current.setCamera({
                                            centerCoordinate: [
                                                currentLocation.longitude,
                                                currentLocation.latitude
                                            ],
                                            zoomLevel: 17,
                                            animationMode: "linear",
                                            heading: heading,
                                            animationDuration: 1200,
                                            pitch: 30,
                                            padding: isPortrait ? {
                                                paddingTop: dimensions.height / 2,
                                            } : {
                                                paddingLeft: dimensions.width / 2,
                                                paddingTop: dimensions.height / 2,
                                            },
                                        });
                                        props.updateIsProgram(true);
                                        // setPitchMarker(30);
                                    }
                                }
                            } else {
                                if (props.isReturn) {
                                    if (props.camera.current &&
                                        typeof currentLocation.longitude === 'number' &&
                                        typeof currentLocation.latitude === 'number') {

                                        props.camera.current.setCamera({
                                            centerCoordinate: [
                                                currentLocation.longitude,
                                                currentLocation.latitude
                                            ],
                                            zoomLevel: 17,
                                            animationMode: "linear",
                                            heading: heading,
                                            animationDuration: 1200,
                                            pitch: 120,
                                            padding: isPortrait ? {
                                                paddingTop: dimensions.height / 2,
                                            } : {
                                                paddingLeft: dimensions.width / 2,
                                                paddingTop: dimensions.height / 2,
                                            },
                                        });
                                        props.updateIsProgram(true);
                                    }
                                    // setPitchMarker(60);
                                }
                            }
                            // if (!props.isEndPoint) {
                            checkStepReached(currentLocation, heading, distanceSetPitch);
                            props.updateMyLocation([longitude, latitude]);
                            if (props.routeResult != null) {
                                getRoute(props.routeResult[0].overview_polyline.points, currentLocation)

                            }
                            // }
                            // }
                            // }
                            props.updateIsLoad(true);
                        }
                        if (!props.isRouteNavigation && props.isReturn && Math.floor(speed * constants.CONVERT_SPEED_M_TO_KM) > 0 && !props.isRouting) {
                            if (props.camera.current) {
                                props.updateIsProgram(true);
                                props.camera.current.setCamera({
                                    animationMode: "linear",
                                    animationDuration: 1000,
                                    // sửa lại để kéo map theo marker
                                    centerCoordinate: [
                                        longitude,
                                        latitude
                                    ],
                                    heading: heading,
                                    zoomLevel: 17,
                                    padding: isPortrait ? {
                                        paddingTop: 0,
                                    } : {
                                        paddingLeft: dimensions.width / 2,
                                        paddingTop: dimensions.height / 2,
                                    },
                                });
                            }
                            props.getSpeed(Math.floor(speed * constants.CONVERT_SPEED_M_TO_KM))
                            setIsMove(true)
                        } else {
                            props.getSpeed(0)
                            setIsMove(false)
                        }
                        // }
                    },
                    (error) => {
                        Alert.alert(
                            i18n.t("alert.attributes.warning"),
                            error.message || i18n.t("alert.attributes.warning"),
                            [
                                { text: i18n.t("alert.attributes.oke") },
                            ]
                        );
                    },
                    {
                        enableHighAccuracy: true,
                        // khoảng cách tối thiểu mà thiết bị cần di chuyển trước khi một bản cập nhật vị trí được kích hoạt
                        distanceFilter: 100,
                        //khoảng thời gian giữa các lần cập nhật vị trí
                        interval: 10,
                        //khoảng thời gian tối thiểu giữa các lần cập nhật vị trí
                        fastestInterval: 0,
                    }
                );
            }
            // Cleanup khi component bị hủy
            return () => {
                if (watchId.current !== null) {
                    Geolocation.clearWatch(watchId.current);
                    watchId.current = null;
                }
            };
        }
    }, [index, dimensions, props.isReturn, props.isRouting, props.endLocationIndex, props.isMapLoaded, props.routeResult, props.isRouteNavigation]); // Theo dõi sự thay đổi của isRouting

    const checkStepReached = (currentLocation, heading, distance) => {
        // console.log("_______-dang check_______")
        // let index = 0
        try {
            if (props.routeResult != null) {
                if (props.routeResult[0]) {
                    if (props.endLocationIndex < props.routeResult[0].legs.length) {
                        // for (let leg of props.routeResult[0].legs) {
                        // console.log("___________leg_________", index)
                        // }
                        if (index < props.routeResult[0].legs[(props.endLocationIndex + 1)].steps.length) {
                            // const distance = getDistance(
                            //     { latitude: currentLocation.latitude, longitude: currentLocation.longitude },
                            //     { latitude: props.routeResult[0].legs[(props.endLocationIndex + 1)].steps[index].end_location.lat, longitude: props.routeResult[0].legs[(props.endLocationIndex + 1)].steps[index].end_location.lng }
                            // );
                            let distanceSteps = 0

                            if (distance < constants.DISTANCE_REROUTING) {
                                for (let i = (index + 1); i < props.routeResult[0].legs[(props.endLocationIndex + 1)].steps.length; i++) {
                                    distanceSteps = distanceSteps + props.routeResult[0].legs[(props.endLocationIndex + 1)].steps[i].distance.value
                                }
                                index++;
                            } else {
                                // console.log("+++++++++++chưa tói++++++++++++")
                                for (let i = (index + 1); i < props.routeResult[0].legs[(props.endLocationIndex + 1)].steps.length; i++) {
                                    distanceSteps = distanceSteps + props.routeResult[0].legs[(props.endLocationIndex + 1)].steps[i].distance.value
                                }
                            }

                            props.updateRemainingDistance((distance + distanceSteps))

                            if (index < props.routeResult[0].legs[(props.endLocationIndex + 1)].steps.length) {

                                // lấy ra line string của step đang đi
                                const decodedRoute = decodePolyline(props.routeResult[0].legs[(props.endLocationIndex + 1)].steps[index].polyline.points);
                                // console.log("________stedp_______", decodedRoute)
                                if (decodedRoute.length > 1) {
                                    const line = turf.lineString(decodedRoute);
                                    const userLocation = turf.point([currentLocation.longitude, currentLocation.latitude]);
                                    // Tìm điểm gần nhất  trên đường tính từ vị trí cảu tôi
                                    const nearestPoint = turf.nearestPointOnLine(line, userLocation);
                                    // Tính khoảng cách
                                    const distanceRerouting = turf.distance(userLocation, nearestPoint, { units: 'meters' });
                                    // console.log("__________________đến đường_____________", distanceRerouting)
                                    if (distanceRerouting > constants.DISTANCE_REROUTING) {
                                        // throttledTest(currentLocation)
                                        throttledRerouting(currentLocation, props.myLocation, props.navigationToArray, props.endLocationIndex)
                                    }
                                }
                                // else {
                                //     setIsCallAPI(true)
                            }
                            // }
                        } else {
                            index = 0
                        }
                        props.updateStepIndex(index);
                    }
                }
            }
        } catch (error) {
            console.log("______________checkStepReached________________", error)
        }
    };

    const rerouting = (currentLocation, myLocation, toArray, endIndex) => {
        try {
            const oldLocation = turf.point([myLocation[0], myLocation[1]]);
            const newLocation = turf.point([currentLocation.longitude, currentLocation.latitude]);
            const distance = turf.distance(oldLocation, newLocation, { units: "meters" });
            // console.log("=========test====================-0=====", distance)
            // setIsCallAPI(false)
            if (distance > 5) {
                props.updateNavigationFrom({
                    location: {
                        lat: currentLocation.latitude,
                        lng: currentLocation.longitude
                    }
                })
                if (toArray.length > 0) {
                    const newArray = toArray.slice((endIndex + 1))
                    props.updateNavigationToArray(newArray)
                }
                index = 0;
                props.updateEndLocationIndex(-1);
            }
        } catch (error) {
            console.log("______________rerouting________________", error)

        }
    }

    // Tạo hàm throttle
    const throttledRerouting = useCallback(
        throttle((currentLocation, myLocation, toArray, endIndex) => rerouting(currentLocation, myLocation, toArray, endIndex), 3000), // Giới hạn gọi hàm mỗi 2 giây
        []
    );

    const getRoute = (line, currentLocation) => {
        try {
            // Kiểm tra xem tọa độ có hợp lệ không
            if (typeof currentLocation.longitude !== 'number' || typeof currentLocation.latitude !== 'number') {
                console.error("Tọa độ không hợp lệ:", currentLocation);
                return;
            }

            // Đổi mã sang dạng mảng tọa độ
            const decodedLine = decodePolyline(line);
            const lineString = turf.lineString(decodedLine);

            const point = turf.point([currentLocation.longitude, currentLocation.latitude]);
            // console.log("________point_________", point);

            // Lấy ra điểm trên linestring gần vị trí của tôi nhất
            const nearestPoint = turf.nearestPointOnLine(lineString, point);
            // console.log("________currentLocation__________", nearestPoint);

            // Nếu khoảng cách giữa vị trí của tôi và đường dưới 20m thì snap vào đường
            props.getDistanceMarker(nearestPoint.properties.dist);
            if (nearestPoint.properties.dist < constants.DISTANCE_SNAP_MARKER) {
                setNavigationLocation(nearestPoint.geometry.coordinates);
            }

            // Cắt linestring
            const slicedLine = turf.lineSlice(lineString.geometry.coordinates[0], nearestPoint, lineString);
            setLineString(slicedLine.geometry.coordinates);
        } catch (error) {
            console.log("_____________getRoute_________________", error);
        }
    };

    // Hàm chia nhỏ LineString và tìm điểm gần nhất
    const getNearestPointOnLine = (line, point) => {
        const lineString = turf.lineString(line);
        const targetPoint = turf.point(point);

        // Chia line thành các đoạn nhỏ
        const segmentLength = 1000; // độ dài đoạn nhỏ (m)
        let nearestPoint = null;

        for (let i = 0; i < line.length - 1; i++) {
            const segment = [line[i], line[i + 1]];
            const segmentLineString = turf.lineString(segment);

            // Kiểm tra điểm gần nhất trên từng đoạn nhỏ
            const pointOnSegment = turf.nearestPointOnLine(segmentLineString, targetPoint);

            if (!nearestPoint || pointOnSegment.properties.dist < nearestPoint.properties.dist) {
                nearestPoint = pointOnSegment;
            }
        }

        return nearestPoint;
    };


    return (
        <>
            {(props.isRouting || isMove) && !props.isEndPoint && props.showScreen != "searchDirections" && navigationLocation.length == 2 && typeof navigationLocation[0] === 'number' && typeof navigationLocation[1] === 'number' && (
                <MapLibreGL.ShapeSource id="navigation_source"
                    ref={shapeSourceRef}
                    shape={{
                        type: 'Feature',
                        geometry: {
                            type: 'Point',
                            coordinates: [
                                // animatedCoords.x.__getValue(),
                                // animatedCoords.y.__getValue(),
                                navigationLocation[0],
                                navigationLocation[1]
                            ],
                        },
                        properties: {
                            bearing: isMove ? adjustedHeading : 0, // Hướng của mũi tên
                        },
                    }}>
                    <MapLibreGL.SymbolLayer
                        id="navigation_source"
                        style={{
                            iconImage: 'navigation-icon',
                            iconSize: 0.15,
                            iconRotationAlignment: 'viewport',
                            iconPitchAlignment: 'map',
                            iconAllowOverlap: true,
                            iconRotate: ['get', 'bearing'], // Xoay biểu tượng theo hướng

                        }}
                    />
                </MapLibreGL.ShapeSource>
            )}
            {lineString.length > 1 && props.isRouting && !props.isEndPoint && (
                <MapLibreGL.ShapeSource id={`navigation_line_below`} shape={{
                    type: "Feature",
                    geometry: {
                        type: "LineString",
                        coordinates: lineString,
                    },
                }}>
                    <MapLibreGL.LineLayer
                        id={`navigation_line_below`}
                        sourceID="navigation_line_below"
                        style={{
                            lineJoin: 'round',
                            lineCap: 'round',
                            lineColor: 'rgba(128, 128, 128,0.7)',
                            lineWidth: 12,
                        }}
                        aboveLayerID={"navigation_line"}
                        belowLayerID={Platform.OS === "android" ? "com.mapbox.annotations.points" : undefined}
                    />
                </MapLibreGL.ShapeSource>
            )}
        </>
    )
}

function mapStateToProps(state) {
    return {
        myLocation: state.app.myLocation,
        isRouting: state.app.isRouting,
        isEndPoint: state.app.isEndPoint,
        navigationToArray: state.app.navigationToArray,
        endLocationIndex: state.app.endLocationIndex,
        routeResult: state.app.routeResult,
        stepIndex: state.app.stepIndex,
        navigationFrom: state.app.navigationFrom,
        showScreen: state.app.showScreen,
        isReturn: state.app.isReturn,

    };
}
const mapDispatchToProps = (dispatch) => ({
    updateIsEndPoint: (isEndPoint) => dispatch(appAction.isEndPoint(isEndPoint)),
    updateSpeed: (speed) => dispatch(appAction.speed(speed)),
    updateEndLocationIndex: (endLocationIndex) => dispatch(appAction.endLocationIndex(endLocationIndex)),
    updateMyLocation: (myLocation) => dispatch(appAction.myLocation(myLocation)),
    updateRemainingDistance: (remainingDistance) => dispatch(appAction.remainingDistance(remainingDistance)),
    updateStepIndex: (stepIndex) => dispatch(appAction.stepIndex(stepIndex)),
    updateNavigationFrom: (from) => dispatch(appAction.navigationFrom(from)),
    updateNavigationToArray: (navigationToArray) => dispatch(appAction.navigationToArray(navigationToArray)),
    updateIsProgram: (isProgram) => dispatch(appAction.isProgram(isProgram)),
    updateIsLoad: (isLoad) => dispatch(appAction.isLoad(isLoad)),
});
export default connect(mapStateToProps, mapDispatchToProps)(Navigation);