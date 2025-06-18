import { connect } from "react-redux";
import React, { Fragment, useState, useRef, useEffect } from "react";
import * as appAction from "@app/storage/action/app";
import MapLibreGL from "@maplibre/maplibre-react-native";
import {
  Alert,
} from "react-native";
import Marker from "../Marker/Marker";
import i18n from "../../../../i18n/i18n";

const MyLocation = (props) => {
  const [currentLocation, setCurrentLocation] = useState([
    105.819, 21.0335
  ]);

  useEffect(() => {
    try {
      if (props.speed == 0 && !props.place && props.routeResult == null && props.isMove == false && !props.initFitBound && !props.navigationFrom && !props.navigationTo && !props.isDeepLink
        && props.cameraLocations.length === 0) {
        // console.log("__________speed______", props.speed)
        if (props.myLocation) {
          props.updateMapView({
            location: [props.myLocation[0], props.myLocation[1]],
            zoom: 16,
          })
          // console.log('update mapview ---------');
        } else {
          props.updateMapView({
            location: currentLocation
          })
          // console.log('update mapview ---------');
        }
      }
    } catch (error) {
      // Hiển thị thông báo lỗi
      Alert.alert(
        i18n.t("alert.attributes.warning"),
        `${i18n.t("alert.attributes.warning")} (MyLocation-useEffect):${error.message}`,
        [
          { text: i18n.t("alert.attributes.oke") },
        ]
      );
    }
  }, [props.myLocation, props.place, props.routeResult, props.isMove, props.cameraLocations, props.navigationFrom, props.navigationTo, props.isDeepLink])

  return (
    <>
      {props.myLocation && (!props.isRouting || props.isEndPoint) && props.speed == 0 && (
        // <MapLibreGL.PointAnnotation id="myLocation" coordinate={props.myLocation}>
        //   <Marker type={'myLocation'} />
        // </MapLibreGL.PointAnnotation>
        <MapLibreGL.ShapeSource id="my_location_source" shape={{
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: props.myLocation,
          },
        }}>
          <MapLibreGL.CircleLayer
            id="circle_layer"
            style={{
              circleRadius: 50, // Bán kính vòng tròn (đơn vị pixel)
              circleColor: 'rgba(0, 122, 255, 0.2)', // Màu sắc vòng tròn
              circlePitchAlignment: 'map',
            }}
          />
          <MapLibreGL.SymbolLayer
            id="my_location_source"
            style={{
              iconImage: 'my-location-icon',
              iconSize: 0.05,
              iconRotationAlignment: 'map',
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
    myLocation: state.app.myLocation,
    isRouting: state.app.isRouting,
    isEndPoint: state.app.isEndPoint,
    place: state.app.place,
    routeResult: state.app.routeResult,
    cameraLocations: state.app.cameraLocations,
    navigationFrom: state.app.navigationFrom,
    navigationTo: state.app.navigationTo,
    isDeepLink: state.app.isDeepLink,
  };
}
const mapDispatchToProps = (dispatch) => ({
  updateMapView: (mapView) => dispatch(appAction.mapView(mapView)),
});
export default connect(mapStateToProps, mapDispatchToProps)(MyLocation);
