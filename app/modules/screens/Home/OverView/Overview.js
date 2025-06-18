import React, { Fragment, useState, useRef, useEffect, useCallback, useMemo, useContext } from "react";
// import { Text, View, SafeAreaView, Image } from "react-native";
import {
  TouchableOpacity,
  Dimensions,
  StyleSheet,
  Text,
  View,
  Image,
  FlatList,
  TextInput,
  Platform,
  StatusBar,
  Alert,
} from "react-native";
import { connect } from "react-redux";
import { Colors as Themes, Helpers, Images, Metrics } from "@app/theme";
import * as appAction from "@app/storage/action/app";
import i18n from "@app/i18n/i18n";
import MapLibreGL from "@maplibre/maplibre-react-native";
import OverViewMenu from "../OverViewMenu/OverViewMenu";
import SearchScreen from "../../Search/SearchScreen/SearchScreen";
import { useGetWeather } from "@app/hooks/weather.hook";
import { Fonts } from "@app/theme";
import SettingsBox from "../../Settings/SettingsBox";
import Map from "@app/modules/screens/Map/Map"
// import StyleMap from "./StyleMap/StyleMap";
import StyleMap from "../StyleMap/StyleMap";
import Radio from "../../Radio/Radio";
import { SafeAreaInsetsContext, SafeAreaView } from "react-native-safe-area-context";
import storage from "@app/libs/storage";
import { RadioContext } from "../../Radio/RadioProvider";
import { useIsFocused } from '@react-navigation/native';
import Weather from "../Weather/Weather";
import { useFocusEffect } from '@react-navigation/native';
import AlertError from "@app/modules/components/alert/AlertError/AlertError";
// import { useTheme } from "@app/modules/components/context/ThemeContext";
// import createStyles from "./styles";
import ViolationAlert from "@app/modules/screens/Account/Violation/Alert/ViolationAlert";
import * as db from "@app/storage/sqliteDbUtils";
import { UNSANCTIONED } from "@app/config/constants";
import NavigationSpeed from "@app/modules/screens/Route/NavigationSpeed/NavigationSpeed";
import { useTheme } from "@app/modules/components/context/ThemeContext";
import createStyles from "./styles";
import { useNavigation, useRoute } from '@react-navigation/native';
import { haversineDistance } from '@app/libs/utils.js';
import { useGetAutoComplete, useGetPlaceDetail } from "@app/hooks/place_detail.hook";
import { useOrientation } from "@app/modules/components/context/OrientationContext";
import createHorizontalStyles from "./horizontalStyles";
import HandleDeepLink from "@app/modules/components/deeplink/HandleDeepLink";



// import FavoritePlace from "../Search/FavoritePlace";

MapLibreGL.setAccessToken(null);
// const windowWidth = Dimensions.get("window").width;

const screenHeight = Dimensions.get('window').height;
// console.log('Chiều cao màn hình:', screenHeight);


