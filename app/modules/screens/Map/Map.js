import React, {
  Fragment, useState, useRef, useEffect, useCallback, useMemo,
} from "react";
import { connect } from "react-redux";
import * as appAction from "@app/storage/action/app";
import MapLibreGL from "@maplibre/maplibre-react-native";
import Geolocation from 'react-native-geolocation-service';
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import {
  PermissionsAndroid,
  View,
  Image,
  Text,
  Alert,
  AppState,
  TextComponent,
  RootTagContext,
  TextPropTypes,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import AsyncStorage from "@react-native-community/async-storage";
import StyleMapService from "../../../service/StyleMapService";
import styles from "./styles";
import { useTheme } from "@app/modules/components/context/ThemeContext";
import { useGetPlaceDetailFromLatLong } from "@app/hooks/place_detail.hook";
import { getDistance, getGreatCircleBearing } from 'geolib'
import CustomCallout from "./CustomCallout";
// import { useTheme } from "@app/modules/components/context/ThemeContext";
import Place from "./Data/Place";
import MyLocation from "./Data/MyLocation";
import TrafficLayer from "./Data/TrafficLayer";
import Routing from "./Data/Routing";
import Steps from "./Data/Steps";
import Navigation from "./Data/Navigation";
import { Colors, Helpers, Images, Metrics, Animated, } from "@app/theme";
import { LightSpeedInRight } from "react-native-reanimated";
import CameraLocation from "./Data/CameraLocation";
import i18n from "@app/i18n/i18n";
import { getPreciseDistance } from 'geolib';
import { useNavigation } from '@react-navigation/native';
import * as db from "@app/storage/sqliteDbUtils";
import KeepAwake from 'react-native-keep-awake';
import Debug from "@app/modules/components/debug/Debug";
import { decodePolyline, getMapImagesInScreen, getBoundsFromCoordinates } from '@app/libs/utils.js'
MapLibreGL.setAccessToken(null);
import { useOrientation } from "@app/modules/components/context/OrientationContext";
const { width, height } = Dimensions.get("window");

// MapLibreGL.prefetchZoomDelta = 2; // Số cấp độ zoom trước sẽ được tải


const Map = (props) => {
  const [previousLocation, setPreviousLocation] = useState(null);
  const [previousTimestamp, setPreviousTimestamp] = useState(null);
  const [roadMoveHistory, setRoadMoveHistory] = useState(null);
  const [endTripMarker, setEndTripMarker] = useState(null);
  const [startTripMarker, setStartTripMarker] = useState(null);
  const [totalDuration, setTotalDuration] = useState(0);

  const { isInteractive = true, locationHistory } = props;
  const { isDarkTheme } = useTheme();

  const [mapStyle, setMapStyle] = useState('');
  const [zoomLevel, setZoomLevel] = useState(10);
  const [isMyLocation, setIsMyLocation] = useState(true);
  const [heading, setHeading] = useState(0);
  const [bounds, setBounds] = useState();
  const [boundsHistory, setBoundsHistory] = useState();
  const [appState, setAppState] = useState(AppState.currentState);
  const [markerCoordinate, setMarkerCoordinate] = useState(null);
  const [placeData, setPlaceData] = useState(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  // const [cameraLocationCurrent, setCameraLocationCurrent] = useState([]);
  const [cameraListVisible, setCameraListVisible] = useState([{ latitude: 0, longitude: 0 }]);
  const [key, setKey] = useState(0);
  const [keyPlace, setKeyPlace] = useState(0);
  const [isMove, setIsMove] = useState(false);
  const [initFitBound, setInitFitBound] = useState(true)

  const useFetchGetPlaceDetailFromLatLong = useGetPlaceDetailFromLatLong();
  const [zoom, setZoom] = useState();
  const [speed, setSpeed] = useState(0);
  const [accuracy, setAccuracy] = useState(0);
  const [distanceMarker, setDistanceMarker] = useState(0);
  const [fitBoundsComplete, setFitBoundsComplete] = useState(false);
  const [fitBoundsHistoryComplete, setFitBoundsHistoryComplete] = useState(false);
  const [mapHeading, setMapHeading] = useState(0); // Hướng của bản đồ
  const [dimensions, setDimensions] = useState(Dimensions.get("window"));


  const camera = useRef(null);

  const mapRef = useRef(null);
  const trafficLayerRef = useRef(null);
  const navigation = useNavigation();
  const { isPortrait } = useOrientation();


  useEffect(async () => {
    KeepAwake.activate();
    await requestLocationPermission();
    await getData();

    const onChange = ({ window }) => setDimensions(window);
    const subscription = Dimensions.addEventListener("change", onChange);

    return () => {
      subscription?.remove();
    };
  }, []);

  useEffect(async () => {
    try {
      if (props.routeResult == null && props.mapView.location && props.mapView.location.length == 2 && typeof props.mapView.location[1] === 'number' && typeof props.mapView.location[0] === 'number') {
        if (!isPortrait) {
          if (camera.current) {
            camera.current.setCamera({
              zoomLevel: props.mapView.zoom ? props.mapView.zoom : zoomLevel,
              animationDuration: 500,
              centerCoordinate: props.mapView.location,
              padding: {
                paddingLeft: dimensions.width / 2,
              }
            });
          }
        } else {
          if (camera.current) {
            // console.log("__________vào3222222223________", isPortrait)
            camera.current.setCamera({
              zoomLevel: props.mapView.zoom ? props.mapView.zoom : zoomLevel,
              animationDuration: 500,
              centerCoordinate: props.mapView.location,
              padding: {
                paddingLeft: 0,
              }
            });
          }
        }
      }
      props.updateIsReturn(true);
    } catch (error) {
      Alert.alert(
        i18n.t("alert.attributes.warning"),
        `Lỗi khi xoay màn hình: ${error.message}`,
        [
          { text: i18n.t("alert.attributes.oke") },
        ]
      );
    }
  }, [dimensions, isMapLoaded]);

  useEffect(async () => {
    if (props.renderMap) {
      await getData();
      setKey(prevKey => prevKey + 1);
    }
  }, [props.renderMap]);

  useEffect(async () => {
    if (props.renderPlace) {
      await getData();
      setKeyPlace(prevKeyPlace => prevKeyPlace + 1);
    }
  }, [props.renderPlace]);

  // useEffect(() => {
  //     setTimeout(async () => {
  //         await getData();
  //     }, 500);
  // }, [isDarkTheme]);


  useEffect(() => {
    setTimeout(async () => {
      await getData();
    }, 500);
  }, [isDarkTheme]);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', handleAppStateChange);

    return () => {
      subscription.remove();
    };
  }, [appState])

  // Kiểm tra quyền khi ứng dụng quay lại foreground
  const handleAppStateChange = nextAppState => {
    if (appState.match(/inactive|background/) && nextAppState === 'active') {
      getCurrentLocation();
    }
    setAppState(nextAppState);
  };

  // useEffect(() => {
  //   if (props.routeResult) {
  //     if (!props.mapView.location && camera.current != null) {
  //       camera.current.fitBounds([props.routeResult[0].legs[0].start_location.lng, props.routeResult[0].legs[0].start_location.lat], [props.routeResult[0].legs[0].end_location.lng, props.routeResult[0].legs[0].end_location.lat], [260, 50, 200, 50], 1000); // padding=50, animationDuration=2000
  //     }
  //   }
  // }, [props.mapView]);


  const getData = async () => {
    try {
      const value = await AsyncStorage.getItem('styleMap');
      setMapStyle(StyleMapService.getStyleMap(value))
    } catch (e) {
      Alert.alert(
        i18n.t("alert.attributes.warning"),
        e.message || i18n.t("alert.attributes.warning"),
        [
          { text: i18n.t("alert.attributes.oke") },
        ]
      );
    }
  };

  useEffect(async () => {
    const zoom = await mapRef.current?.getZoom();
    if (props.zoomLevelIn && zoom <= 17) {
      // setZoomLevel(zoom + 1)
      if (camera.current) {
        props.updateIsProgram(true);
        camera.current.setCamera({
          zoomLevel: zoom + 1,
          animationDuration: 1000,
        });
      }
    }
  }, [props.zoomLevelIn]);

  useEffect(async () => {
    const zoom = await mapRef.current?.getZoom();
    if (props.zoomLevelOut && zoom > 5) {
      // setZoomLevel(zoom - 1)
      props.updateIsProgram(true);
      camera.current.setCamera({
        zoomLevel: zoom - 1,
        animationDuration: 1000,
      });
    }
  }, [props.zoomLevelOut]);

  useEffect(() => {
    if (isMyLocation != props.isMyLocation) {
      if (camera.current && props.myLocation.length == 2 && typeof props.myLocation[1] === 'number' && typeof props.myLocation[0] === 'number') {
        props.updateIsProgram(true);
        camera.current.setCamera({
          centerCoordinate: props.myLocation,
          animationDuration: 1000, // Animation duration in milliseconds
          heading: 0,
          pitch: 0,
        });
      }
      setIsMyLocation(props.isMyLocation);
      setIsMove(false);
    }
  }, [props.isMyLocation]);

  useEffect(() => {
    if (!props.isDeepLink) {
      if (props.cameraLocationSelected && props.cameraLocationSelected.length > 1) {
        console.log('cameraLocationSelected ------------------ ', JSON.stringify(props.cameraLocationSelected));
        props.updateMapView({
          location: [props.cameraLocationSelected[0], props.cameraLocationSelected[1]]
        })

      } else {
        props.updateMapView({
          location: props.myLocation
        })
      }
    }
  }, [props.isDeepLink]);

  const getSpeed = (value) => {
    // setSpeed
    setSpeed(value)
  }

  const getAccuracy = (value) => {
    setAccuracy(value)
  }

  const getDistanceMarker = (value) => {
    setDistanceMarker(value)
  }

  const requestLocationPermission = async () => {
    if (Platform.OS === 'ios') {
      const status = await check(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
      // if (status === RESULTS.GRANTED) {
      Geolocation.requestAuthorization();
      getCurrentLocation();
      // } else if (status === RESULTS.DENIED) {
      //   const requestStatus = await request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
      //   if (requestStatus === RESULTS.GRANTED) {
      //     Geolocation.requestAuthorization();
      //     getCurrentLocation();
      //   }
      // }
    } else if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
      );
      // return granted === PermissionsAndroid.RESULTS.GRANTED;
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        getCurrentLocation();
      }
    }
  };

  const getCurrentLocation = () => {
    try {
      Geolocation.getCurrentPosition(
        (position) => {
          props.updateMyLocation([position.coords.longitude, position.coords.latitude])
        },
        (error) => {
          console.log('------lỗi lấy vị trí------', error)
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
      );
    } catch (error) {
      Alert.alert(
        i18n.t("alert.attributes.warning"),
        error.message || i18n.t("alert.attributes.warning"),
        [
          { text: i18n.t("alert.attributes.oke") },
        ]
      );
    }
  };

  const fitBounds = (value) => {
    setBounds(value)
  }

  useEffect(() => {
    if (camera.current && bounds && props.isRouting == false) {
      setFitBoundsComplete(false);
      props.updateIsProgram(true);
      camera.current.setCamera({
        pitch: 0,
        animationDuration: 500,
      });
      setTimeout(() => setFitBoundsComplete(true), 600);
      // props.updateMapView({})
    }
  }, [props.isRouting])

  useEffect(() => {
    if (!props.isRouting && fitBoundsComplete && camera.current && bounds && props.stepView == null) {
      if (isPortrait) {
        camera.current.fitBounds(
          bounds[0],
          bounds[1],
          [260, 25, 250, 25],
          1000
        );
      } else {
        camera.current.fitBounds(
          bounds[0],
          bounds[1],
          [10, 80, 10, 400],
          1000
        );
      }
    }
  }, [fitBoundsComplete, dimensions, props.stepView]);

  useEffect(() => {
    if (camera.current && bounds && props.isRouting == false) {
      setFitBoundsComplete(false);
      props.updateIsProgram(true);
      camera.current.setCamera({
        pitch: 0,
        animationDuration: 500,
      });
      setTimeout(() => setFitBoundsComplete(true), 600);
      props.updateIsLoad(true);
      // props.updateMapView({})
    }
  }, [bounds])

  useEffect(() => {
    if (!props.isRouting && fitBoundsComplete && camera.current && bounds && props.stepView == null) {
      if (isPortrait) {
        camera.current.fitBounds(
          bounds[0],
          bounds[1],
          [260, 25, 250, 25],
          1000
        );
      } else {
        camera.current.fitBounds(
          bounds[0],
          bounds[1],
          [10, 80, 10, 400],
          1000
        );
      }

    }
  }, [fitBoundsComplete, dimensions, props.stepView]);

  const getPlaceDetailFromLatLong = async (lat, long) => {
    let place = null;
    const params = {
      latlng: `${lat},${long}`,  // Correctly formatted latlng string
    };
    try {
      // Call your API function (assuming you're using Axios or similar)
      const response = await useFetchGetPlaceDetailFromLatLong.mutateAsync(params);
      // Check if response and data are available
      // console.log('-------------------response--------------', response)

      if (response.results.length) {
        place = response.results[0];

      }
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
  };

  const handleClick = async (e) => {
    if (!isMapLoaded || !isInteractive) {
      // Map is not loaded, ignore the click event
      return;
    }

    const { geometry } = e;
    const [longitude, latitude] = geometry.coordinates;

    console.log('Latitude:', latitude);
    console.log('Longitude:', longitude);

    try {
      if (latitude && longitude) {


        const place = await getPlaceDetailFromLatLong(latitude, longitude);

        if (place) {
          setPlaceData({
            description: place.name || '',
            formattedAddress: place.formatted_address || place.address || '',
          });
          if (props.getAddress) {
            await props.getAddress(place);
            setMarkerCoordinate([longitude, latitude]);
          }
          if (props.getAddressOverview) {
            props.getAddressOverview(place);
          }
        }
      }
    } catch (error) {
      Alert.alert(
        i18n.t("alert.attributes.warning"),
        error.message || i18n.t("alert.attributes.warning"),
        [
          { text: i18n.t("alert.attributes.oke") },
        ]
      );
    }
  };



  useEffect(() => {
    if (locationHistory?.length) {
      const latLongArray = locationHistory.map(item => [
        parseFloat(item.locationLong),
        parseFloat(item.locationLat)
      ]);
      const dataVehicle = {
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'LineString',
          coordinates: latLongArray
        }
      };
      setRoadMoveHistory(dataVehicle);
      const firstLocation = latLongArray[0];
      const lastLocation = latLongArray[latLongArray.length - 1];
      setStartTripMarker(firstLocation);
      if (!props.myLocation) {
        setEndTripMarker(lastLocation);
      } else {
        setEndTripMarker(null);
      }
      const bounds = getBoundsFromCoordinates(latLongArray);
      setBoundsHistory(bounds)
      if (camera.current) {
        setFitBoundsHistoryComplete(false);
        camera.current.setCamera({
          pitch: 0,
          animationDuration: 500,
        });
        setTimeout(() => setFitBoundsHistoryComplete(true), 600);
      }

    } else {
      setRoadMoveHistory(null);
      setEndTripMarker(null);
      setStartTripMarker(null);
    }
  }, [locationHistory, dimensions, isMapLoaded]);

  useEffect(() => {
    if (camera.current && boundsHistory) {
      if (isPortrait) {
        camera.current.fitBounds(
          boundsHistory[0],
          boundsHistory[1],
          [200, 80, 285, 25],
          1000
        );
      } else {
        camera.current.fitBounds(
          boundsHistory[0],
          boundsHistory[1],
          [10, 80, 10, 400],
          1000
        );
      }
    }
  }, [boundsHistory, fitBoundsHistoryComplete])

  useEffect(() => {
    try {
      if (props?.myLocation) {
        const currentLocation = {
          latitude: parseFloat(props.myLocation[1]),
          longitude: parseFloat(props.myLocation[0]),
        };
        const currentTimestamp = new Date().getTime(); // thời gian hiện tại bằng mili giây
        let distance = 0;
        let duration = 0;

        if (previousLocation) {
          distance = getDistance(previousLocation, currentLocation) / 1000; // Đổi từ mét sang km
          if (distance < 0.002) {
            setPreviousLocation(currentLocation);
            setPreviousTimestamp(currentTimestamp);
            return;
          }
          duration = (currentTimestamp - previousTimestamp) / 1000;
        }
        // Lưu vào cơ sở dữ liệu nếu đủ điều kiện
        db.insertLocationHistory(
          currentLocation.latitude,
          currentLocation.longitude,
          distance.toString(),
          duration.toString(),
          currentTimestamp.toString()
        );
        setPreviousLocation(currentLocation);
        setPreviousTimestamp(currentTimestamp);
      }
    } catch (error) {
      Alert.alert(
        i18n.t("alert.attributes.warning"),
        `Lỗi lấy dữ khi lưu map: ${error.message}`,
        [
          { text: i18n.t("alert.attributes.oke") },
        ]
      );
    }
  }, []);

  const handleMapLoad = () => {
    console.log('Map has finished loading');
    setIsMapLoaded(true);
    props.updateIsReturn(true);
  };

  useEffect(() => {
    if (props?.cameraLocations.length === 0) {
      setCameraListVisible([{ latitude: 0, longitude: 0 }]);
    }
  }, [props?.cameraLocations])

  const handleRegionDidChange = async (region) => {
    const { properties } = region; // Lấy giá trị bearing từ region (nếu có)
    // console.log("____________handleRegionDidChange_________----", properties.heading)
    setMapHeading(properties.heading)
    setZoom(properties.zoomLevel)
    // console.log("__________kéo_________________", properties.heading)
    setIsMove(true)
    // ---------------
    if (props.cameraLocations && props.cameraLocations.length > 0) {
      const bounds = await mapRef.current.getVisibleBounds();
      const [[maxLon, maxLat], [minLon, minLat]] = bounds;
      // console.log('mapview ------------ ', props.mapView);
      // console.log('cameraLocations ===== ---------------------------------------------')
      const regionCurrent = {
        maxLat: maxLat,
        maxLon: maxLon,
        minLat: minLat,
        minLon: minLon
      }
      const pointsInRegion = props.cameraLocations.filter((point) => isPointInRegion(point, regionCurrent));
      // console.log('list camera ================ ', pointsInRegion);
      setCameraListVisible(pointsInRegion);
    }
  }

  const handleRegionWillChange = async (region) => {
    const { properties } = region;
    setMapHeading(properties.heading)
    if (props.isProgram) {
      props.updateIsProgram(false);
    } else {
      props.updateIsReturn(false);
    }
  }

  const isPointInRegion = (point, regionCurrent) => {
    const { maxLat, maxLon, minLat, minLon } = regionCurrent;
    const check = point.latitude >= minLat &&
      point.latitude <= maxLat &&
      point.longitude >= minLon &&
      point.longitude <= maxLon
    return check;
  };


  const handleSelectCamera = (location) => {
    props.handleSelectCamera(location);
    setCameraListVisible(prev => Array.from(prev));
  }

  return (
    <>
      <MapLibreGL.MapView
        styleURL={"https://tiles.metaforce.vn/styles/vietnam-admin/style.json"}
        style={{ flex: 1 }}
        projection="globe"
        logoEnabled={false}
        attributionEnabled={false}
        zoomEnabled={true}
        ref={mapRef}
        onRegionDidChange={(region) => handleRegionDidChange(region)}
        onPress={isInteractive ? handleClick : null}
        onDidFinishLoadingMap={handleMapLoad}
        onRegionWillChange={(region) => handleRegionWillChange(region)}
        compassEnabled={false} // tắt la bàn
      >
                 <MapLibreGL.RasterSource
                    id="raster-source"
                    tileUrlTemplates={[
                        "https://raster.metaforce.vn/wmts/satellite_layer/webmercator/{z}/{x}/{y}.png",
                    ]}
                    maxZoomLevel={14}
                    tileSize={256}
                >
                    <MapLibreGL.RasterLayer
                        id="raster-layer"
                        sourceID="raster-source"
                        style={{ rasterOpacity: 1 }}
                    />
                </MapLibreGL.RasterSource>
        {markerCoordinate && placeData && (
          // <MapLibreGL.MarkerView coordinate={markerCoordinate} >
          //   <View
          //     style={{
          //       ...Helpers.colCenter
          //     }}
          //     pointerEvents="none"
          //   >
          //     <View>
          //       <Image
          //         source={Images.markerLocation}
          //         style={{ width: 45, height: 45 }}
          //         resizeMode="contain"
          //       />
          //     </View>
          //     <View>
          //       <CustomCallout title={placeData.formattedAddress} />
          //     </View>
          //   </View>
          // </MapLibreGL.MarkerView>
          <MapLibreGL.PointAnnotation id="markerCoordinate" coordinate={markerCoordinate}>
          </MapLibreGL.PointAnnotation>
        )}
        <MapLibreGL.Camera
          ref={camera}
          minZoomLevel={5}
          maxZoomLevel={18}
          // zoomLevel={props.mapView.zoom ? props.mapView.zoom : zoomLevel}
          // centerCoordinate={props.mapView.location}
          defaultSettings={{
            centerCoordinate: props.mapView.location ? props.mapView.location : [105.819, 21.0335],
            zoomLevel: 10,
          }}
        // padding={!isPortrait ?
        //   {
        //     paddingTop: height / 3 * 1.5,
        //   } : {
        //     paddingLeft: 0,
        //   }
        // }
        />

        <MapLibreGL.Images images={{
          'arrow-icon': Images.navigation,
          'place-icon': Images.markerLocation,
          'my-location-icon': Images.myLocationButton,
          'navigation-icon': Images.markerRouting,
        }} />

        <MyLocation speed={speed} key={key} isMove={isMove} />


        <Place
          key={`place_${keyPlace}`}
          keyPlace={`place_${keyPlace}`}
          camera={camera}
        />
        <TrafficLayer ref={trafficLayerRef} />
        {/* Hiển thị các marker steps */}

        {!props.isChooseLocation && (
          <Steps camera={camera} />
        )}

        {!props.isMoveHistory && !props.isSearchDirection && (
          <Navigation
            camera={camera}
            getSpeed={getSpeed}
            isMapLoaded={isMapLoaded}
            getAccuracy={getAccuracy}
            getDistanceMarker={getDistanceMarker}
            mapHeading={mapHeading}
            isRouteNavigation={props.isRouteNavigation}
          />
        )}

        {!props.isChooseLocation && (
          <Routing fitBounds={fitBounds} />
        )}

        {roadMoveHistory != null && (

          <MapLibreGL.ShapeSource id={`navigation_move`} shape={roadMoveHistory}>
            <MapLibreGL.LineLayer
              id={`navigation_move`}
              sourceID="navigation_move"
              style={{
                lineJoin: 'round',
                lineCap: 'round',
                lineColor: '#1B66FF',
                lineWidth: 8,
              }}
              belowLayerID={Platform.OS === "android" ? "com.mapbox.annotations.points" : undefined}
            />
          </MapLibreGL.ShapeSource>
        )}

        {startTripMarker && (
          <MapLibreGL.PointAnnotation id="startTripMarker" coordinate={startTripMarker}>
          </MapLibreGL.PointAnnotation>
        )}

        {endTripMarker && (
          <MapLibreGL.PointAnnotation id="endTripMarker" coordinate={endTripMarker}>
          </MapLibreGL.PointAnnotation>
        )}

        {(props.cameraLocations && props.cameraLocations.length > 0) &&
          <CameraLocation cameraListVisible={cameraListVisible} handleSelectCamera={handleSelectCamera} />
        }
      </MapLibreGL.MapView>

      {!isMapLoaded && (
        <View style={{
          ...Helpers.positionAbso,
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'rgba(0, 0, 0, 0.3)',
        }}>
          <ActivityIndicator size="large" color="#0084ff" />
        </View>
      )}
      {/* <Debug
        accuracy={accuracy}
        distanceMarker={distanceMarker}
      /> */}
    </>
  );

}




