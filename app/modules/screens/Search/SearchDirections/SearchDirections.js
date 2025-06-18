import React, { Fragment, useState, useRef, useEffect, useCallback, useContext } from "react";
import {
  TouchableOpacity,
  Dimensions,
  StyleSheet,
  Text,
  View,
  Image,
  FlatList,
  TouchableHighlight,
  TextInput,
  Alert,
  Platform,
} from "react-native";
import { connect } from "react-redux";
import { Colors as Themes, Helpers, Images, Metrics, Fonts } from "@app/theme";
import * as appAction from "@app/storage/action/app";
import i18n from "@app/i18n/i18n";
import { useGetAutoComplete, useGetPlaceDetail } from "@app/hooks/place_detail.hook";
;
import { screensEnabled } from "react-native-screens";
import Map from "@app/modules/screens/Map/Map"
import { useRoute, useNavigation, useIsFocused, useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-community/async-storage';
import { TouchableWithoutFeedback, Keyboard } from 'react-native';
import Share from 'react-native-share';
import StyleMap from "@app/modules/screens/Home/StyleMap/StyleMap";
import Radio from "@app/modules/screens/Radio/Radio";
import storage from "@app/libs/storage";
import SaveLocation from "../SaveLocation/SaveLocation";
import { RadioContext } from "@app/modules/screens/Radio/RadioProvider";
import AlertError from "@app/modules/components/alert/AlertError/AlertError";
import { useTheme } from "@app/modules/components/context/ThemeContext";
import createStyles from './styles';
import { SafeAreaInsetsContext, SafeAreaView } from "react-native-safe-area-context";
import { useOrientation } from "@app/modules/components/context/OrientationContext";
import createHorizontalStyles from "./horizontalStyles";

const screenHeight = Dimensions.get('window').height;
const SearchDirections = (props) => {
  const Colors = Themes[isDarkTheme ? 'darkMode' : 'lightMode'];
  const navigation = useNavigation();
  const route = useRoute(); // Make sure to define `route` first
  const { isPlaying, nameChannel } = useContext(RadioContext);
  const {
    // mainText: mainText,
    description: routeDescription,
    distance: routeDistance,  // This is the distance passed from handleLocationPress
    relatedLocations: routeRelatedLocations,
    isListVisible: initialIsListVisible,
    prevScreen: prevScreen,

  } = route.params || {};
  // const { mainText: routeMainText, description: routeDescription, distance: routeDistance, relatedLocations: routeRelatedLocations, isListVisible: initialIsListVisible } = route.params || {};
  const [isListVisible, setIsListVisible] = useState(initialIsListVisible || false);

  const [mainText, setMainText] = useState();
  const [description, setDescription] = useState();
  const [distance, setDistance] = useState();
  const [placeId, setPlaceId] = useState('');
  const [relatedLocations, setRelatedLocations] = useState(routeRelatedLocations || []);
  const [relatedLocationsList, setRelatedLocationsList] = useState(relatedLocations || []);
  const [inputText, setInputText] = useState();
  const { searchText } = route.params; // Lấy dữ liệu truyền vào
  const [autoCompleteData, setAutoCompleteData] = useState([]);
  const useFetchGetAutoComplete = useGetAutoComplete();
  const [showAutoComplete, setShowAutoComplete] = useState(false);

  const [isStyleMapVisible, setIsStyleMapVisible] = useState(false);
  const [renderKey, setRenderKey] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false); // Trạng thái yêu thích
  const [isRadioVisible, setRadioVisible] = useState(false);
  const [isSaveLocationVisible, setSaveLocationVisible] = useState(false);
  const [isMyLocation, setIsMyLocation] = useState(true);
  const [visibleAlert, setVisibleAlert] = useState(false);
  const [isSearchDirection, setIsSearchDirection] = useState(true);
  const [title, setTitle] = useState("")
  const [previousFavorite, setPreviousFavorite] = useState(false);
  const isFocused = useIsFocused();
  const useFetchGetPlaceDetail = useGetPlaceDetail();

  const [dimensions, setDimensions] = useState(Dimensions.get("window"));


  const { isDarkTheme } = useTheme();
  const { isPortrait } = useOrientation();
  const styles = isPortrait ? createStyles(isDarkTheme, dimensions.width, dimensions.height) : createHorizontalStyles(isDarkTheme, dimensions.width, dimensions.height);


  useEffect(() => {
    const onChange = ({ window }) => {
      setDimensions(window)
      console.log('width ---------------------------------------- ', window.width);
    };
    setIsSearchDirection(true)
    const subscription = Dimensions.addEventListener("change", onChange);

    return () => {
      subscription?.remove();
      setIsSearchDirection(false);
    };
  }, []);



  useFocusEffect(
    React.useCallback(() => {
      setIsListVisible(route.params?.isListVisible || false);
      // console.log('Màn hình đã được reload', props.place);
      setRenderKey(prevKey => prevKey + 1);
      props.updateNavigationFrom(null);
      props.updateNavigationTo(null);
      props.updateShowScreen("overview");
      const updateFavoriteStatus = async () => {
        await checkFavoriteStatus();
      };
      updateFavoriteStatus();
      return () => {
        console.log('Cleanup khi rời khỏi màn hình');
      };
    }, [props.place, route.params])
  );







  const checkFavoriteStatus = useCallback(async () => {
    setIsFavorite(false);
    setTitle('');
    await isHome();
    await isOffice();
    await isFavoriteList();
  }, [route.params.item]);



  const moveToMarker = () => {
    if (props.myLocation != null) {
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


  useEffect(() => {
    isHome()
    isOffice()
    isFavoriteList()
    props.updateShowScreen("searchDirections");
  }, [])


  useEffect(() => {

    if (route.params.item) {
      // console.log('________________item________', route.params.item)
      const { structured_formatting, description, distance, formatted_address, name } = route.params.item;
      setInputText(structured_formatting ? structured_formatting.main_text : name);
      setMainText(structured_formatting ? structured_formatting.main_text : name);
      setDescription(description ? description : formatted_address);
      setDistance(distance);
      // setRelatedLocationsList(relatedLocations)
    }
  }, [route.params.item]);



  const handleSearchScreen = () => {
    props.navigation.navigate('SearchScreen');
    props.updateShowScreen("SearchScreen");
  };

  const handleRoute = async () => {
    let placeDetail = route.params.item;
    if (route.params.item.location || route.params.item.geometry) {

    } else {
      const place = await getPlaceDetail(placeDetail)
      placeDetail.location = place.results[0].geometry.location
    }
    props.updateNavigationTo(route.params.item);
    props.updateShowScreen("Route");
    props.navigation.navigate('Route', {
      type: 'route'
    });
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
        `${i18n.t("alert.attributes.warning")} (getPlaceDetail-SearchDirections):${error.message}`,
        [
          { text: i18n.t("alert.attributes.oke") },
        ]
      );
    }
    return placeDetail;
  }


  const handleListPress = async () => {
    props.updateShowScreen("LocationList");
    navigation.navigate('LocationList', {
      searchText: route.params?.searchText,
    });
  };


  const isHome = async () => {
    try {
      const HomeList = await AsyncStorage.getItem('Home');
      if (HomeList) {
        const HomeListJson = JSON.parse(HomeList);
        const { place_id } = HomeListJson.item;
        const placeIdAddress = route.params?.item.place_id;
        if (place_id === placeIdAddress) {
          setIsFavorite(true);
          setTitle('Home');
        }
      }
    } catch (error) {
      Alert.alert(
        i18n.t("alert.attributes.warning"),
        `${i18n.t("alert.attributes.warning")} (isHome):${error.message}`,
        [
          { text: i18n.t("alert.attributes.oke") },
        ]
      );
    }
  };

  const isOffice = async () => {
    try {
      const OfficeList = await AsyncStorage.getItem('Office');
      if (OfficeList) {
        const OfficeListJson = JSON.parse(OfficeList);
        const { place_id } = OfficeListJson.item;
        const placeIdAddress = route.params?.item.place_id;
        if (place_id === placeIdAddress) {
          setIsFavorite(true);
          setTitle('Office');
        }
      }
    } catch (error) {
      Alert.alert(
        i18n.t("alert.attributes.warning"),
        `${i18n.t("alert.attributes.warning")} (isOffice):${error.message}`,
        [
          { text: i18n.t("alert.attributes.oke") },
        ]
      );
    }
  };


  const isFavoriteList = async () => {
    try {
      const FavoriteList = await AsyncStorage.getItem('Favorite');
      if (FavoriteList) {
        const FavoriteListJson = JSON.parse(FavoriteList);
        const placeIdList = FavoriteListJson?.map((e) => e?.item.place_id);
        const placeIdAddress = route.params?.item.place_id;
        if (placeIdList.includes(placeIdAddress)) {
          setIsFavorite(true);
          setTitle('Favorite');
        }
      }
    } catch (error) {
      Alert.alert(
        i18n.t("alert.attributes.warning"),
        `${i18n.t("alert.attributes.warning")} (isFavoriteList):${error.message}`,
        [
          { text: i18n.t("alert.attributes.oke") },
        ]
      );
    }

  };




  const handleToggleFavorite = async (data) => {
    // if (!isFavorite) {
    try {
      setSaveLocationVisible(true)
      const address = route.params.item
      const selectedAddress = {
        item: address,
        locationTitle: `${data}`
      }
      if (data !== 'Favorite') {
        const addressString = JSON.stringify(selectedAddress)
        await AsyncStorage.setItem(`${data}`, addressString)
      } else if (data === 'Favorite') {
        console.log('**************************data****************', data)
        const FavoriteList = await AsyncStorage.getItem('Favorite')
        const FavoriteListJson = JSON.parse(FavoriteList) || []
        const { place_id } = address
        const placeIdList = FavoriteListJson?.map((e) => { return e.item.place_id })
        if (placeIdList.includes(place_id)) {
          return
        } else {
          if (FavoriteListJson.length === 3) {
            FavoriteListJson.unshift(selectedAddress)
            const addressString = JSON.stringify(FavoriteListJson.slice(0, 3))
            await AsyncStorage.setItem(`${data}`, addressString)
          } else {
            FavoriteListJson.unshift(selectedAddress)
            const addressString = JSON.stringify(FavoriteListJson)
            await AsyncStorage.setItem(`${data}`, addressString)

          }
        }
      }
    } catch (error) {
      Alert.alert(
        i18n.t("alert.attributes.warning"),
        `${i18n.t("alert.attributes.warning")} (handleToggleFavorite):${error.message}`,
        [
          { text: i18n.t("alert.attributes.oke") },
        ]
      );
    }
    // await isFavoriteList();
    // await isHome();
    // await isOffice()
  };



  const handleComplete = async (data) => {
    try {
      if (!data) {
        setSaveLocationVisible(false);
        return;
      } else {
        setTitle(data);
        await handleToggleFavorite(data);
        setSaveLocationVisible(false);
        setIsFavorite(true);
      }
    } catch (error) {
      Alert.alert(
        i18n.t("alert.attributes.warning"),
        `${i18n.t("alert.attributes.warning")} (handleComplete):${error.message}`,
        [
          { text: i18n.t("alert.attributes.oke") },
        ]
      );
    }
  };


  const handleCloseSearch = () => {
    props.updateShowScreen("Overview");
    navigation.navigate("Overview");
    props.updatePlace(null);
  };


  // const handleBackSearch = () => {
  //   if (prevScreen) {
  //     navigation.navigate(prevScreen.name, prevScreen.params);
  //   } else {
  //     navigation.navigate("SearchScreen");
  //   }
  //   props.updatePlace(null);
  //   navigation.goBack();
  // };

  const handleBackSearch = () => {
    props.updateShowScreen("Overview");
    props.updatePlace(null);
    navigation.goBack();
  };

  const share = async () => {
    const options = {
      url: `https://maps.goong.io/?pid=${route.params.item.place_id}`, // Có thể là một đường dẫn URL, hoặc URI của hình ảnh
    };
    try {
      await Share.open(options);
    } catch (error) {
      // showAlert();
      console.log('Lỗi khi chia sẻ:', error);
    }
  }

  const handleStyleMap = () => {
    setIsStyleMapVisible(true)
  };

  const closeStyleMap = () => {
    setIsStyleMapVisible(false)
  };

  const handleRender = () => {
    setRenderKey(prevKey => prevKey + 1);
  };

  const handleShowRadio = () => {
    setRadioVisible(true);
  };
  const handleCloseRadio = useCallback(() => {
    setRadioVisible(false);
  }, []);

  const handleVoiceSearch = () => {
    // console.log('voice search -------s')
    props.updateShowScreen("SearchScreen");
    navigation.navigate('SearchScreen', { voiceSearch: true, timestamp: Date.now() });
  }

  const start = () => {
    // if (props.myLocation) {
    props.updateShowScreen("Route");
    props.updateNavigationTo(route.params.item);
    props.navigation.navigate('Route', {
      type: 'route',
      start: "start",
    });
    // }
  }

  const renderRadio = () => {
    return (
      <Radio
        handleCloseRadio={handleCloseRadio}
      />
    );
  };

  const renderStyleMap = () => {
    return (
      <StyleMap isVisible={isStyleMapVisible} onClose={closeStyleMap} renderAction={handleRender} />
    )
  }

  const renderAlert = () => {
    return (
      <AlertError title={i18n.t("alert.attributes.warning")}
        body={i18n.t("alert.attributes.setMyLocation")}
        handleClose={closeAlert}
      />
    )
  }

  const renderLocationInput = (insets) => (
    <View style={[styles.locationInput]}>
      <TouchableOpacity onPress={handleBackSearch}>
        <Image source={Images.arrowLeftSearch} style={styles.arrowLeftIcon} />
      </TouchableOpacity>
      <TextInput
        style={[styles.searchTextInput]}
        placeholder={i18n.t("overview.attributes.searchInputMenu")}
        placeholderTextColor={Colors.textBrightGrey}
        value={inputText}
        // value={text} // Gán giá trị của text vào TextInput
        // onChangeText={handleChangeSearch}
        editable={false} // Không cho phép chỉnh sửa
      />

      <TouchableOpacity style={styles.footerIconFrame}
        onPress={handleVoiceSearch}
      >
        <View>
          <Image style={styles.imageIcon} source={Images.frame} />
        </View>
      </TouchableOpacity>

      <TouchableOpacity style={styles.footerIconFrame} onPress={handleCloseSearch}>
        <View>
          <Image style={styles.imageIcon} source={Images.closeDirection} />
        </View>
      </TouchableOpacity>
    </View>
  )

  const renderMenuTop = () => (
    <View style={styles.topRightIconContainer}>
      <TouchableOpacity style={styles.iconCircleBackground} onPress={handleStyleMap}>
        <Image style={styles.boxIcon} source={Images.box} />
      </TouchableOpacity>
      <View style={styles.spacerHeight}></View>
      {/* <TouchableOpacity style={styles.iconCircleBackground} onPress={handleStyleMap}>
      <Image style={styles.trafficLightIcon} source={Images.trafficLight} />
      </TouchableOpacity> */}
      <TouchableOpacity onPress={handleShowRadio} style={[styles.iconCircleBackground]}>
        <Image
          style={[styles.viewIconRight, isPlaying ? styles.viewIconRadio : {}]}
          source={isPlaying ? Images[nameChannel] : Images.music}
          resizeMode="contain"
        />
      </TouchableOpacity>
    </View>
  )

  const renderMenuBottom = () => (
    <View style={[styles.menuBottom]}>
      <TouchableOpacity
        style={[
          // styles.searchLocationContainer,
          styles.iconCircleBackground,
          {
            // bottom: isListVisible ? Metrics.large * 5 : Metrics.large * 4,
            // marginBottom: isListVisible ? Metrics.icon : Metrics.small,
          }
        ]}
        onPress={moveToMarker}>
        <Image style={styles.icon} source={Images.currentLocation} />
      </TouchableOpacity>

      {isListVisible && (
        <TouchableOpacity
          onPress={handleListPress}
          style={styles.iconListBackground}
        >
          <Image style={styles.iconList} source={Images.list} />
          <Text style={styles.iconListText}>{i18n.t("overview.search.seeList")}</Text>
        </TouchableOpacity>
      )}

    </View>
  )

  const renderLocationInfo = (insets) => (
    <View style={styles.footer}>
      <TouchableOpacity
        onPress={() => navigation.navigate("LocationInfo", {
          mainText: mainText,
          description: description,
          item: route.params.item,
          relatedLocations: relatedLocations,
          distance: routeDistance,
          searchText: searchText,
        })}
      >
        <View style={styles.horizontalBar}></View>
        <View style={styles.containerText}>
          <Text style={styles.textLocation} numberOfLines={1} ellipsizeMode="tail">
            {mainText}
          </Text>
          <Text style={styles.locationAddress} numberOfLines={2} ellipsizeMode="tail">
            {description}
          </Text>

          <View style={styles.distanceContainer}>
            <Text style={styles.distanceText}>
              {props.myLocation != null ? `${routeDistance} km` : '-- km'}
            </Text>
          </View>
        </View>
      </TouchableOpacity>

      <View style={[
        styles.containerContentBottom,
        { paddingBottom: (Platform.OS === 'ios' ? insets.bottom : Metrics.regular) }
      ]}>
        <TouchableOpacity style={styles.card}
          onPress={handleSearchScreen}>

          <Image style={[styles.iconBottom, styles.iconColor]} source={Images.search} />
          <Text style={styles.textMenu}>{i18n.t("overview.search.searchList")}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.card}
          onPress={handleToggleFavorite}>
          <Image
            // style={[styles.iconBottom, { tintColor: isFavorite ? undefined : (isDarkTheme ? Colors.white : null) }]}
            style={[styles.iconBottom, isFavorite ? {} : styles.iconColor]}
            source={isFavorite ? Images.starGold : Images.star}
          />
          <Text style={styles.textMenu}>{i18n.t("overview.search.favourite")}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.card} onPress={share}>
          <Image style={[styles.iconBottom, styles.iconColor]} source={Images.share} />
          <Text style={styles.textMenu}>{i18n.t("overview.search.share")}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.cardWithBorder, styles.border]} onPress={start}>
          <Text style={styles.text}>{i18n.t("overview.search.start")}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleRoute}

          style={[styles.cardWithBorder, styles.colorWay]}>
          <Image style={styles.iconWay} source={Images.way} />
          <Text style={[styles.text, styles.textWay]}>{i18n.t("overview.search.directions")}</Text>
        </TouchableOpacity>
      </View>
    </View>
  )

  const renderSaveLocationModal = () => (
    <TouchableWithoutFeedback onPress={() => setSaveLocationVisible(false)}>
      <View style={styles.overlay}>

        <SaveLocation
          onComplete={handleComplete}
          setSaveLocationVisible={setSaveLocationVisible}
          data={route.params?.item}
          title={title}
        />
      </View>
    </TouchableWithoutFeedback>
  )

  const renderUIPortrait = (insets) => (
    <>
      <View style={[
        styles.containerSearchDirections,
        { top: insets.top + Metrics.small }
      ]}>
        {/* Thanh Input */}
        {renderLocationInput()}
        {/* Icons container at the top-right */}
        {renderMenuTop()}
      </View>
      <View style={[styles.contentBottom]}>
        {renderMenuBottom()}
        {renderLocationInfo(insets)}
      </View>
    </>
  )

  const renderUIHorizontal = (insets) => (
    <View
      style={[
        styles.content,
        { paddingTop: (Platform.OS === 'ios' ? Metrics.small : insets.top + Metrics.tiny) }
      ]}
      pointerEvents='box-none'
    >
      <View
        style={[
          styles.contentLeft,
          {
            width: (dimensions.width <= 840) ? dimensions.width * 0.55 : dimensions.width * 0.45,
            paddingLeft: Platform.OS === 'ios' ? insets.left : 0,
          }
        ]}
        pointerEvents='box-none'
      >
        {renderLocationInput()}
        {renderLocationInfo(insets)}
      </View>
      <View style={[styles.contentRight,
      {
        paddingRight: Platform.OS === 'ios' ? insets.right : Metrics.small,
        paddingBottom: (Platform.OS === 'ios' ? insets.bottom : Metrics.regular)
      }
      ]}>
        {renderMenuTop()}
        {renderMenuBottom()}
      </View>
    </View>
  )

  return (
    <SafeAreaInsetsContext.Consumer>
      {(insets) => (
        <TouchableWithoutFeedback onPress={() => {
          Keyboard.dismiss();
          setShowAutoComplete(false);
          if (isSaveLocationVisible) {
            setSaveLocationVisible(false); // Ẩn thẻ SaveLocation khi nhấn vào vùng ngoài
          }
        }}>
          <View style={styles.container}>
            <Map renderPlace={renderKey} isMyLocation={isMyLocation}
              isInteractive={false}
              isSearchDirection={isSearchDirection}
            />
            {isSaveLocationVisible ? (
              renderSaveLocationModal()
            ) : (
              isPortrait ? renderUIPortrait(insets) : renderUIHorizontal(insets)
            )}
            {isRadioVisible && renderRadio()}
            {visibleAlert && renderAlert()}
            {isStyleMapVisible && renderStyleMap()}
          </View>
        </TouchableWithoutFeedback>
      )}
    </SafeAreaInsetsContext.Consumer >
  );
};

