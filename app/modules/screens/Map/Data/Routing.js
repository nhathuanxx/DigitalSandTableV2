import {
    Alert,
} from "react-native";
import { connect } from "react-redux";
import React, { useState, useEffect, useCallback } from "react";
import * as appAction from "@app/storage/action/app";
import MapLibreGL from "@maplibre/maplibre-react-native";
import i18n from "@app/i18n/i18n";
import Marker from "../Marker/Marker";
import { useGetDirection } from "@app/hooks/place_detail.hook";
import { decodePolyline, getBoundsFromCoordinates } from '@app/libs/utils.js'
import { Colors } from "@app/theme";
import throttle from 'lodash/throttle';
import { debounce } from 'lodash';
import * as turf from '@turf/turf';
import constants from "@app/config/constants";


const Routing = (props) => {
    const [arrayLocationTo, setArrayLocationTo] = useState([]);
    const [locationFrom, setLocationFrom] = useState([]);
    const [locationTo, setLocationTo] = useState([]);
    const [coordinatesNavigation, setCoordinatesNavigation] = useState(null);
    const [coordinatesWalk, setCoordinatesWalk] = useState(null);
    const [arrowData, setArrowData] = useState(null);

    const useFetchGetDirection = useGetDirection();
    // Lấy ra đường nếu có cả from và to
    useEffect(() => {
        try {
            const fetchDirection = async () => {
                props.updateIsLoad(false);
                // props.updateEndLocationIndex(-1)
                if (props.navigationToArray.length > 0) {
                    if (props.navigationToArray.length >= 1) {
                        // const from = await getPlaceDetail(props.navigationFrom)
                        setCoordinatesNavigation(null)
                        let arrayToLatLong = [];
                        let end;
                        for (let navigationToItem of props.navigationToArray) {
                            arrayToLatLong.push(navigationToItem.location ? navigationToItem.location : navigationToItem.geometry.location)
                            end = navigationToItem;
                        }
                        setArrayLocationTo(arrayToLatLong)
                        const direction = await throttledGetDirection(props.navigationFrom, arrayToLatLong, props.vehicle);
                        props.updateRouteResult(direction.routes)
                        // console.log("_____________đường+++++++++=", direction.routes[0])
                        const route = direction.routes[0].overview_polyline.points;
                        debouncedGetRoute(route, props.navigationFrom, end, props.isRouting);
                    } else {
                        setArrayLocationTo([])
                    }
                } else {
                    setArrayLocationTo([])
                    if (props.navigationFrom && props.navigationTo) {
                        const direction = await throttledGetDirection(props.navigationFrom, props.navigationTo, props.vehicle)
                        props.updateRouteResult(direction.routes)
                        const route = direction.routes[0].overview_polyline.points;
                        debouncedGetRoute(route, props.navigationFrom, props.navigationTo, props.isRouting);
                    }
                }
            }
            fetchDirection();
        } catch (error) {
            // Hiển thị thông báo lỗi
            Alert.alert(
                i18n.t("alert.attributes.warning"),
                `${i18n.t("alert.attributes.warning")} (Routing-useEffect):${error.message}`,
                [
                    { text: i18n.t("alert.attributes.oke") },
                ]
            );
        }
    }, [props.navigationFrom, props.navigationTo, props.vehicle, props.navigationToArray])

    useEffect(async () => {
        if (props.navigationFrom) {
            setLocationFrom([props.navigationFrom.location ? props.navigationFrom.location.lng : props.navigationFrom.geometry.location.lng, props.navigationFrom.location ? props.navigationFrom.location.lat : props.navigationFrom.geometry.location.lat]);
        } else {
            setLocationFrom([])
            setCoordinatesNavigation(null)
            setCoordinatesWalk(null)
            // setCurrentLocation([])
            props.updateRouteResult(null)
            // setSteps(null)
        }
    }, [props.navigationFrom])

    useEffect(async () => {
        if (props.navigationTo) {
            setLocationTo([props.navigationTo.location ? props.navigationTo.location.lng : props.navigationTo.geometry.location.lng, props.navigationTo.location ? props.navigationTo.location.lat : props.navigationTo.geometry.location.lat])
        } else {
            setLocationTo([])
            setCoordinatesNavigation(null)
            setCoordinatesWalk(null)
            // setCurrentLocation([])
            props.updateRouteResult(null)
            // setSteps(null)
        }
    }, [props.navigationTo])

    // gọi api direction
    const getDirection = async (from, to, vehicle) => {
        try {
            // console.log("________from_______-", to)
            let direction = null;
            const locationFrom = from.location ? from.location : from.geometry.location;
            let locationTo = ""
            if (Array.isArray(to)) {
                for (let item of to) {
                    locationTo += `${item.lat},${item.lng};`
                }
                if (locationTo.endsWith(';')) {
                    locationTo = locationTo.slice(0, -1);
                }
            } else {
                console.log("________to_______", to)
                locationTo = `${to.location ? to.location.lat : to.geometry.location.lat},${to.location ? to.location.lng : to.geometry.location.lng}`
            }
            const params = {
                locationFrom: `${locationFrom.lat},${locationFrom.lng}`,
                locationTo: locationTo,
                vehicle: vehicle,
            };

            try {
                const response = await useFetchGetDirection.mutateAsync(params);
                direction = response;
            } catch (error) {
                // Hiển thị thông báo lỗi
                Alert.alert(
                    i18n.t("alert.attributes.warning"),
                    error.message || i18n.t("alert.attributes.warning"),
                    [
                        { text: i18n.t("alert.attributes.oke") },
                    ]
                );
            }
            return direction;
        } catch (error) {
            // Hiển thị thông báo lỗi
            Alert.alert(
                i18n.t("alert.attributes.warning"),
                `${i18n.t("alert.attributes.warning")} (Routing-getDirection):${error.message}`,
                [
                    { text: i18n.t("alert.attributes.oke") },
                ]
            );
        }
    }

    const getRoute = (route, from, to, isNavigation) => {

        try {
            console.log("_______________vẽ_________________", isNavigation)

            const decodedRoute = decodePolyline(route);
            // data để vẽ đường đi của các phương tiện ô tô, xe máy,...
            const dataVehicle = {
                type: 'Feature',
                properties: {},
                geometry: {
                    type: 'LineString',
                    coordinates: decodedRoute
                }
            }
            setCoordinatesNavigation(dataVehicle);
            const arrow = calculateArrows(decodedRoute, constants.DISTANCE_BETWEEN_ARROW);
            setArrowData(arrow);
            // Data vẽ đường đi bộ

            // if (from.place_id != to.result.place_id) {
            //     let dataWalk = []
            //     let walkCoordinates = []
            //     walkCoordinates.push({
            //         type: "LineString",
            //         coordinates: [
            //             [
            //                 dataVehicle.geometry.coordinates[0][0],
            //                 dataVehicle.geometry.coordinates[0][1],
            //             ],
            //             [
            //                 from.result.geometry.location.lng,
            //                 from.result.geometry.location.lat,
            //             ],
            //         ],
            //     })
            //     walkCoordinates.push({
            //         type: "LineString",
            //         coordinates: [
            //             [
            //                 dataVehicle.geometry.coordinates[
            //                 dataVehicle.geometry.coordinates.length - 1
            //                 ][0],
            //                 dataVehicle.geometry.coordinates[
            //                 dataVehicle.geometry.coordinates.length - 1
            //                 ][1],
            //             ],
            //             [
            //                 to.result.geometry.location.lng,
            //                 to.result.geometry.location.lat,
            //             ],
            //         ],
            //     })
            //     walkCoordinates.map((item, index) => {
            //         dataWalk.push({
            //             type: "Feature",
            //             properties: {},
            //             geometry: item,
            //         })
            //     })
            //     setCoordinatesWalk(dataWalk)
            // }
            // set Camera để đường nằm trong màn hinhf
            // camera.current.fitBounds([from.result.geometry.location.lng, from.result.geometry.location.lat], [to.result.geometry.location.lng, to.result.geometry.location.lat], [260, 50, 200, 50], 1000); // padding=50, animationDuration=2000
            if (!isNavigation) {
                const bounds = getBoundsFromCoordinates(decodedRoute);
                props.fitBounds(bounds)
            }
        } catch (error) {
            // Hiển thị thông báo lỗi
            Alert.alert(
                i18n.t("alert.attributes.warning"),
                `${i18n.t("alert.attributes.warning")} (Routing-getRoute):${error.message}`,
                [
                    { text: i18n.t("alert.attributes.oke") },
                ]
            );
        }
    }

    const calculateArrows = (lineCoordinates, minInterval) => {
        try {
            const arrowFeatures = [];
            let lastAddedPoint = lineCoordinates[0]; // Điểm đầu tiên

            for (let i = 1; i < lineCoordinates.length; i++) {
                const start = lastAddedPoint;
                const end = lineCoordinates[i];

                // Tính khoảng cách giữa điểm cuối cùng và điểm hiện tại
                const distance = turf.distance(turf.point(start), turf.point(end), { units: 'meters' });

                if (distance >= minInterval) {
                    // Tính bearing (hướng) giữa hai điểm
                    const bearing = turf.bearing(turf.point(start), turf.point(end));

                    // Thêm điểm vào arrowFeatures
                    arrowFeatures.push({
                        type: 'Feature',
                        geometry: {
                            type: 'Point',
                            coordinates: start,
                        },
                        properties: {
                            bearing: bearing, // Hướng của mũi tên
                        },
                    });

                    // Cập nhật điểm cuối cùng đã thêm
                    lastAddedPoint = end;
                }
            }

            return {
                type: 'FeatureCollection',
                features: arrowFeatures,
            };
        } catch (error) {
            // Hiển thị thông báo lỗi
            Alert.alert(
                i18n.t("alert.attributes.warning"),
                `${i18n.t("alert.attributes.warning")} (Routing-calculateArrows):${error.message}`,
                [
                    { text: i18n.t("alert.attributes.oke") },
                ]
            );
        }
    };

    // Tạo hàm throttle
    // const throttledGetRoute = useCallback(
    //     throttle((route, from, to, isNavigation) => getRoute(route, from, to, isNavigation), 3000), // Giới hạn gọi hàm mỗi 2 giây
    //     []
    // );

    const debouncedGetRoute = useCallback(
        debounce((route, from, to, isNavigation) => getRoute(route, from, to, isNavigation), 500), // Chỉ gọi hàm sau 3 giây từ lần thao tác cuối cùng
        []
    );

    const throttledGetDirection = useCallback(
        throttle(async (from, to, vehicle) => getDirection(from, to, vehicle), 3000), // Giới hạn 2 giây
        []
    );

    // const debouncedGetDirection = useCallback(
    //     debounce(async (from, to, vehicle) => getDirection(from, to, vehicle), 500), // Giới hạn 2 giây
    //     []
    // );

    return (
        <>
            {/* Hiển thị marker điểm bắt đầu */}
            {locationFrom.length > 1 && props.isRouting == false && (
                <MapLibreGL.PointAnnotation id="locationFrom" coordinate={locationFrom} >
                    <Marker type={'start'} />
                </MapLibreGL.PointAnnotation>
            )}
            {/* Hiển thị marker điểm kết thúc */}
            {locationTo.length > 1 && props.navigationToArray.length < 2 && (
                <MapLibreGL.PointAnnotation id="locationTo" coordinate={locationTo} />
            )}
            {arrayLocationTo.length > 0 && arrayLocationTo.map((item, index) => (
                <MapLibreGL.PointAnnotation
                    id={`arrayLocationTo-${index}`}
                    coordinate={[item.lng, item.lat]}
                    key={`arrayLocationTo-${item.lng}-${item.lat}-${index}`}
                >
                    <Marker type="to" index={index + 1} />
                </MapLibreGL.PointAnnotation>
            ))}
            {coordinatesNavigation && !props.isEndPoint && (
                <MapLibreGL.ShapeSource id={`navigation_line`} shape={coordinatesNavigation}>
                    <MapLibreGL.LineLayer
                        id={`navigation_line`}
                        sourceID="navigation_line"
                        style={{
                            lineJoin: 'round',
                            lineCap: 'round',
                            lineColor: 'rgba(0, 0, 255, 0.7)',
                            lineWidth: 12,
                        }}
                        belowLayerID={Platform.OS === "android" ? "com.mapbox.annotations.points" : undefined}
                    />
                </MapLibreGL.ShapeSource>
            )}

            {arrowData && props.isRouting && (
                <MapLibreGL.ShapeSource id="arrow_source" shape={arrowData}>
                    <MapLibreGL.SymbolLayer
                        id="arrow_layer"
                        style={{
                            iconImage: 'arrow-icon', // Định danh của biểu tượng mũi tên
                            iconSize: 0.02, // Kích thước của mũi tên
                            iconRotationAlignment: 'map',
                            iconRotate: ['get', 'bearing'], // Xoay biểu tượng theo hướng
                            iconAllowOverlap: true, // Cho phép biểu tượng chồng lên nhau
                        }}
                    />
                </MapLibreGL.ShapeSource>
            )}

            {/* {coordinatesWalk && coordinatesWalk.map((walk, index) => (
                <MapLibreGL.ShapeSource key={`walk_${index}`} id={`navigation_walk_${index}`} shape={walk}>
                    <MapLibreGL.LineLayer
                        id={`navigation_walk_line_${index}`}
                        style={{
                            lineJoin: 'round',
                            lineCap: 'round',
                            lineColor: Colors.independence,
                            lineWidth: 4,
                            lineDasharray: [0.2, 2],
                            lineOpacity: 1,
                        }}
                    />
                </MapLibreGL.ShapeSource>
            ))} */}
        </>
    )
};

function mapStateToProps(state) {
    return {
        navigationToArray: state.app.navigationToArray,
        navigationFrom: state.app.navigationFrom,
        navigationTo: state.app.navigationTo,
        vehicle: state.app.vehicle,
        isEndPoint: state.app.isEndPoint,
        isRouting: state.app.isRouting,
    };
}
const mapDispatchToProps = (dispatch) => ({
    updateRouteResult: (routeResult) => dispatch(appAction.routeResult(routeResult)),
    updateIsLoad: (isLoad) => dispatch(appAction.isLoad(isLoad)),

});
export default connect(mapStateToProps, mapDispatchToProps)(Routing);
