
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
import { useNavigation } from '@react-navigation/native';
import styles from "./styles";
import { connect } from "react-redux";
import { Colors, Helpers, Images, Metrics, Fonts } from "@app/theme";
import * as appAction from "@app/storage/action/app";
// import styles from "./styles";
import i18n from "@app/i18n/i18n";
import MapLibreGL from "@maplibre/maplibre-react-native";
// import { Fonts } from "@app/theme";
import Map from "@app/modules/screens/Map/Map"
import StyleMap from "../Home/StyleMap/StyleMap";
import { SafeAreaInsetsContext, SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-community/async-storage";
import { useRoute, useIsFocused } from '@react-navigation/native';
import { useFocusEffect } from '@react-navigation/native';
import AlertError from "@app/modules/components/alert/AlertError/AlertError";
import { TouchableWithoutFeedback, Keyboard } from 'react-native';
import { useGetPlaceDetailFromLatLong } from "@app/hooks/place_detail.hook";
import { useGetDirection, useGetPlaceDetail } from "@app/hooks/place_detail.hook";
// import AlertError from "@app/modules/components/alert/AlertError/AlertError";
import { useTheme } from "@app/modules/components/context/ThemeContext";
import { PermissionsAndroid } from 'react-native';
import createStyles from './styles';
import Geolocation from 'react-native-geolocation-service';
import { haversineDistance } from '@app/libs/utils.js';
import storage from "@app/libs/storage";
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import AlertTrueFalse from "@app/modules/components/alert/AlertTrueFalse/AlertTrueFalse";
MapLibreGL.setAccessToken(null);
import { useOrientation } from "@app/modules/components/context/OrientationContext";
import createHorizontalStyles from "./horizontalStyles";


const ChooseLocation = (props) => {
  const [isMyLocation, setIsMyLocation] = useState(true);
  const useFetchGetPlaceDetailFromLatLong = useGetPlaceDetailFromLatLong();
  const useFetchGetPlaceDetail = useGetPlaceDetail();
  const [isStyleMapVisible, setIsStyleMapVisible] = useState(false);
  const [renderKey, setRenderKey] = useState(0);
  const [zoomLevelIn, setZoomLevelIn] = useState(0);
  const [zoomLevelOut, setZoomLevelOut] = useState(0);
  const [visibleAlert, setVisibleAlert] = useState(false);
  const [showSelectedLocation, setShowSelectedLocation] = useState(false);
  const [showInitialText, setShowInitialText] = useState(true);
  const [title, setTitle] = useState('');
  const route = useRoute();
  const isFocused = useIsFocused();
  const navigation = useNavigation();
  const useFetchGetDirection = useGetDirection();
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [mainText, setMainText] = useState('');
  const [description, setDescription] = useState('');
  const [distances, setDistances] = useState();
  const [totalDistance, setTotalDistance] = useState(0);
  const [styleMap, setStyleMap] = useState(undefined);
  const [isChooseLocation, setIsChooseLocation] = useState(true);


  const [visibleAlertTrueFalse, setVisibleAlertTrueFalse] = useState(false);
  const [type, setType] = useState();
  const [value, setValue] = useState();

  const [dimensions, setDimensions] = useState(Dimensions.get("window"));

  const { isDarkTheme } = useTheme();
  const { isPortrait } = useOrientation();
  const styles = isPortrait ?
    createStyles(isDarkTheme, dimensions.width, dimensions.height)
    : createHorizontalStyles(isDarkTheme, dimensions.width, dimensions.height);

  useEffect(() => {
    setIsChooseLocation(true);
    const onChange = ({ window }) => setDimensions(window);
    const subscription = Dimensions.addEventListener("change", onChange);

    return () => {
      subscription?.remove();
    };
  }, []);

  const getDistance = async (item) => {
    let distance = 0;
    let totalLength = 0;
    const currentLocation = props.myLocation; // Vị trí hiện tại của người dùng
    // console.log('------------props------------------', props)
    // Nếu là tìm kiếm "from" và không có "navigationTo"
    if (props.typeRouteInput === 'from' && !props.navigationTo) {
      if (!currentLocation) {
        return null;
      }
      // const place = await getPlaceDetail(item);
      const placeLocation = [item.geometry.location.lng, item.geometry.location.lat];
      distance = haversineDistance(currentLocation, placeLocation);
      return distance < 1 ? `${Math.round(distance * 1000)} m` : `${distance.toFixed(2)} km`;

      // Nếu là tìm kiếm "to" và không có "navigationFrom"
    } else if (props.typeRouteInput === 'to' && !props.navigationFrom) {
      if (!currentLocation) {
        return null;
      }
      // const place = await getPlaceDetail(item);
      const placeLocation = [item.geometry.location.lng, item.geometry.location.lat];
      distance = haversineDistance(currentLocation, placeLocation);
      return distance < 1 ? `${Math.round(distance * 1000)} m` : `${distance.toFixed(2)} km`;

      // Nếu là tìm kiếm "from" có navigationTo
    } else if (props.typeRouteInput === 'from') {
      console.log('-----------from----------', props.navigationTo)
      const fromPlaceDetail = await getPlaceDetail(props.navigationTo);
      // const toPlaceDetail = await getPlaceDetail(item);
      distance = haversineDistance(
        [fromPlaceDetail.results[0].geometry.location.lng, fromPlaceDetail.results[0].geometry.location.lat],
        [item.geometry.location.lng, item.geometry.location.lat]
      );
      return distance < 1 ? `${Math.round(distance * 1000)} m` : `${distance.toFixed(2)} km`;

      // Nếu là tìm kiếm "to" có navigationFrom
    } else if (props.typeRouteInput === 'to') {
      // console.log('-----------to-----------', props.navigationFrom)
      // console.log('3333333333333333333333', item)
      const fromPlaceDetail = await getPlaceDetail(props.navigationFrom);
      distance = haversineDistance(
        [fromPlaceDetail.results[0].geometry.location.lng, fromPlaceDetail.results[0].geometry.location.lat],
        [item.geometry.location.lng, item.geometry.location.lat]
      );
      return distance < 1 ? `${Math.round(distance * 1000)} m` : `${distance.toFixed(2)} km`;

      // Nếu là thêm hoặc cập nhật (add hoặc update)
    } else if (props.typeRouteInput === 'add' || props.typeRouteInput === 'update') {
      // console.log('3333333333333333333333', item)
      const fromPlaceDetail = await getPlaceDetail(props.navigationFrom);
      let totalLength = 0;

      // Tính khoảng cách từ `fromPlaceDetail` tới các điểm trong `navigationToArray`
      for (let i = 0; i < props.navigationToArray.length; i++) {
        const toPlaceDetail = await getPlaceDetail(props.navigationToArray[i]);
        const fromLocation = [fromPlaceDetail.results[0].geometry.location.lng, fromPlaceDetail.results[0].geometry.location.lat];
        const toLocation = [toPlaceDetail.results[0].geometry.location.lng, toPlaceDetail.results[0].geometry.location.lat];
        const length = haversineDistance(fromLocation, toLocation);
        console.log('--------------------------length---------------------', length)
        totalLength += length;
        setTotalDistance(totalLength);
      }

      // Tính khoảng cách từ `fromPlaceDetail` tới `item`
      // const toPlaceDetail = await getPlaceDetail(item);
      const toLocation = [item.geometry.location.lng, item.geometry.location.lat];
      distance = haversineDistance(
        [fromPlaceDetail.results[0].geometry.location.lng, fromPlaceDetail.results[0].geometry.location.lat],
        toLocation
      );

      // Tổng quãng đường cộng với quãng đường trước đó
      const kmDistance = distance + totalLength;
      return kmDistance < 1 ? `${Math.round(kmDistance * 1000)} m` : `${kmDistance.toFixed(2)} km`;
    }

    // Trả về kết quả mặc định nếu không thuộc các điều kiện trên
    return distance < 1 ? `${Math.round(distance * 1000)} m` : `${distance.toFixed(2)} km`;
  };



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
        `getPlaceDetail-ChooseLocation: ${error.message}`,
        [
          { text: i18n.t("alert.attributes.oke") },
        ]
      );
    }
    return placeDetail;
  }

  useEffect(() => {
    const locationTitle = route.params?.locationTitle;
    if (locationTitle) {
      setTitle(locationTitle);
    }
  }, [route.params?.locationTitle]);


  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     setShowInitialText(false);
  //   }, 6000);

  //   return () => clearTimeout(timer);
  // }, []);

  const handleMapPress = () => {
    setShowSelectedLocation(true);
    setShowInitialText(false); // Ẩn văn bản hướng dẫn
  };

  useFocusEffect(
    React.useCallback(() => {
      props.updatePlace(null)
      // if (props.myLocation != null) {
      //   props.updateMapView({
      //     location: [props.myLocation[0], props.myLocation[1]]
      //   })
      // }
      return () => {
        console.log('Cleanup khi rời khỏi màn hình');
      };
    }, [])
  );

  useEffect(async () => {
    // moveToMarker();
    setRenderKey(prevKey => prevKey + 1);
  }, [route.params?.setView, isFocused])

  useEffect(async () => {
    const isSelectedStyleMap = await storage.get('isSelectedStyleMap');
    if (isSelectedStyleMap) {
      const style = await AsyncStorage.getItem('styleMap');
      setStyleMap(style);
    }
  }, [])

  // -------------------------------------------------------------------------------------------------------------------------------------------------------------------
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

  const openAlertTrueFalse = async (data, selectedAddress, locationTitle) => {
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
      console.log('------------------------------TRUE----------------------------')
      setVisibleAlertTrueFalse(true);
      setValue({
        selectedAddress,
        locationTitle,
      })
      return
    } else {
      navigation.navigate("FavoriteAddress", {
        selectedAddress,
        locationTitle,
      });
    }
  };

  const moveToMarker = async () => {
    console.log('move to marker')
    if (props.myLocation != null) {
      setIsMyLocation(!isMyLocation);
    } else {

      openAlert();
    }
    // const granted = await requestLocationPermission();
    if (props.myLocation != null) {
      const place = await getPlaceDetailFromLatLong(props.myLocation[1], props.myLocation[0]);
      // console.log('========================place========================', place)
      const selectedAddress = {
        item: place
      };
      // openAlertTrueFalse(place, selectedAddress, title)
      if (title === 'from' || title === 'to' || title === 'add') {
        const dis = await getDistance(place)
        setDistances(dis)
      }

      setSelectedLocation(place)
      if (place) {
        // Lấy tên địa điểm từ `place`
        const mainText = place.formatted_address || place.name || "Unknown Location";
        const description = place.vicinity || place.formatted_address || "";
        // Cập nhật vào state để hiển thị
        setMainText(mainText);
        setDescription(description);
        setShowSelectedLocation(true); // Hiển thị phần text
        handleMapPress();
      }
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
        `getPlaceDetailFromLatLong-ChooseLocation: ${error.message}`,
        [
          { text: i18n.t("alert.attributes.oke") },
        ]
      );
    }
    return place;
  }

  const requestLocationPermission = async () => {
    if (Platform.OS === 'ios') {
      Geolocation.requestAuthorization();
      getCurrentLocation();
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

  const handleRender = async () => {
    setRenderKey(prevKey => prevKey + 1);
    const style = await AsyncStorage.getItem('styleMap');
    if (style) {
      setStyleMap(style);
    }
  };


  const renderStyleMap = () => {
    return (
      <StyleMap isVisible={isStyleMapVisible} onClose={closeStyleMap} renderAction={handleRender} />
    )
  }

  const renderAlert = () => {
    return (
      <AlertError title={i18n.t("alert.attributes.noMyLocation")}
        body={i18n.t("alert.attributes.setMyLocation")}
        handleClose={closeAlert}
      />
    )
  }


  const handleBackLocation = () => {
    setIsChooseLocation(false);
    navigation.goBack();
  };

  const handleCLick = async (data) => {
    console.log("______________-logs_______", title)

    if (props.myLocation != null && (title === 'from' || title === 'to' || title === 'add')) {
      const dis = await getDistance(data)
      console.log('-------------------dis-------------------', dis)
      setDistances(dis)

    }
    setSelectedLocation(data)
    setDescription(data.address)
    setMainText(data.formatted_address)
    handleMapPress();


  }


  const handleSaveLocation = async (data) => {

    const title = route.params?.locationTitle
    console.log('------------------------title---------------------------')
    if (title === 'from') {
      const { formatted_address, address } = selectedLocation
      const selectedAddress = {
        ...selectedLocation, structured_formatting: { main_text: formatted_address }, description: formatted_address
      }
      props.updateNavigationFrom(selectedAddress);
      props.updateShowScreen("Route");
      navigation.navigate('Route', {
        from: "chooseLocation"
      })
    }
    else if (title === 'to') {
      const { formatted_address, address } = selectedLocation
      const selectedAddress = {
        ...selectedLocation, structured_formatting: { main_text: formatted_address }, description: formatted_address
      }
      props.updateNavigationTo(selectedAddress);
      props.updateShowScreen("Route");
      navigation.navigate('Route', {
        from: "chooseLocation"
      })
    }
    else if (title === 'add') {
      const { formatted_address, address } = selectedLocation
      const selectedAddress = {
        ...selectedLocation, structured_formatting: { main_text: formatted_address }, description: formatted_address
      }
      props.updateNavigationToArray([...props.navigationToArray, selectedAddress]);
      props.updateShowScreen("addLocation");
      navigation.navigate('Route')
    }
    else if (title === 'Favorite') {
      const { formatted_address, address } = selectedLocation
      const selectedAddress = {
        item: { ...selectedLocation, structured_formatting: { main_text: address }, description: formatted_address },
        locationTitle: title
      }

      const FavoriteList = await AsyncStorage.getItem('Favorite')
      const FavoriteListJson = JSON.parse(FavoriteList) || []
      const { place_id } = address
      const placeIdList = FavoriteListJson?.map((e) => { return e.item.place_id })
      if (placeIdList.includes(place_id)) {
        return
      } else {
        if (FavoriteListJson.length === 3) {
          FavoriteListJson[0] = selectedAddress
          const addressString = JSON.stringify(FavoriteListJson)
          await AsyncStorage.setItem(`${data}`, addressString)
        } else {
          FavoriteListJson.push(selectedAddress)
          const addressString = JSON.stringify(FavoriteListJson)
          await AsyncStorage.setItem(`${data}`, addressString)
        }
      }
      openAlertTrueFalse(selectedLocation, selectedAddress, title)
      // navigation.navigate('FavoriteAddress', {
      //   selectedAddress,
      //   locationTitle: title
      // })

    } else {
      const { formatted_address, address } = selectedLocation
      const selectedAddress = {
        item: { ...selectedLocation, structured_formatting: { main_text: address }, description: formatted_address },
        locationTitle: title
      }

      console.log('******************selectedAddress*******************', selectedLocation)
      const addressString = JSON.stringify(selectedAddress)
      await AsyncStorage.setItem(`${title}`, addressString)
      openAlertTrueFalse(selectedLocation, selectedAddress, title)
      // navigation.navigate('FavoriteAddress', {
      //   selectedAddress,
      //   locationTitle: title
      // })

    }
    setIsChooseLocation(false);

  };

  const renderContentPortrait = (insets) => (
    <View style={[
      styles.content,
      {
        paddingTop: insets.top,
        paddingBottom: Platform.OS === 'ios' ? insets.bottom : Metrics.regular
      },
    ]}
      pointerEvents="box-none"
    >
      <View style={styles.contentTop}>
        <View style={styles.contentTopLeft}>
          <TouchableOpacity onPress={handleBackLocation} style={styles.btnback}>
            <Image source={Images.arrowBack} style={[
              styles.icArrowBack,
              styleMap ? (styleMap !== 'dark' ? styles.blackIcon : styles.whiteIcon) : {}
            ]}
            />
          </TouchableOpacity>
          <Text style={[
            styles.textContentTop,
            styleMap ? (styleMap !== 'dark' ? styles.blackText : styles.whiteText) : {}
          ]}>
            {i18n.t("overview.chooseLocation.selectLocationOnTheMap")}
          </Text>
        </View>
        <View style={styles.contentTopRight}>
          <View style={styles.viewContentIconTop}>
            <TouchableOpacity style={styles.optionStyleBtn} onPress={zoomIn}>
              <View
                style={[
                  styles.viewHeaderIconTop,
                  styles.topMargin,
                ]}
              >
                <Image source={Images.plus} style={styles.icon_Style} />
              </View>
            </TouchableOpacity>
            <View style={styles.underline}></View>
            <TouchableOpacity style={styles.optionStyleBtn} onPress={zoomOut} >
              <View
                style={[
                  styles.viewHeaderIconTop,
                  styles.normalMargin,
                ]}
              >
                <Image source={Images.minus} style={styles.icon_Style} />
              </View>
            </TouchableOpacity>
            <View style={styles.underline}></View>
            <TouchableOpacity style={styles.optionStyleBtn} onPress={handleStyleMap}>
              <View style={[styles.viewHeaderIconTop, styles.boxTransfer]}>
                <Image source={Images.box} style={styles.icon_Style} />
              </View>
            </TouchableOpacity>
          </View>

        </View>
      </View>

      <View style={styles.contentBottom}>
        <View style={[styles.viewMyLoacation]}>
          <TouchableOpacity onPress={moveToMarker}>
            <View style={styles.iconLocationBackground}>
              <Image style={styles.icon} source={Images.currentLocation} />
            </View>
          </TouchableOpacity>
        </View>

        {showInitialText && (
          <View style={styles.containerText}>
            <View>
              <Image source={Images.hand} style={styles.iconHand} />
            </View>
            <View style={styles.textContentHand}>

              <Text
                style={
                  styles.textHand}>

                {i18n.t("overview.chooseLocation.touchMapToSelectLocation")}
              </Text>
            </View>
          </View>
        )}

        {showSelectedLocation && (
          <View style={styles.containerTextLocation}>
            <View style={styles.selectedLocationContainer}>
              <>
                <Text
                  numberOfLines={2}
                  ellipsizeMode='tail'
                  style={styles.selectedLocationText}>
                  {mainText}

                </Text>
                <Text
                  numberOfLines={1}
                  ellipsizeMode='tail'
                  style={styles.selectedLocationDescription}>

                  {description}
                </Text>

                {distances && (title === 'from' || title === 'to' || title === 'add') && (
                  <Text style={styles.selectedDistances}>
                    {distances}
                  </Text>
                )}

              </>
            </View>

            <TouchableOpacity
              onPress={() => handleSaveLocation(title)}
              style={styles.saveButton} >

              {title !== 'from' && title !== 'to' && title !== 'add' && (
                <Text style={styles.saveButtonText}>
                  {i18n.t("overview.chooseLocation.saveLocation")}
                </Text>
              )}

              {title === 'from' && (
                <Text style={styles.saveButtonText}>
                  {i18n.t("overview.chooseLocation.chooseStartingPoint")}
                </Text>
              )}
              {title === 'to' && (
                <Text style={styles.saveButtonText}>
                  {i18n.t("overview.chooseLocation.chooseDestination")}
                </Text>
              )}
              {title === 'add' && (
                <Text style={styles.saveButtonText}>
                  {i18n.t("overview.chooseLocation.addDestination")}
                </Text>
              )}
            </TouchableOpacity>
          </View>
        )}

      </View>

    </View>
  )
  const renderContentHorizontal = (insets) => (
    <View style={[
      styles.content,
      {
        paddingTop: insets.top,
        paddingBottom: Platform.OS === 'ios' ? insets.bottom : Metrics.regular,
        paddingHorizontal: Platform.OS === 'ios' ? insets.left : Metrics.small,
      }
    ]}>
      <View style={styles.contentLeft}>
        <View style={styles.contentTopLeft}>
          <TouchableOpacity onPress={handleBackLocation} style={styles.btnback}>
            <Image source={Images.arrowBack} style={[
              styles.icArrowBack,
              styleMap ? (styleMap !== 'dark' ? styles.blackIcon : styles.whiteIcon) : {}
            ]}
            />
          </TouchableOpacity>
          <Text style={[
            styles.textContentTop,
            styleMap ? (styleMap !== 'dark' ? styles.blackText : styles.whiteText) : {}
          ]}>
            {i18n.t("overview.chooseLocation.selectLocationOnTheMap")}
          </Text>
        </View>

        {showInitialText && (
          <View style={styles.containerText}>
            <View>
              <Image source={Images.hand} style={styles.iconHand} />
            </View>
            <View style={styles.textContentHand}>
              <Text style={styles.textHand}>
                {i18n.t("overview.chooseLocation.touchMapToSelectLocation")}
              </Text>
            </View>
          </View>
        )}

        {showSelectedLocation && (
          <View style={styles.containerTextLocation}>
            <View style={styles.selectedLocationContainer}>
              <>
                <Text
                  numberOfLines={2}
                  ellipsizeMode='tail'
                  style={styles.selectedLocationText}>
                  {mainText}

                </Text>
                <Text
                  numberOfLines={1}
                  ellipsizeMode='tail'
                  style={styles.selectedLocationDescription}>

                  {description}
                </Text>

                {distances && (title === 'from' || title === 'to' || title === 'add') && (
                  <Text style={styles.selectedDistances}>
                    {distances}
                  </Text>
                )}

              </>
            </View>

            <TouchableOpacity
              onPress={() => handleSaveLocation(title)}
              style={styles.saveButton} >

              {title !== 'from' && title !== 'to' && title !== 'add' && (
                <Text style={styles.saveButtonText}>
                  {i18n.t("overview.chooseLocation.saveLocation")}
                </Text>
              )}

              {title === 'from' && (
                <Text style={styles.saveButtonText}>
                  {i18n.t("overview.chooseLocation.chooseStartingPoint")}
                </Text>
              )}
              {title === 'to' && (
                <Text style={styles.saveButtonText}>
                  {i18n.t("overview.chooseLocation.chooseDestination")}
                </Text>
              )}
              {title === 'add' && (
                <Text style={styles.saveButtonText}>
                  {i18n.t("overview.chooseLocation.addDestination")}
                </Text>
              )}
            </TouchableOpacity>
          </View>
        )}
      </View>
      <View style={styles.contentRight}>
        <View style={styles.contentTopRight}>
          <View style={styles.viewContentIconTop}>
            <TouchableOpacity style={styles.optionStyleBtn} onPress={zoomIn}>
              <View
                style={[
                  styles.viewHeaderIconTop,
                  styles.topMargin,
                ]}
              >
                <Image source={Images.plus} style={styles.icon_Style} />
              </View>
            </TouchableOpacity>
            <View style={styles.underline}></View>
            <TouchableOpacity style={styles.optionStyleBtn} onPress={zoomOut} >
              <View
                style={[
                  styles.viewHeaderIconTop,
                  styles.normalMargin,
                ]}
              >
                <Image source={Images.minus} style={styles.icon_Style} />
              </View>
            </TouchableOpacity>
            <View style={styles.underline}></View>
            <TouchableOpacity style={styles.optionStyleBtn} onPress={handleStyleMap}>
              <View style={[styles.viewHeaderIconTop, styles.boxTransfer]}>
                <Image source={Images.box} style={styles.icon_Style} />
              </View>
            </TouchableOpacity>
          </View>

        </View>

        <View style={[styles.viewMyLoacation]}>
          <TouchableOpacity onPress={moveToMarker}>
            <View style={styles.iconLocationBackground}>
              <Image style={styles.icon} source={Images.currentLocation} />
            </View>
          </TouchableOpacity>
        </View>

      </View>
    </View>
  )

  // -----------------------------------------------------------------------------------------------------
  return (
    <TouchableWithoutFeedback onPress={() => {
      Keyboard.dismiss();

    }}>
      <SafeAreaInsetsContext.Consumer>
        {(insets) => (
          <View style={styles.container}>
            <Map key={renderKey} zoomLevelOut={zoomLevelOut} zoomLevelIn={zoomLevelIn} isMyLocation={isMyLocation}
              getAddress={handleCLick}
              isChooseLocation={isChooseLocation}
            />

            {isPortrait ? renderContentPortrait(insets) : renderContentHorizontal(insets)}

            {visibleAlert && renderAlert()}
            {isStyleMapVisible && renderStyleMap()}
            {visibleAlertTrueFalse && renderAlertTrueFalse()}
          </View>
        )}
      </SafeAreaInsetsContext.Consumer >
    </TouchableWithoutFeedback >

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
    navigationToArray: state.app.navigationToArray,
    route: state.app.route,
    routeResult: state.app.routeResult,
    isRouting: state.app.isRouting,
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
  updateNavigationToArray: (navigationToArray) => dispatch(appAction.navigationToArray(navigationToArray)),
  updateRouteResult: (routeResult) => dispatch(appAction.routeResult(routeResult)),
  updateRoute: (route) => dispatch(appAction.route(route)),
  updateIsRouting: (isRouting) => dispatch(appAction.isRouting(isRouting)),
  updateMapView: (mapView) => dispatch(appAction.mapView(mapView)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ChooseLocation);