// const { height } = Dimensions.get('window');
const Overview = (props) => {

  const navigation = useNavigation();

  const [isMenuVisible, setMenuVisible] = useState(true);
  const [isCloseVisible, setCloseVisible] = useState(false);
  const [isRadioVisible, setRadioVisible] = useState(false);
  const [isPlay, setIsPlay] = useState(false);
  const [isOpenSettings, setIsOpenSettings] = useState(false);
  const [dataWeather, setDataWeather] = useState(); // đây là đata lấy từ Api weather ra nhé 
  const [isMyLocation, setIsMyLocation] = useState(true);
  const useFetchGetWeather = useGetWeather();
  const [isStyleMapVisible, setIsStyleMapVisible] = useState(false);
  const [renderKey, setRenderKey] = useState(0);
  const [zoomLevelIn, setZoomLevelIn] = useState(0);
  const [zoomLevelOut, setZoomLevelOut] = useState(0);
  const [visibleAlert, setVisibleAlert] = useState(false);
  const [isViolationAlert, setIsViolationAlert] = useState(false);
  const [unsanctionedCount, setUnsanctionedCount] = useState(0);
  const [relatedLocations, setRelatedLocations] = useState([])
  const useFetchGetAutoComplete = useGetAutoComplete();
  const useFetchGetPlaceDetail = useGetPlaceDetail();
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const [dimensions, setDimensions] = useState(Dimensions.get("window"));


  const { isPlaying, nameChannel } = useContext(RadioContext);
  const { isDarkTheme } = useTheme();
  const { isPortrait } = useOrientation();
  const styles = isPortrait ? createStyles(isDarkTheme, dimensions.width, dimensions.height) : createHorizontalStyles(isDarkTheme, dimensions.width, dimensions.height);

  const [mainText, setMainText] = useState('');
  const [description, setDescription] = useState('');
  const Colors = Themes[isDarkTheme ? 'darkMode' : 'lightMode'];


  const route = useRoute();

  const isFocused = useIsFocused();

  useEffect(() => {
    const onChange = ({ window }) => setDimensions(window);
    const subscription = Dimensions.addEventListener("change", onChange);

    return () => {
      subscription?.remove();
    };
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      props.updatePlace(null)
      if (!props.isDeepLink) {
        if (props.myLocation != null) {
          props.updateMapView({
            location: [props.myLocation[0], props.myLocation[1]]
          })
        }
        // tra lỗi vi phạm 
        const getViolationAlert = async () => {
          const currentTime = new Date().getTime();
          let time = await storage.get('violationAlertHideTime');
          let lastTime = await storage.get('lastViolationAlertTime');
          // console.log('violationAlertHideTime ======= ', time);
          if (time === undefined || (time != 'Infinity' && currentTime - lastTime > time)) {
            setIsViolationAlert(true);
          } else {
            setIsViolationAlert(false);
          }
        }
        const getUnsanctionedCount = async () => {
          const vehicleDefaultString = await storage.get('vehicleDefault');
          const vehicleDefault = vehicleDefaultString ? JSON.parse(vehicleDefaultString) : undefined;
          if (vehicleDefault) {
            try {
              db.getVehicleByPlateNumber(vehicleDefault.plateNumberFormatted, vehicleDefault.categoryId, async (status, data) => {
                if (status) {
                  const count = await db.getViolationCountByStatusAndVehicleId(data.id, UNSANCTIONED);
                  // console.log('số lỗi: ==== ', count);
                  if (count > 0) {
                    setUnsanctionedCount(count);
                    getViolationAlert();
                  }
                }
              })
            } catch (error) {
              console.log('error select count violation overview ==== ', error.message);
            }
          }
        }
        getUnsanctionedCount();
        //

        return () => {
          console.log('Cleanup khi rời khỏi màn hình');
        };
      }
    }, [])
  );

  useEffect(() => {
    if (props.myLocation && isFirstLoad) {
      getWeatherApi();
      setIsFirstLoad(false); // Đánh dấu là đã gọi API lần đầu
    }
  }, [props.myLocation]);

  const getWeatherApi = () => {
    const params = {
      lat: props.myLocation[0],
      lng: props.myLocation[1]
    }
    useFetchGetWeather.mutateAsync({ params }).then(async (response) => {
      setDataWeather(response)

    });
  }

  useEffect(async () => {
    // moveToMarker();
    setRenderKey(prevKey => prevKey + 1);
  }, [route.params?.setView, isFocused])

  //-------------------------------------------------------------------------------------------------------------------------------------------------------------------
  const handleMenuPress = () => {
    setMenuVisible(false);
    setCloseVisible(true);
  };

  const handleClosePress = () => {
    setMenuVisible(true);
    setCloseVisible(false);
  };
  const handleShowRadio = () => {
    setRadioVisible(true);
  };
  const handleCloseRadio = useCallback(() => {
    setRadioVisible(false);
  }, []);

  const handleOpenSettings = useCallback(() => {
    setMenuVisible(true);  // đóng overviewmenu khi mở
    setCloseVisible(false);
    setIsOpenSettings(true); //mở setting box
  }, [])

  const handleCloseSettings = useCallback(() => {
    setIsOpenSettings(false);
  }, [])

  const handleCloseViolationAlert = useCallback(() => {
    setIsViolationAlert(false);
  }, []);

  const handleRouteScreen = () => {
    props.navigation.navigate('Route')
  };

  const handleSearchScreen = () => {
    props.navigation.navigate('SearchScreen')

  };


  const handleVoice = () => {
    props.navigation.navigate('SearchScreen', { voiceSearch: true })
  };


  const moveToMarker = () => {
    if (props.myLocation != null) {
      props.updateIsReturn(true);
      setIsMyLocation(!isMyLocation)
    } else {
      openAlert()
    }
  };

  const openAlert = () => {
    setVisibleAlert(true);
  };

  const closeAlert = () => {
    setVisibleAlert(false);
  };

  const zoomIn = () => {
    setZoomLevelIn(prevZoom => prevZoom + 1); // Tăng mức zoom

  };

  const zoomOut = () => {
    setZoomLevelOut(prevZoom => prevZoom - 1); // Giảm mức zoom
  };

  const handleStyleMap = () => {
    setIsStyleMapVisible(true)
  };

  const closeStyleMap = () => {
    setIsStyleMapVisible(false)
  };

  const handleRender = () => {
    setRenderKey(prevKey => prevKey + 1);
  };

  // --------------------------------------------------------------------------------------------------------------------------------------------------------------------
  const renderAlert = () => {
    return (
      <AlertError title={i18n.t("alert.attributes.noMyLocation")}
        body={i18n.t("alert.attributes.setMyLocation")}
        handleClose={closeAlert}
      />
    )
  }

  const renderSearchBtn = () => {
    return (
      <TouchableOpacity style={[
        styles.viewFooterInput
      ]}
        onPress={handleSearchScreen}>

        <TouchableOpacity
          style={styles.viewFooterInputIconShare}
        >
          <Image style={styles.iconStyleInput}
            source={Images.search} />
        </TouchableOpacity>
        <View
          style={styles.viewContentInput}
        // placeholder={i18n.t("overview.attributes.searchLocation")}

        >
          <Text style={styles.inputSearchText}>{i18n.t("overview.attributes.searchLocation")}</Text>
        </View>
        <TouchableOpacity
          onPress={handleVoice}
          style={styles.viewFooterInputIconFrame}>
          <Image style={styles.iconStyleInput}
            source={Images.frame} />
        </TouchableOpacity>

      </TouchableOpacity>
    );
  };
  const renderItem = () => {
    return (
      <View style={[styles.viewIconBotRightContainer]}>
        {/* button radio */}
        <TouchableOpacity
          onPress={handleShowRadio}
        >
          <View style={[styles.viewIconBotRight, isPlaying ? styles.viewIconRadio : {}]}>
            <Image
              style={[styles.viewIconRight, isPlaying ? styles.iconRadio : {}]}
              source={isPlaying ? Images[nameChannel] : Images.music}
              resizeMode="contain"
            />
          </View>
        </TouchableOpacity>
        <View style={styles.spacerHeight}></View>
        {/* Button to move camera to marker */}
        <TouchableOpacity onPress={moveToMarker}>
          <View style={styles.viewIconBotRight}>
            <Image
              style={[styles.viewIconRight, { tintColor: !props.isReturn ? Colors.gray : null }]}
              source={Images.location}

            />
          </View>
        </TouchableOpacity>
        <View style={styles.spacerHeight}></View>
        {/* Other buttons */}
        <TouchableOpacity
          style={styles.viewIconBotRightButtonRoute}
          onPress={handleRouteScreen}
        >
          <View style={styles.viewIconBotRightRoute}>
            <Image style={styles.viewIconRightRoute} source={Images.routeArrow} />
            <View>
              <Text style={styles.viewIconRightRouteText}>
                {i18n.t("overview.attributes.route")}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
        <View style={styles.spacerHeight}></View>
        <TouchableOpacity onPress={handleMenuPress}>
          <View style={styles.viewIconBotRightMenu}>
            <Image style={styles.viewIconMenu} source={Images.menu} />
            <View>
              <Text style={styles.viewIconRightMenuText}>
                {i18n.t("overview.attributes.menu")}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    )
  };



  const renderZoom = () => {
    return (
      <View style={styles.contentMenuTop}>
        <View style={styles.underline} >
          <TouchableOpacity style={styles.iconPadding} onPress={zoomIn}>
            <View
              style={[
                styles.viewHeaderIconTop,
                styles.topMargin,
              ]}
            ><Image source={Images.plus} style={styles.icon_Style} />
            </View>
          </TouchableOpacity>
        </View>
        <View style={styles.underline} >
          <TouchableOpacity style={styles.iconPadding} onPress={zoomOut}>
            <View
              style={[
                styles.viewHeaderIconTop,
                styles.normalMargin,
              ]}
            >

              <Image source={Images.minus} style={styles.icon_Style} />

            </View>
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={[styles.iconPadding, styles.iconPaddingMap]} onPress={handleStyleMap}>
          <View style={[styles.viewHeaderIconTop, styles.boxTransfer]}>

            <Image source={Images.box} style={styles.icon_Style} />

          </View>
        </TouchableOpacity>
      </View>
    );
  };


  const renderOverViewMenu = () => {
    return (
      <OverViewMenu
        isCloseVisible={isCloseVisible}
        handleClosePress={handleClosePress}
        handleOpenSettings={handleOpenSettings}
      />
    );
  };

  const renderRadio = () => {
    return (
      <Radio handleCloseRadio={handleCloseRadio} />
    );
  };
  const renderSettingsBox = () => {
    return (
      <SettingsBox
        handleCloseSettings={handleCloseSettings}
      />
    );
  };

  const renderViolationAlert = () => {
    return (
      <ViolationAlert
        handleCloseViolationAlert={handleCloseViolationAlert}
        unsanctionedCount={unsanctionedCount}
      />
    )
  }

  const renderWeather = () => {
    const temp = dataWeather?.main?.temp;
    const icon = dataWeather?.weather?.[0]?.icon;

    return <Weather temp={temp} icon={icon} />;
  };

  const renderStyleMap = () => {
    return (
      <StyleMap isVisible={isStyleMapVisible} onClose={closeStyleMap} renderAction={handleRender} />
    )
  }

  const getPlaceDetail = async (place) => {
    let placeDetail = null;
    const params = {
      placeId: place.place_id,
    };

    try {
      const response = await useFetchGetPlaceDetail.mutateAsync(params);
      placeDetail = response;
    } catch (error) {
      Alert.alert(
        i18n.t("alert.attributes.warning"),
        error.message || i18n.t("alert.attributes.warning"),
        [
          { text: i18n.t("alert.attributes.oke") },
        ]
      );
    }
    return placeDetail;
  }

  const getDistance = async (item) => {
    let distance = 0;
    if (props.myLocation) {
      const place = await getPlaceDetail(item);
      const placeLocation = [place.results[0].geometry.location.lng, place.results[0].geometry.location.lat];
      distance = haversineDistance(props.myLocation, placeLocation)
    }
    return distance.toFixed(2);
  }

  const handleClickOver = async (item) => {
    try {
      const { lat, long } = item.geometry.location
      const distance = await getDistance(item);
      const params = {
        location: `${lat}, ${long}`,
        searchText: item.formatted_address,
      };
      const relatedLocations = await useFetchGetAutoComplete.mutateAsync(params);
      const nearbyLocations = relatedLocations.predictions || [];
      const nearbyLocationsWithDistance = await Promise.all(nearbyLocations.map(async (location) => {
        const locationDistance = await getDistance(location);
        return { ...location, distance: locationDistance };
      }));
      navigation.navigate("SearchDirections", {
        item: item,
        relatedLocations: nearbyLocationsWithDistance,
        distance: distance,
      });
      props.updatePlace(item);
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

  const renderContentPortrait = () => (
    <>
      <SafeAreaInsetsContext.Consumer>
        {(insets) => (
          <View pointerEvents="box-none"
            style={[
              styles.contentTop,
              { paddingTop: insets.top + (Platform.OS === 'ios' ? 0 : Metrics.tiny) }
            ]}
          >
            <View style={styles.viewContentTopLeft}>
              <NavigationSpeed />
            </View>
            <View style={[styles.viewMenuTop]}>
              {renderZoom()}
            </View>
          </View>

        )}
      </SafeAreaInsetsContext.Consumer>

      <SafeAreaView pointerEvents="box-none" style={[
        styles.contentBottom,
        {
          paddingBottom: Platform.OS === 'ios' ? Metrics.tiny : Metrics.normal
        }
      ]}
      >
        <View style={[
          styles.viewMenuBottom
        ]}>
          {renderWeather()}
          {isMenuVisible && renderItem()}
          {isCloseVisible && renderOverViewMenu()}
        </View>
        {renderSearchBtn()}
      </SafeAreaView>

    </>
  )

  const renderContentHorizontal = () => (
    <>
      <SafeAreaInsetsContext.Consumer>
        {(insets) => (
          <View
            style={[
              styles.contentTop,
              {
                paddingHorizontal: isPortrait ? Metrics.small : (Platform.OS === 'ios' ? insets.right : Metrics.small),
                paddingTop: Platform.OS === 'ios' ? Metrics.small : insets.top,
              }
            ]}
            pointerEvents='box-none'
          >
            <View style={styles.viewContentTopLeft}>
              <NavigationSpeed />

            </View>
            <View style={[styles.viewMenuTop]}>
              {renderZoom()}
            </View>
          </View>
        )}
      </SafeAreaInsetsContext.Consumer>

      <SafeAreaView
        style={[
          styles.contentBottom,
          {
            paddingHorizontal: isPortrait ? Metrics.small : (Platform.OS === 'ios' ? 0 : Metrics.small),
            paddingBottom: Platform.OS === 'ios' ? Metrics.tiny : Metrics.normal
          }
        ]}
        pointerEvents="box-none"
      >
        <View style={[styles.contentBottomLeft]}>
          {renderWeather()}
          {renderSearchBtn()}
        </View>
        {isMenuVisible && renderItem()}
        {isCloseVisible && renderOverViewMenu()}
      </SafeAreaView>

    </>
  )

  return (
    <>
      <SafeAreaInsetsContext.Consumer>
        {(insets) => (
          < >
            <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />

            <View style={styles.container}>
              <Map renderMap={renderKey} zoomLevelOut={zoomLevelOut} zoomLevelIn={zoomLevelIn} isMyLocation={isMyLocation}
                getAddressOverview={handleClickOver} />
              <HandleDeepLink />
              {isPortrait ? renderContentPortrait() : renderContentHorizontal()}

              {isViolationAlert && renderViolationAlert()}
              {isRadioVisible && renderRadio()}
              {isOpenSettings && renderSettingsBox()}
              {isStyleMapVisible && renderStyleMap()}
              {/* <HandleDeepLink /> */}
            </View>
          </>
        )}
      </SafeAreaInsetsContext.Consumer>
      {visibleAlert && renderAlert()}
    </>
  );
};


function mapStateToProps(state) {
  return {
    showScreen: state.app.showScreen,
    typeRouteInput: state.app.typeRouteInput,
    navigationFrom: state.app.navigationFrom,
    navigationTo: state.app.navigationTo,
    vehicle: state.app.vehicle,
    place: state.app.place,
    myLocation: state.app.myLocation,
    isReturn: state.app.isReturn,
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
  updateMapView: (mapView) => dispatch(appAction.mapView(mapView)),
  updateIsReturn: (isReturn) => dispatch(appAction.isReturn(isReturn)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Overview);
