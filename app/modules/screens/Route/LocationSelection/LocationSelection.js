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
  Modal,
  Button,
  Platform,
} from "react-native";
import { connect } from "react-redux";
import React, { Fragment, useState, useRef, useEffect, useCallback, useContext } from "react";
import i18n from "@app/i18n/i18n";
import { Colors as Themes, Helpers, Images, Metrics, Fonts } from "@app/theme";
import * as appAction from "@app/storage/action/app";
import AsyncStorage from '@react-native-community/async-storage';
import { useGetAutoComplete } from "@app/hooks/place_detail.hook";
import { useRoute, useNavigation } from '@react-navigation/native';
import { SafeAreaInsetsContext, SafeAreaView } from "react-native-safe-area-context";
import { useGetPlaceDetailFromLatLong, useGetPlaceDetail, useGetPlaceDetailFromAddress } from "@app/hooks/place_detail.hook";
import AlertError from "@app/modules/components/alert/AlertError/AlertError";
import Geolocation from 'react-native-geolocation-service';
import { PermissionsAndroid } from 'react-native';
import { useTheme } from "@app/modules/components/context/ThemeContext";
import createStyles from "./styles";
import AlertTrueFalse from "@app/modules/components/alert/AlertTrueFalse/AlertTrueFalse";
import VoiceSearch from "@app/modules/screens/Search/SearchScreen/VoiceSearch";
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import { useOrientation } from "@app/modules/components/context/OrientationContext";
import createHorizontalStyles from "./horizontalStyles";
import { RadioContext } from "@app/modules/screens/Radio/RadioProvider";

