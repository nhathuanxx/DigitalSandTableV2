import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  AppState,
  FlatList,
  Image,
  Pressable,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Images, Colors as Themes, Metrics } from "@app/theme";
import { useFocusEffect, useNavigation, useRoute } from "@react-navigation/native";
import Video from 'react-native-video';
import i18n from "@app/i18n/i18n";
import { connect } from "react-redux";
import * as appAction from "@app/storage/action/app";
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import { STREAM_URL, IMAGE_URL } from "@app/config/camera";
import ViewShot from 'react-native-view-shot';
import RNFS from 'react-native-fs';
import Header from "../Header";
import Map from "@app/modules/screens/Map/Map";
import ImageWithFallback from "../ImageWithFallback ";
import createStyles from "./styles";
import { useTheme } from "@app/modules/components/context/ThemeContext";
import Orientation from 'react-native-orientation-locker';
import Animated, { SlideInDown, SlideInUp, SlideOutUp } from "react-native-reanimated";
import Camera from "./Camera";
import { useOrientation } from "@app/modules/components/context/OrientationContext";

const CameraDetail = (props) => {

  const { isDarkTheme } = useTheme();
  const { isPortrait, dimensions } = useOrientation();
  const styles = createStyles(isDarkTheme, dimensions.width, dimensions.height);
  const Colors = Themes[isDarkTheme ? 'darkMode' : 'lightMode'];

  const route = useRoute();
  const { province, urlType, data, cameraDetail } = route.params;
  const [camera, setCamera] = useState(cameraDetail);
  const [renderKey, setRenderKey] = useState(0);
  const [zoomLevelIn, setZoomLevelIn] = useState(0);
  const [zoomLevelOut, setZoomLevelOut] = useState(0);
  const [isMyLocation, setIsMyLocation] = useState(true);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isAlertCapture, setIsAlertCapture] = useState(false);
  const [capturePath, setCapturePath] = useState('');


  useEffect(() => {
    if (isAlertCapture) {
      const timer = setTimeout(() => {
        setIsAlertCapture(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [isAlertCapture])

  const handleSelectCamera = (location) => {
    console.log('select location ====== ', location);
    const cameraSelected = data.find(item => item.location
      && item.location.latitude === location.latitude
      && item.location.longitude === location.longitude);
    props.updateCameraLocationSelected([location.longitude, location.latitude])
    setCamera(cameraSelected);
  }

  const handleScreenChange = useCallback(() => {
    if (isFullScreen) {
      Orientation.lockToPortrait();
    } else {
      Orientation.lockToLandscape();
    }
    setIsFullScreen(prev => !prev);
  }, [isFullScreen]);

  const handleAlertCapture = useCallback((path) => {
    setIsAlertCapture(true);
    setCapturePath(path);
  }, []);

  const renderHeader = () => (
    <Header name={i18n.t(`account.camera.cameraDetail`)} prevScreen={'ProvinceCamera'} params={{ province: province }} />
  )

  const renderVideo = () => (
    <Camera
      camera={camera}
      urlType={urlType}
      isFullScreen={isFullScreen}
      handleScreenChange={handleScreenChange}
      handleAlertCapture={handleAlertCapture}
    />
  )

  const renderTitle = () => (
    <View style={styles.titleArea}>
      <View style={styles.titleView}>
        {camera &&
          <>
            <Text style={[styles.titleText, styles.textBold]}>{camera.name}</Text>
            <Text style={styles.titleText}>{camera.address}</Text>
          </>
        }
        {!(props.cameraLocationSelected.length > 1) && <Text style={styles.notFoundText}>{i18n.t(`account.camera.cameraLocationNotFound`)}</Text>}
      </View>
    </View>
  )

  return (
    <View style={[styles.container, isFullScreen ? styles.containerFullScreen : {}]}>
      {isFullScreen ? (
        renderVideo()
      ) : (
        <>
          {renderHeader()}
          <ScrollView>
            <View style={styles.content}>
              {renderVideo()}
              {renderTitle()}
              <View style={[
                styles.viewMap,
                // { height: isPortrait ? '100%' : dimensions.height / 2 }
              ]}>
                {(props.cameraLocationSelected.length > 1) &&
                  <Map key={renderKey} zoomLevelOut={zoomLevelOut} zoomLevelIn={zoomLevelIn} isMyLocation={isMyLocation}
                    handleSelectCamera={handleSelectCamera}
                  />
                }
              </View>
            </View>
          </ScrollView>
        </>
      )
      }
      {
        isAlertCapture &&
        <View style={styles.alertCapture}>
          <Text style={styles.alertCaptureText}>{i18n.t(`account.camera.captureAlert`, { path: capturePath })}</Text>
        </View>
      }
    </View >
  )
}

function mapStateToProps(state) {
  return {
    myLocation: state.app.myLocation,
    cameraLocations: state.app.cameraLocations,
    cameraLocationSelected: state.app.cameraLocationSelected
  };
}
const mapDispatchToProps = (dispatch) => ({
  updateMapView: (mapView) => dispatch(appAction.mapView(mapView)),
  updateCameraLocation: (cameraLocations) => dispatch(appAction.cameraLocations(cameraLocations)),
  updateCameraLocationSelected: (cameraLocationSelected) => dispatch(appAction.cameraLocationSelected(cameraLocationSelected)),
});

export default connect(mapStateToProps, mapDispatchToProps)(CameraDetail);