function mapStateToProps(state) {
  return {
    showScreen: state.app.showScreen,
    typeRouteInput: state.app.typeRouteInput,
    navigationFrom: state.app.navigationFrom,
    navigationTo: state.app.navigationTo,
    vehicle: state.app.vehicle,
    place: state.app.place,
    myLocation: state.app.myLocation,
    routeResult: state.app.routeResult,
    route: state.app.route,
    mapView: state.app.mapView,
    cameraLocations: state.app.cameraLocations,
    cameraLocationSelected: state.app.cameraLocationSelected,
    isRouting: state.app.isRouting,
    showScreen: state.app.showScreen,
    isEndPoint: state.app.isEndPoint,
    navigationToArray: state.app.navigationToArray,
    endLocationIndex: state.app.endLocationIndex,
    isProgram: state.app.isProgram,
    stepView: state.app.stepView,
    isDeepLink: state.app.isDeepLink,
  };
}
const mapDispatchToProps = (dispatch) => ({
  updateShowScreen: (show) => dispatch(appAction.showScreen(show)),
  updateTypeRouteInput: (type) => dispatch(appAction.typeRouteInput(type)),
  updateNavigationFrom: (from) => dispatch(appAction.navigationFrom(from)),
  updateNavigationTo: (to) => dispatch(appAction.navigationTo(to)),
  updateVehicle: (vehicle) => dispatch(appAction.vehicle(vehicle)),
  updatePlace: (place) => dispatch(appAction.place(place)),
  updateMyLocation: (myLocation) => dispatch(appAction.myLocation(myLocation)),
  updateRouteResult: (routeResult) => dispatch(appAction.routeResult(routeResult)),
  updateRoute: (route) => dispatch(appAction.route(route)),
  updateMapView: (mapView) => dispatch(appAction.mapView(mapView)),
  updateIsRouting: (isRouting) => dispatch(appAction.isRouting(isRouting)),
  updateSpeed: (speed) => dispatch(appAction.speed(speed)),
  updateIsEndPoint: (isEndPoint) => dispatch(appAction.isEndPoint(isEndPoint)),
  updateRemainingDistance: (remainingDistance) => dispatch(appAction.remainingDistance(remainingDistance)),
  updateEndLocationIndex: (endLocationIndex) => dispatch(appAction.endLocationIndex(endLocationIndex)),
  updateIsReturn: (isReturn) => dispatch(appAction.isReturn(isReturn)),
  updateIsProgram: (isProgram) => dispatch(appAction.isProgram(isProgram)),
  updateIsLoad: (isLoad) => dispatch(appAction.isLoad(isLoad)),
});


export default connect(mapStateToProps, mapDispatchToProps)(Map);