const LocationSelection = (props) => {
  const navigation = useNavigation();
  const route = useRoute();
  const [title, setTitle] = useState("");
  const [name, setName] = useState("");
  const useFetchGetAutoComplete = useGetAutoComplete();
  const [dataAutoComplete, setDataAutoComplete] = useState([]);
  const useFetchGetPlaceDetailFromLatLong = useGetPlaceDetailFromLatLong();
  const [searchHistory, setSearchHistory] = useState();
  const [visibleAlert, setVisibleAlert] = useState(false);
  const [currentLocation, setCurrentLocation] = useState([105.79829597455202, 21.013715429594125]);
  const [favorites, setFavorites] = useState([]);
  const [isShowButtonMyLocation, setIsShowButtonMyLocation] = useState(true);
  const [visibleAlertTrueFalse, setVisibleAlertTrueFalse] = useState(false);
  const [isAcceptAlert, setIsAcceptAlert] = useState(false);
  const [value, setValue] = useState();
  const [type, setType] = useState();
  const [isVoiceSearch, setIsVoiceSearch] = useState(false);
  const [dimensions, setDimensions] = useState(Dimensions.get("window"));
  const useFetchGetPlaceDetailFromAddress = useGetPlaceDetailFromAddress();

  const { resumeRadio } = useContext(RadioContext);
  const { isDarkTheme } = useTheme();
  const Colors = Themes[isDarkTheme ? 'darkMode' : 'lightMode'];
  const { isPortrait } = useOrientation();
  const styles = isPortrait ?
    createStyles(isDarkTheme, dimensions.width, dimensions.height)
    : createHorizontalStyles(isDarkTheme, dimensions.width, dimensions.height);

  const useFetchGetPlaceDetail = useGetPlaceDetail();

  useEffect(() => {
    const onChange = ({ window }) => setDimensions(window);
    const subscription = Dimensions.addEventListener("change", onChange);

    return () => {
      subscription?.remove();
    };
  }, []);


  const handleChooseLocation = () => {
    console.log('----------------------------NAME-----------------------', name)
    navigation.navigate('ChooseLocation', {
      locationTitle: name
    })
  };


  useEffect(async () => {
    if (route.params?.locationTitle) {
      setTitle(route.params.locationTitle);
      if (route.params.locationTitle === 'Home') {
        setName('Home')
        setTitle(i18n.t("overview.searchFavorite.setHomeAddress"));
      } else if (route.params.locationTitle === 'Office') {
        setName('Office')
        setTitle(i18n.t("overview.searchFavorite.setOfficeAddress"));
      } else if (route.params.locationTitle === 'Favorite') {
        setName('Favorite')
        setTitle(i18n.t("overview.searchFavorite.addFavoritePlace"));
      }
    } else if (props.typeRouteInput === "from") {
      setName('from')
      setTitle(i18n.t("route.attributes.selectStartingPoint"));
    } else if (props.typeRouteInput === "to") {
      setName('to')
      setTitle(i18n.t("route.attributes.selectDestination"));
    } else if (props.typeRouteInput === "add" || props.typeRouteInput === "update") {
      setName('add')
      setTitle(i18n.t("route.attributes.addLocation"));
    }

    if (props.myLocation != null) {
      const place = await getPlaceDetailFromLatLong(props.myLocation[1], props.myLocation[0]);
      if (props.navigationFrom != null) {
        if (props.navigationFrom.place_id == place.place_id) {
          setIsShowButtonMyLocation(false)
        }
      }
      if (props.navigationTo != null) {
        if (props.navigationTo.place_id == place.place_id) {
          setIsShowButtonMyLocation(false)
        }
      }
    }
  }, [props.typeRouteInput, route.params?.locationTitle]);


  useEffect(async () => {
    await loadSearchHistory();
    if (props.myLocation != null) {
      setCurrentLocation(props.myLocation)
    };
  }, []);



  const loadSearchHistory = async () => {
    try {
      const history = await AsyncStorage.getItem('searchHistory');
      if (history) {
        setSearchHistory(JSON.parse(history));
        // isHome(JSON.parse(history))
        // isOffice(JSON.parse(history))
        isFavoriteList()
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


  // const isHome = async (data) => {
  //   const HomeList = await AsyncStorage.getItem('Home')
  //   const HomeListJson = JSON.parse(HomeList)
  //   const { place_id } = HomeListJson.item
  //   const placeIdList = data.map((e) => { return e.place_id })
  //   if (placeIdList.includes(place_id)) {
  //     setFavorites(prev => {
  //       return [...prev, place_id]
  //     })
  //   }
  // }

  // const isOffice = async (data) => {
  //   const OfficeList = await AsyncStorage.getItem('Office')
  //   const OfficeListJson = JSON.parse(OfficeList)
  //   const { place_id } = OfficeListJson.item
  //   const placeIdList = data.map((e) => { return e.place_id })
  //   if (placeIdList.includes(place_id)) {
  //     setFavorites(prev => {
  //       return [...prev, place_id]
  //     })

  //   }
  // }

  const isFavoriteList = async () => {
    const FavoriteList = await AsyncStorage.getItem('Favorite')
    const FavoriteListJson = JSON.parse(FavoriteList)
    const placeIdList = FavoriteListJson?.map((e) => { return e.item.place_id })

    placeIdList?.map((x) => {
      setFavorites(prev => {
        return [...prev, x]
      })
    })

  }







  const handleToRoute = () => {
    const { fromScreen } = route.params || {};
    // navigation.goBack();
    if (fromScreen === "FavoriteAddress") {
      navigation.navigate("FavoriteAddress", { refresh: new Date().getTime() });
    }
    else {
      // Default fallback
      if (props.typeRouteInput === "add" || props.typeRouteInput === "update") {
        props.updateShowScreen("navigation");
        props.updateShowScreen("addLocation");
      } else {
        props.updateShowScreen("navigation");
      }

    }
  };

  const handleChangeSearch = (newText) => {
    // setText(newText);
    if (newText.length > 0) {
      // setIsSearchActive(false);
      const params = {
        location: `${currentLocation[1]}, ${currentLocation[0]}`, // Cập nhật với vị trí hiện tại của bạn
        searchText: newText,
      };
      useFetchGetAutoComplete.mutateAsync(params).then(async (response) => {

        if (response.predictions.length > 0) {
          setDataAutoComplete(response.predictions)
        }

      });
    }
  };


  const setLocationRoute = async (items, index) => {
    console.log('--------------------items----------------', items)
    setSearchHistory(await setSearchHistoryToAsyncStorage(items))
    const { fromScreen, locationTitle } = route.params || {};
    const params = {
      location: `${currentLocation[1]}, ${currentLocation[0]}`,
      searchText: items.structured_formatting.main_text,
    };

    try {
      const response = await useFetchGetAutoComplete.mutateAsync(params);
      const predictions = response.predictions || [];
      const item = response.predictions[index]

      const selectedAddress = {
        relatedLocations: predictions,
        // item: index + 1 ? items : item
        item: items
      };
      if (fromScreen === "FavoriteAddress") {
        openAlertTrueFalse(items, selectedAddress, locationTitle)
      }

      else {
        if (props.typeRouteInput === "from") {
          props.updateNavigationFrom(items);
          props.handleTextInputFrom(null);
          props.updateShowScreen("navigation");
        } else if (props.typeRouteInput === "to") {
          props.updateNavigationTo(items);
          props.handleTextInputTo(null);
          props.updateShowScreen("navigation");
        } else if (props.typeRouteInput === "add") {
          props.updateNavigationToArray([...props.navigationToArray, items])
          props.handleTextInputTo(null);
          props.updateShowScreen("navigation");
          props.updateShowScreen("addLocation");
        }
        else if (props.typeRouteInput === "update") {
          if (props.indexLocationTo != 0) {
            const array = props.navigationToArray;
            array[props.indexLocationTo - 1] = items;
            props.updateNavigationToArray([...array])
            props.updateShowScreen("navigation");
            props.updateShowScreen("addLocation");
          } else {
            props.updateNavigationFrom(items);
            props.handleTextInputFrom(null);
            props.updateShowScreen("navigation");
            props.updateShowScreen("addLocation");
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


  const requestLocationPermission = async () => {
    if (Platform.OS === 'ios') {
      // const status = await check(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
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
          Alert.alert(
            i18n.t("alert.attributes.warning"),
            error.message || i18n.t("alert.attributes.warning"),
            [
              { text: i18n.t("alert.attributes.oke") },
            ]
          );
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
      );
    } catch (error) {
      openAlert();
    }
  };
  const getMyLocation = async () => {
    if (props.myLocation == null) {
      await requestLocationPermission();
    }
  }

  const selectMyLocation = async () => {
    const { fromScreen, locationTitle, addressType } = route.params || {};
    // const granted = await requestLocationPermission();
    if (props.myLocation != null) {
      const place = await getPlaceDetailFromLatLong(props.myLocation[1], props.myLocation[0]);
      place.myLocation = true;
      const selectedAddress = {
        item: place
      };
      // const selectedAddress = {
      //   item: {
      //     structured_formatting: {
      //       main_text: place.structured_formatting?.main_text || place.name, // Ensure main_text is set
      //     },
      //     description: place.formatted_address || place.description, // Set the full address description
      //   },
      // };
      if (fromScreen === "FavoriteAddress") {
        // navigation.navigate("FavoriteAddress", {
        //   selectedAddress,
        //   locationTitle,
        // });

        openAlertTrueFalse(place, selectedAddress, locationTitle)
      }

      else {
        if (props.typeRouteInput === "from") {
          props.updateNavigationFrom(place);
          props.handleTextInputFrom(`${i18n.t("route.attributes.yourLocation")}`);
        } else if (props.typeRouteInput === "to") {
          props.updateNavigationTo(place);
          props.handleTextInputTo(`${i18n.t("route.attributes.yourLocation")}`);
        }
        else if (props.typeRouteInput === "add") {
          props.updateNavigationToArray([...props.navigationToArray, place])
          props.handleTextInputTo(null);
          // props.updateShowScreen("navigation");
          props.updateShowScreen("addLocation");
        }
        else if (props.typeRouteInput === "update") {
          if (props.indexLocationTo != 0) {
            const array = props.navigationToArray;
            array[props.indexLocationTo - 1] = place;
            props.updateNavigationToArray([...array])
            // props.updateShowScreen("navigation");
            props.updateShowScreen("addLocation");
          } else {
            props.updateNavigationFrom(place);
            props.handleTextInputFrom(null);
            // props.updateShowScreen("navigation");
            props.updateShowScreen("addLocation");
          }
        }
        props.updateShowScreen("navigation");
      }

    }
    else {
      openAlert();
    }
  };

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

  const openAlert = () => {
    setVisibleAlert(true);
  };

  const closeAlert = () => {
    setVisibleAlert(false);
  };

  const openAlertTrueFalse = async (data, selectedAddress, locationTitle) => {
    // // setVisibleAlertTrueFalse(true);
    let check = false;
    const FavoriteList = await AsyncStorage.getItem('Favorite');
    if (FavoriteList) {
      const FavoriteListJson = JSON.parse(FavoriteList);
      const placeIdList = FavoriteListJson?.map((e) => e?.item.place_id);
      const placeIdAddress = data.place_id;
      if (placeIdList.includes(placeIdAddress) && locationTitle != "Favorite") {
        check = true;
      }
    }

    const OfficeList = await AsyncStorage.getItem('Office');
    if (OfficeList) {
      const OfficeListJson = JSON.parse(OfficeList);
      const { place_id } = OfficeListJson.item;
      const placeIdAddress = data.place_id;
      if (place_id === placeIdAddress && locationTitle != "Office") {
        check = true;
        setType('Office')
      }
    }

    const HomeList = await AsyncStorage.getItem('Home');
    if (HomeList) {
      const HomeListJson = JSON.parse(HomeList);
      const { place_id } = HomeListJson.item;
      const placeIdAddress = data.place_id;
      if (place_id === placeIdAddress && locationTitle != "Home") {
        check = true;
        setType('Home')
      }
    }
    if (check == true) {
      setVisibleAlertTrueFalse(true);
      setValue({
        selectedAddress,
        locationTitle,
      })
    } else {
      navigation.navigate("FavoriteAddress", {
        selectedAddress,
        locationTitle,
      });
    }
  };

  const closeAlertTrueFalse = () => {
    setVisibleAlertTrueFalse(false);
  };

  const acceptAlert = async () => {
    // setIsAcceptAlert(true);

    const selectedAddress = value.selectedAddress;
    const locationTitle = value.locationTitle;
    if (value.locationTitle === "Favorite") {
      await AsyncStorage.removeItem(type)
      // navigation.navigate("FavoriteAddress");
    } else {
      if (type == "Home" || type == "Office") {
        await AsyncStorage.removeItem(type)
      } else {
        const FavoriteList = await AsyncStorage.getItem('Favorite');
        if (FavoriteList) {
          const FavoriteListJson = JSON.parse(FavoriteList);
          const placeIdList = FavoriteListJson?.map((e) => e?.item.place_id);
          // const placeIdAddress = data.place_id;
          const index = placeIdList.indexOf(value.selectedAddress.item.place_id)
          FavoriteListJson.splice(index, 1)
          const addressString = JSON.stringify(FavoriteListJson)
          await AsyncStorage.setItem(`Favorite`, addressString)
        }
      }
    }
    navigation.navigate("FavoriteAddress", {
      selectedAddress,
      locationTitle,
    });
    // console.log("__________________chấp nhận ", selectedAddress)
    setVisibleAlertTrueFalse(false);
  };

  const renderAlertTrueFalse = () => {
    return (
      <AlertTrueFalse
        title={i18n.t("alert.attributes.isFavorite")}
        body={i18n.t("alert.attributes.setFavorite")}
        handleClose={closeAlertTrueFalse}
        handleAccept={acceptAlert}
      />
    )
  }

  const saveSearchHistory = async (history) => {
    try {
      await AsyncStorage.setItem('searchHistory', JSON.stringify(history));
    }
    catch (error) {
      Alert.alert(
        i18n.t("alert.attributes.warning"),
        error.message || i18n.t("alert.attributes.warning"),
        [
          { text: i18n.t("alert.attributes.oke") },
        ]
      );
    }
  };

  const setSearchHistoryToAsyncStorage = async (item) => {
    if (item.location || item.geometry) {
      item = item
    } else {

      const paramsPlace = {
        address: item.description,
      };
      const response = await useFetchGetPlaceDetailFromAddress.mutateAsync(paramsPlace);
      item.location = response.results[0].geometry.location
    }
    const existingItem = searchHistory ? searchHistory.find(historyItem => historyItem.place_id === item.place_id) : undefined;
    if (existingItem) {
      return searchHistory; // Không thêm nếu đã tồn tại
    }
    let updatedHistory = searchHistory ? [item, ...searchHistory] : [item];
    if (updatedHistory.length > 50) {
      updatedHistory = updatedHistory.slice(0, 50);
    }
    saveSearchHistory(updatedHistory);

    return updatedHistory;
  }

  const handleCloseVoiceSearch = useCallback(() => {
    setIsVoiceSearch(false);
    resumeRadio();
  }, []);
  const handleShowVoiceSearch = () => {
    setIsVoiceSearch(true);
  };

  const handleVoiceSearch = useCallback(async (searchText) => {
    const params = {
      location: `${currentLocation[1]}, ${currentLocation[0]}`, // Cập nhật với vị trí hiện tại của bạn
      searchText: searchText,
    };
    useFetchGetAutoComplete.mutateAsync(params).then(async (response) => {
      if (response.predictions.length > 0) {
        setLocationRoute(response.predictions[0], 0);
      }
    });
  }, [searchHistory]);


  const renderAlert = () => {
    return (
      <AlertError title={i18n.t("alert.attributes.noMyLocation")}
        body={i18n.t("alert.attributes.setMyLocation")}
        handleClose={closeAlert}
      />
    )
  }

  const renderSearchData = (header, data) => {
    return (
      <View style={styles.searchDataView}>
        <View style={styles.searchDataHeader}>
          <Text style={styles.textGrey}>{header.toUpperCase()}</Text>
        </View>
        <FlatList
          data={data}
          renderItem={renderItemSearch}
          keyboardShouldPersistTaps="handled"
        />
      </View >
    )
  }

  const renderEmpty = () => {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>{i18n.t("overview.search.noSearchHistory")}</Text>
      </View >
    )
  }

  const renderItemSearch = ({ item, index }) => {
    return (
      <TouchableOpacity style={styles.searchDataItem} onPress={() => { setLocationRoute(item, index) }}>
        <View style={styles.searchDataText}>
          <Text style={styles.locationSelectionText}>
            {item.structured_formatting ? item.structured_formatting.main_text : item.name}
          </Text>
          <Text style={styles.secondaryText}>
            {item.structured_formatting ? item.structured_formatting.secondary_text : item.formatted_address}
          </Text>
        </View>
        {/* <TouchableOpacity onPress={async () => { favorites.includes(item.place_id) ? await handleToggleFavorite(item) : handleToggleFavoriteClose(item) }} style={styles.buttonStar}> */}
        <View>
          <Image

            style={[styles.iconStar, favorites.includes(item.place_id) ? {} : styles.iconColor]}
            source={favorites.includes(item.place_id) ? Images.starGold : Images.star}
          />
        </View>
        {/* </TouchableOpacity> */}
      </TouchableOpacity>
    )
  }

  const renderVoiceSearch = () => (
    <VoiceSearch
      handleClose={handleCloseVoiceSearch}
      // keyboardHeight={keyboardHeight}
      handleSearch={handleVoiceSearch}
      handleSaveVoiceSearchHistory={handleSaveVoiceSearchHistory}
    />
  )



  return (
    <>
      <View style={[
        styles.locationSelectionContainer,
        {
          paddingTop: (isPortrait && Platform.OS === 'ios') ? Metrics.tiny : 0
        }
      ]}>
        <SafeAreaView style={{ flex: 1, paddingHorizontal: isPortrait ? null : (Platform.OS === 'ios' ? 0 : Metrics.normal) }}>
          <View style={styles.locationSelectionTitle}>
            <TouchableOpacity onPress={handleToRoute}
              style={styles.btnBack}
            >
              <Image
                source={Images.arrowLeftSearch}
                style={[styles.locationSelectionTitleImg, styles.iconBack]}
              />
            </TouchableOpacity>
            <Text style={styles.locationSelectionTitleText}>{title}</Text>
          </View>
          <View style={styles.locationSelectionInput}>
            <TextInput
              style={styles.input}
              placeholder={i18n.t("route.attributes.enterLocation")}
              placeholderTextColor={Colors.textBrightGrey}
              onChangeText={handleChangeSearch}
              disableFullscreenUI={true}
            />
            <TouchableOpacity style={styles.btnVoice} onPress={handleShowVoiceSearch}>
              < Image source={Images.frame} style={[styles.iconFrame]} />
            </TouchableOpacity>
          </View>
          <View style={styles.selectLocationView}>
            <TouchableOpacity
              onPress={handleChooseLocation}

              style={styles.getLocationInMap}>
              <View style={styles.getLocationInMapLeft}>
                <Image
                  source={Images.locationRoute}
                  style={styles.getLocationInMapImg}
                />
                <Text style={styles.locationSelectionText}>{i18n.t("route.attributes.selectLocationOnTheMap")}</Text>
              </View>
              <Image
                source={Images.arrowRight}
                style={styles.getLocationInMapImgRight}
              />
            </TouchableOpacity>
            {isShowButtonMyLocation &&
              <>
                <View style={styles.spacerWidth}></View>
                <TouchableOpacity style={styles.currentLocation} onPress={async () => { await selectMyLocation() }}>
                  <View style={styles.getLocationInMapLeft}>
                    <Image
                      source={Images.myLocation}
                      style={styles.locationSelectionTitleImg}
                    />
                    <Text style={styles.locationSelectionText}>{i18n.t("route.attributes.yourLocation")}</Text>
                  </View>

                  <Image
                    source={Images.arrowRight}
                    style={styles.getLocationInMapImgRight}
                  />
                </TouchableOpacity>
              </>
            }
          </View>
          {/* <TouchableOpacity style={styles.currentLocation} onPress={selectMyLocation}> */}
          {/* {isShowButtonMyLocation &&
            <TouchableOpacity style={styles.currentLocation} onPress={async () => { await selectMyLocation() }}>
              <View style={styles.getLocationInMapLeft}>
                <Image
                  source={Images.myLocation}
                  style={styles.locationSelectionTitleImg}
                />
                <Text style={styles.locationSelectionText}>{i18n.t("route.attributes.yourLocation")}</Text>
              </View>

              <Image
                source={Images.arrowRight}
                style={styles.getLocationInMapImgRight}
              />
            </TouchableOpacity>
          } */}
          <View style={styles.locationSelectionHistory}>
            {/* <> */}
            {dataAutoComplete.length > 0 ?
              renderSearchData(i18n.t("route.attributes.searchContent"), dataAutoComplete) :
              (searchHistory ? renderSearchData(i18n.t("route.attributes.recentSearches"), searchHistory.slice(0, 5)) :
                renderEmpty())
            }

            {/* </> */}
          </View>
        </SafeAreaView>
      </View>
      {visibleAlert && renderAlert()}
      {visibleAlertTrueFalse && renderAlertTrueFalse()}
      {isVoiceSearch && renderVoiceSearch()}
    </>
  )
}

function mapStateToProps(state) {
  return {
    showScreen: state.app.showScreen,
    typeRouteInput: state.app.typeRouteInput,
    navigationFrom: state.app.navigationFrom,
    navigationTo: state.app.navigationTo,
    vehicle: state.app.vehicle,
    myLocation: state.app.myLocation,
    route: state.app.route,
    navigationToArray: state.app.navigationToArray,
  };
}
const mapDispatchToProps = (dispatch) => ({
  updateShowScreen: (show) => dispatch(appAction.showScreen(show)),
  updateTypeRouteInput: (type) => dispatch(appAction.typeRouteInput(type)),
  updateNavigationFrom: (from) => dispatch(appAction.navigationFrom(from)),
  updateNavigationTo: (to) => dispatch(appAction.navigationTo(to)),
  updateVehicle: (vehicle) => dispatch(appAction.vehicle(vehicle)),
  updateMyLocation: (myLocation) => dispatch(appAction.myLocation(myLocation)),
  updateRoute: (route) => dispatch(appAction.route(route)),
  updateNavigationToArray: (navigationToArray) => dispatch(appAction.navigationToArray(navigationToArray)),
});
export default connect(mapStateToProps, mapDispatchToProps)(LocationSelection);