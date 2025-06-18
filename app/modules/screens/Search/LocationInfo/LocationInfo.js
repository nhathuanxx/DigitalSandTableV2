import React, { Fragment, useState, useRef, useEffect, useCallback, useContext } from "react";

import {
  TouchableOpacity,
  Dimensions,
  Text,
  View,
  Image,
  Touchable,
  Platform
} from "react-native";
import { connect } from "react-redux";
import { Colors, Helpers, Images, Metrics, Fonts } from "@app/theme";
import * as appAction from "@app/storage/action/app";
import i18n from "@app/i18n/i18n";
import createStyles from './styles';
import AsyncStorage from '@react-native-community/async-storage';
import Share from 'react-native-share';
import { useTheme } from "@app/modules/components/context/ThemeContext";

import { TouchableWithoutFeedback, Keyboard } from 'react-native';
import SaveLocation from "../SaveLocation/SaveLocation";
import { useRoute, useNavigation, useIsFocused, useFocusEffect } from '@react-navigation/native';
import { SafeAreaInsetsContext, SafeAreaView } from "react-native-safe-area-context";
import { useOrientation } from "@app/modules/components/context/OrientationContext";
import createHorizontalStyles from "./horizontalStyles";
import { ScrollView } from "react-native-gesture-handler";
import { useGetPlaceDetail } from "@app/hooks/place_detail.hook";

