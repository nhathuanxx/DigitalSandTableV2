import {
    Alert,
    View,
    Image,
} from "react-native";
import { connect } from "react-redux";
import React, { Fragment, useState, useRef, useEffect } from "react";
import * as appAction from "@app/storage/action/app";
import MapLibreGL from "@maplibre/maplibre-react-native";
import { useGetPlaceDetail, useGetPlaceDetailFromAddress } from "@app/hooks/place_detail.hook";
import i18n from "@app/i18n/i18n";
import { Images, Metrics } from "@app/theme";

const Place = (props) => {
    const [locationPlace, setLocationPlace] = useState([]);

    const useFetchGetPlaceDetail = useGetPlaceDetail();
    const useFetchGetPlaceDetailFromAddress = useGetPlaceDetailFromAddress();

    useEffect(async () => {
        // const currentRoute = useNavigationState(state => state.routeNames);


        try {
            if (props.place != null && !props.navigationFrom && !props.navigationTo) {
                // console.log("_______props.place________", props.place.location)
                if (props.place.location || props.place.geometry) {

                    let placeLocation = [];

                    if (props.place.location) {
                        placeLocation = [props.place.location.lng, props.place.location.lat];
                    } else {
                        placeLocation = [props.place.geometry.location.lng, props.place.geometry.location.lat];
                    }
                    setLocationPlace(placeLocation);
                    props.updateMapView({
                        location: placeLocation,
                        zoom: 16,
                    })
                    if (props.camera.current) {
                        props.camera.current.setCamera({
                            centerCoordinate: placeLocation,
                        });
                    }
                } else {
                    // console.log("__________-plac66e__________", props.place)
                    const paramsPlace = {
                        address: props.place.description,
                    };
                    const response = await useFetchGetPlaceDetailFromAddress.mutateAsync(paramsPlace);
                    const place = response.results[0];
                    setLocationPlace([place.geometry.location.lng, place.geometry.location.lat]);
                    props.updateMapView({
                        location: [place.geometry.location.lng, place.geometry.location.lat],
                        zoom: 16,
                    })
                }
            } else {
                setLocationPlace([])
            }
        } catch (error) {
            // Hiển thị thông báo lỗi
            Alert.alert(
                i18n.t("alert.attributes.warning"),
                `${i18n.t("alert.attributes.warning")} (Place-useEffect):${error.message}`,
                [
                    { text: i18n.t("alert.attributes.oke") },
                ]
            );
        }
    }, [props.place]);

    return (
        <>
            {locationPlace.length > 1 && props.routeResult == null && (
                <MapLibreGL.ShapeSource id="place_source" shape={{
                    type: 'Feature',
                    geometry: {
                        type: 'Point',
                        coordinates: locationPlace,
                    },
                }}>
                    <MapLibreGL.SymbolLayer
                        id="place_source"
                        style={{
                            iconImage: 'place-icon',
                            iconSize: 0.1,
                            iconRotationAlignment: 'viewport',
                            // iconRotate: ['get', 'bearing'],
                            iconAllowOverlap: true,
                        }}
                    />
                </MapLibreGL.ShapeSource>
            )}
        </>
    )
}

function mapStateToProps(state) {
    return {
        place: state.app.place,
        routeResult: state.app.routeResult,
        navigationToArray: state.app.navigationToArray,
        navigationFrom: state.app.navigationFrom,
        navigationTo: state.app.navigationTo,
    };
}
const mapDispatchToProps = (dispatch) => ({
    updateMapView: (mapView) => dispatch(appAction.mapView(mapView)),
});
export default connect(mapStateToProps, mapDispatchToProps)(Place);
