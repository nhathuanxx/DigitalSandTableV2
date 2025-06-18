import {
  Image,
  View,
} from "react-native";
import { connect } from "react-redux";
import React, { Fragment, useState, useRef, useEffect } from "react";
import * as appAction from "@app/storage/action/app";
import MapLibreGL from "@maplibre/maplibre-react-native";
import { useGetPlaceDetail } from "@app/hooks/place_detail.hook";
import i18n from "@app/i18n/i18n";
import { Colors as Themes, Images } from "@app/theme";
import styles from "../styles";
import { useTheme } from "@app/modules/components/context/ThemeContext";

const CameraLocation = (props) => {

  const { isDarkTheme } = useTheme();
  const Colors = Themes[isDarkTheme ? 'darkMode' : 'lightMode'];

  const onSelectCamera = (location) => {
    props.handleSelectCamera(location);
  }

  const isCameraCurrent = (location) => {
    // console.log(props.cameraLocationSelected + ' ---- ' + location)
    const check = props.cameraLocationSelected[0] - location.longitude === 0 &&
      props.cameraLocationSelected[1] - location.latitude === 0;
    // console.log('check ========== ', check);
    return check;
  }

  return (
    <>
      {props.cameraListVisible.length > 0 &&
        props.cameraListVisible.slice(0, 50).map((location, index) => {
          const { longitude, latitude } = location;
          const key = `${(props.cameraLocationSelected[0] || longitude)}-${latitude}${index}`;
          return (
            <MapLibreGL.PointAnnotation
              id={longitude.toString()}
              coordinate={[longitude, latitude]}
              onSelected={() => onSelectCamera(location)}
              key={key}
              anchor={{ x: 0.5, y: 1 }}
            >
              <View key={key}>
                <Image source={Images.cameraLocation}
                  key={key}
                  style={[
                    styles.iconCameraLocation,
                    { tintColor: isCameraCurrent(location) ? Colors.red : Colors.textGrey }
                  ]}
                />
              </View>
            </MapLibreGL.PointAnnotation>
          )
        })
      }
    </>
  )
}

function mapStateToProps(state) {
  return {
    // myLocation: state.app.myLocation,
    mapView: state.app.mapView,
    cameraLocations: state.app.cameraLocations,
    cameraLocationSelected: state.app.cameraLocationSelected
  };
}
const mapDispatchToProps = (dispatch) => ({
  updateMapView: (mapView) => dispatch(appAction.mapView(mapView)),
  updateCameraLocations: (cameraLocations) => dispatch(appAction.cameraLocations(cameraLocations)),
  updateCameraLocationSelected: (cameraLocationSelected) => dispatch(appAction.cameraLocationSelected(cameraLocationSelected)),
});
export default connect(mapStateToProps, mapDispatchToProps)(CameraLocation);