const screenHeight = Dimensions.get('window').height;
const LocationInfo = (props) => {
  // const Colors = Themes['lightMode'];
  const route = useRoute();
  const navigation = useNavigation();
  const { mainText, description, relatedLocations, distance, item, distance: routeDistance } = route.params || {};
  const [isFavorite, setIsFavorite] = useState(false);
  const [title, setTitle] = useState("")
  const [isSaveLocationVisible, setSaveLocationVisible] = useState(false);
  const [dimensions, setDimensions] = useState(Dimensions.get("window"));
  const useFetchGetPlaceDetail = useGetPlaceDetail();


  const { isDarkTheme } = useTheme();
  const { isPortrait } = useOrientation();
  const styles = isPortrait ? createStyles(isDarkTheme, dimensions.width, dimensions.height) : createHorizontalStyles(isDarkTheme, dimensions.width, dimensions.height);

  useEffect(() => {
    const onChange = ({ window }) => setDimensions(window);
    const subscription = Dimensions.addEventListener("change", onChange);

    return () => {
      subscription?.remove();
    };
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      console.log('Màn hình đã được reload', route.params?.item);
      checkFavoriteStatus();
      return () => {
        console.log('Cleanup khi rời khỏi màn hình');
      };
    }, [checkFavoriteStatus])
  );
  const checkFavoriteStatus = useCallback(async () => {
    setIsFavorite(false);
    setTitle('');
    await isHome();
    await isOffice();
    await isFavoriteList();
  }, [route.params.item]);





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
      console.log('Error fetching Home from AsyncStorage:', error);
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
      console.log('Error fetching Office from AsyncStorage:', error);
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
      console.log('Error fetching Favorite from AsyncStorage:', error);
    }

  };




  const handleToggleFavorite = async (data) => {
    // if (!isFavorite) {
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
          FavoriteListJson[0] = selectedAddress
          const addressString = JSON.stringify(FavoriteListJson)
          await AsyncStorage.setItem(`${data}`, addressString)
        } else {
          FavoriteListJson.push(selectedAddress)
          const addressString = JSON.stringify(FavoriteListJson)
          await AsyncStorage.setItem(`${data}`, addressString)

        }
      }
    }
    // await isFavoriteList();
    // await isHome();
    // await isOffice()
  };



  const handleComplete = async (data) => {
    if (!data) {
      setSaveLocationVisible(false);
      return;
    } else {
      setTitle(data);
      await handleToggleFavorite(data);
      setSaveLocationVisible(false);
      setIsFavorite(true);
    }
  };




  const handleBackSearch = () => {
    const { searchText } = route.params;
    navigation.navigate("SearchDirections", {
      item: route.params.item,
      relatedLocations: relatedLocations,
      distance: distance,
      searchText: searchText,
    });
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

  const start = () => {
    if (props.myLocation) {
      props.updateNavigationTo(route.params.item);
      props.navigation.navigate('Route', {
        type: 'route',
        start: "start",
      });
    }
  }

  const handleSearchScreen = () => {
    props.navigation.navigate('SearchScreen')
  };
  const handleRoute = () => {
    props.updatePlace(null);
    props.updateNavigationTo(route.params.item);
    props.navigation.navigate('Route', {
      type: 'route'
    });
  };

  const handleSearchHistoryClick = async (item) => {
    const place = await getPlaceDetail(item)
    item.location = place.results[0].geometry.location

    const { searchText } = route.params;
    navigation.navigate("SearchDirections", {
      distance: item.distance,
      // item: route.params.item,
      item: item,
      searchText: searchText,

    });
    props.updatePlace(item)
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
        `${i18n.t("alert.attributes.warning")} (getPlaceDetail-LocationInfo):${error.message}`,
        [
          { text: i18n.t("alert.attributes.oke") },
        ]
      );
    }
    return placeDetail;
  }


  return (
    <SafeAreaInsetsContext.Consumer>
      {(insets) => (
        <TouchableWithoutFeedback
          onPress={() => {
            Keyboard.dismiss();
            if (isSaveLocationVisible) {
              setSaveLocationVisible(false);
            }
          }}
        >
          <View style={styles.container}>
            <View style={styles.content}>
              <View style={styles.topContent}>
                <Image style={styles.bgLocationInfo} source={Images.backgroundLocation} />
                <View style={[
                  styles.btnBackView,
                  {
                    paddingTop: (Platform.OS === "ios" && !isPortrait) ? 0 : insets.top,
                    paddingHorizontal: (Platform.OS === "ios" && !isPortrait) ? insets.left / 2 : 0
                  }
                ]}>
                  <TouchableOpacity onPress={handleBackSearch} style={styles.btnBack}>
                    <Image style={styles.arrowBack} source={Images.arrowLocation} />
                  </TouchableOpacity>
                </View>
                {isPortrait ? (
                  <View style={styles.contentLocationInfo}>
                    <View style={styles.locationInfo}>
                      <Text numberOfLines={2} ellipsizeMode="tail" style={styles.textLocationInfo}>
                        {mainText}
                      </Text>
                      <Text style={styles.LocationInfoAddress} numberOfLines={1} ellipsizeMode="tail">
                        {description}
                      </Text>
                      <View style={styles.distanceContainer}>
                        <Text style={styles.distanceText}>
                          {props.myLocation != null ? `${routeDistance} km` : '-- km'}
                        </Text>
                      </View>
                    </View>
                    <View style={styles.contentLinkAddress}>
                      <View style={styles.linkAddressLocationInfo}>
                        <Text style={styles.text_link_address}>
                          {i18n.t("overview.search.linkLocation")}
                        </Text>
                      </View>
                      <ScrollView scrollEnabled={true}>
                        <View>
                          {relatedLocations &&
                            relatedLocations
                              .filter(
                                (location) =>
                                  location.structured_formatting?.main_text !== mainText &&
                                  location.description !== description
                              )
                              .slice(0, 4)
                              .map((location, index) => (
                                <TouchableOpacity
                                  key={index}
                                  style={styles.LocationInfoList}
                                  onPress={() => handleSearchHistoryClick(location)}
                                >
                                  <View style={styles.contentListLocationInfo}>
                                    <Text style={styles.infoTextAddress} numberOfLines={1} ellipsizeMode="tail">
                                      {location.structured_formatting?.main_text}
                                    </Text>
                                    <Text style={styles.textDescription} numberOfLines={2} ellipsizeMode="tail">
                                      {location.description}
                                    </Text>
                                  </View>
                                  <View style={styles.iconArrow}>
                                    <TouchableOpacity>
                                      <Image source={Images.direction} style={styles.iconRightLocationInfo} />
                                    </TouchableOpacity>
                                    <Text style={styles.distance}>
                                      {props.myLocation != null ? `${location.distance} km` : '-- km'}
                                    </Text>
                                  </View>
                                </TouchableOpacity>
                              ))}
                        </View>
                      </ScrollView>
                    </View>
                  </View>
                ) : (
                  <ScrollView style={{ paddingHorizontal: (Platform.OS === "ios") ? insets.left : Metrics.normal }}>
                    <View style={[styles.contentLocationInfo]}>
                      <TouchableOpacity style={styles.locationInfo}>
                        <Text numberOfLines={2} ellipsizeMode="tail" style={styles.textLocationInfo}>
                          {mainText}
                        </Text>
                        <Text style={styles.LocationInfoAddress} numberOfLines={1} ellipsizeMode="tail">
                          {description}
                        </Text>
                        <View style={styles.distanceContainer}>
                          <Text style={styles.distanceText}>
                            {props.myLocation != null ? `${routeDistance} km` : '-- km'}
                          </Text>
                        </View>
                      </TouchableOpacity>
                      <View style={styles.contentLinkAddress}>
                        <TouchableOpacity style={styles.linkAddressLocationInfo}>
                          <Text style={styles.text_link_address}>
                            {i18n.t("overview.search.linkLocation")}
                          </Text>
                        </TouchableOpacity>
                        {relatedLocations &&
                          relatedLocations
                            .filter(
                              (location) =>
                                location.structured_formatting?.main_text !== mainText &&
                                location.description !== description
                            )
                            .slice(0, 4)
                            .map((location, index) => (
                              <TouchableOpacity
                                key={index}
                                style={styles.LocationInfoList}
                                onPress={() => handleSearchHistoryClick(location)}
                              >
                                <View style={styles.contentListLocationInfo}>
                                  <Text style={styles.infoTextAddress} numberOfLines={1} ellipsizeMode="tail">
                                    {location.structured_formatting?.main_text}
                                  </Text>
                                  <Text style={styles.textDescription} numberOfLines={2} ellipsizeMode="tail">
                                    {location.description}
                                  </Text>
                                </View>
                                <View style={styles.iconArrow}>
                                  <TouchableOpacity>
                                    <Image source={Images.direction} style={styles.iconRightLocationInfo} />
                                  </TouchableOpacity>
                                  <Text style={styles.distance}>
                                    {props.myLocation != null ? `${location.distance} km` : '-- km'}
                                  </Text>
                                </View>
                              </TouchableOpacity>
                            ))}
                      </View>
                    </View>
                  </ScrollView>
                )}
              </View>

              <View style={[
                styles.bottomContent,
                {
                  paddingBottom: Platform.OS === 'ios' ? insets.bottom : Metrics.normal,
                  paddingHorizontal: isPortrait ? Metrics.normal : (Platform.OS === "ios") ? insets.left : Metrics.normal
                }
              ]}>
                <View style={[styles.flexRow, styles.menuBottom]}>
                  <TouchableOpacity style={styles.card} onPress={handleSearchScreen}>
                    <Image style={[styles.iconBottom, styles.iconColor]} source={Images.search} />
                    <Text style={styles.textMenu}>{i18n.t("overview.search.searchList")}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={handleToggleFavorite} style={styles.card}>
                    <Image
                      style={[styles.iconBottom, isFavorite ? {} : styles.iconColor]}
                      source={isFavorite ? Images.starGold : Images.star}
                    />
                    <Text style={styles.textMenu}>{i18n.t("overview.search.favourite")}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.card} onPress={share}>
                    <Image style={[styles.iconBottom, styles.iconColor]} source={Images.share} />
                    <Text style={styles.textMenu}>{i18n.t("overview.search.share")}</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.flexRow}>
                  <TouchableOpacity style={[styles.cardWithBorder, styles.border]} onPress={start}>
                    <Text style={styles.text}>{i18n.t("overview.search.start")}</Text>
                  </TouchableOpacity>
                  <View style={styles.spacer}></View>
                  <TouchableOpacity style={[styles.cardWithBorder, styles.colorWay]} onPress={handleRoute}>
                    <Image style={styles.iconWay} source={Images.way} />
                    <Text style={[styles.text, styles.textWay]}>{i18n.t("overview.search.directions")}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
            {isSaveLocationVisible && (
              <View style={styles.overlay}>
                <SaveLocation
                  onComplete={handleComplete}
                  setSaveLocationVisible={setSaveLocationVisible}
                  data={route.params?.item}
                  title={title}
                />
              </View>
            )}

          </View>

        </TouchableWithoutFeedback>
      )}
    </SafeAreaInsetsContext.Consumer >
  );
}

function mapStateToProps(state) {
  return {
    showScreen: state.app.showScreen,
    typeRouteInput: state.app.typeRouteInput,
    navigationFrom: state.app.navigationFrom,
    navigationTo: state.app.navigationTo,
    vehicle: state.app.vehicle,
    myLocation: state.app.myLocation,
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
});

export default connect(mapStateToProps, mapDispatchToProps)(LocationInfo);