function mapStateToProps(state) {
  return {
    showScreen: state.app.showScreen,
    typeRouteInput: state.app.typeRouteInput,
    navigationFrom: state.app.navigationFrom,
    navigationTo: state.app.navigationTo,
    vehicle: state.app.vehicle,
    myLocation: state.app.myLocation,
    place: state.app.place,
  };
}
const mapDispatchToProps = (dispatch) => ({
  updateShowScreen: (show) => dispatch(appAction.showScreen(show)),
  updateTypeRouteInput: (type) => dispatch(appAction.typeRouteInput(type)),
  updateNavigationFrom: (from) => dispatch(appAction.navigationFrom(from)),
  updateNavigationTo: (to) => dispatch(appAction.navigationTo(to)),
  updateVehicle: (vehicle) => dispatch(appAction.vehicle(vehicle)),
  updateNavigationFrom: (from) => dispatch(appAction.navigationFrom(from)),
  updateMyLocation: (myLocation) => dispatch(appAction.myLocation(myLocation)),
  updatePlace: (place) => dispatch(appAction.place(place)),
  updateIsRouting: (isRouting) => dispatch(appAction.isRouting(isRouting)),
  updateMapView: (mapView) => dispatch(appAction.mapView(mapView)),
});

export default connect(mapStateToProps, mapDispatchToProps)(SearchDirections);




