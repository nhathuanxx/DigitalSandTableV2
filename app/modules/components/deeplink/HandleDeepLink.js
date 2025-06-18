import { useGetPlaceDetail } from "@app/hooks/place_detail.hook";
import { navigate } from "@app/libs/RootNavigation";
import { ActivityIndicator, Alert, DeviceEventEmitter, Linking, NativeEventEmitter, NativeModules, View } from 'react-native';
import i18n from "@app/i18n/i18n";
import { haversineDistance } from '@app/libs/utils.js';
import * as appAction from "@app/storage/action/app";
import { connect } from "react-redux";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { useGetPlaceDetailFromLatLong } from "@app/hooks/place_detail.hook";
import WebView from "react-native-webview";
import styles from "./styles";
import { Colors } from "../../../theme";

const HandleDeepLink = ({ myLocation, updatePlace, updateNavigationTo, updateNavigationFrom, updateShowScreen, updateIsDeepLink }) => {
  const useFetchGetPlaceDetail = useGetPlaceDetail();
  const useFetchGetPlaceDetailFromLatLong = useGetPlaceDetailFromLatLong();
  const navigation = useNavigation();
  const [isFirstInitial, setIsFirstInitial] = useState(true);
  const [urlShared, setUrlShared] = useState(undefined);
  const [isDeepLink, setIsDeepLink] = useState(false);

  useEffect(() => {
    const subscription = DeviceEventEmitter.addListener(
      'onReceiveSharedText',
      async (data) => {
        setIsDeepLink(true);
        handleSharedLink(data.sharedText);
        // console.log('Received shared text: ------------------- ', data.sharedText);
      }
    );

    return () => {
      subscription.remove();
    };
  }, []);

  useEffect(() => {
    const handleDeepLink = async () => {
      const url = await Linking.getInitialURL();
      console.log('applinks: ', url);
      if (url) {
        setIsDeepLink(true);
        const matchPlace = url.match(/[?&]pid=([^&]+)/);
        const matchDirection = url.match(/[?&]direction=([^&]+)/);
        if (matchPlace) {
          const pid = decodeURIComponent(matchPlace[1]);
          handleRedirectSearch(pid);
        } else if (matchDirection) {
          handleRedirectDirection(url);
        }
      }
    };
    if (isFirstInitial && myLocation) {
      updateIsDeepLink(true);
      handleDeepLink();
      setIsFirstInitial(false);
    }

    Linking.addEventListener('url', handleDeepLink);

  }, [myLocation]);

  // useEffect(() => {
  //   if (urlShared && longUrl) {
  //     const handleRedirect = async (lat, lng) => {
  //       const place = await getPlaceDetailFromLatLong(lat, lng);
  //       // console.log('place: ------- ', JSON.stringify(place));
  //       const pid = place.place_id;
  //       handleRedirectSearch(pid);
  //     }

  //     const regex = /@([-+]?[0-9]*\.?[0-9]+),([-+]?[0-9]*\.?[0-9]+)/;
  //     const match = longUrl.match(regex);
  //     if (match) {
  //       const latLng = {
  //         lat: parseFloat(match[1]),
  //         lng: parseFloat(match[2]),
  //       };
  //       // console.log('latLng: ------------- ', latLng);
  //       // clearTimeout(finalResultTimerRef.current);
  //       setLongUrl(undefined);
  //       handleRedirect(latLng.lat, latLng.lng);
  //     } else {
  //       console.log("Không tìm thấy tọa độ trong URL");
  //     }
  //     return ;
  //   }



  // }, [longUrl, urlShared]);

  const handleRedirectSearch = async (pid) => {
    // console.log("pid: ", pid);
    try {
      if (pid) {
        const params = {
          placeId: pid,
        };
        console.log('params: ------- ', params);

        const response = await useFetchGetPlaceDetail.mutateAsync(params);
        console.log("place: ", JSON.stringify(response.results[0]));
        const result = response.results[0];
        const placeLocation = [result.geometry.location.lng, result.geometry.location.lat];
        const distance = haversineDistance(myLocation, placeLocation).toFixed(2);
        const { commune, district, province } = result.compound;
        const item = {
          structured_formatting: {
            main_text: result.formatted_address
          },
          description: `${commune}, ${district}, ${province}`,
          place_id: result.place_id,
          distance: distance,
          location: result.geometry.location
        }
        // console.log('ITEM: ', item);
        setIsDeepLink(false);
        navigation.navigate('SearchDirections', {
          mainText: result.formatted_address,
          description: result.formatted_address,
          distance: distance || 0,
          item: item,
          relatedLocations: [item],
        });
        updatePlace(result);
        updateIsDeepLink(false);
      }
    } catch (error) {
      setIsDeepLink(false);
      updateIsDeepLink(false);
      Alert.alert(
        i18n.t("alert.attributes.warning"),
        error.message || i18n.t("alert.attributes.warning"),
        [
          { text: i18n.t("alert.attributes.oke") },
        ]
      );
    }

  };

  const parseDirectionUrl = (url) => {
    const regex = /direction=([^%]+)%2C([^&]+)%26([^%]+)%2C([^&]+)/;
    const match = url.match(regex);

    if (match) {
      const [_, latFrom, lngFrom, latTo, lngTo] = match;
      return {
        from: {
          lat: parseFloat(latFrom),
          lng: parseFloat(lngFrom),
        },
        to: {
          lat: parseFloat(latTo),
          lng: parseFloat(lngTo),
        },
      };
    }

    return null;
  }

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

  const handleRedirectDirection = async (url) => {
    const result = parseDirectionUrl(url);
    const placeFrom = await getPlaceDetailFromLatLong(result.from.lat, result.from.lng);
    const placeTo = await getPlaceDetailFromLatLong(result.to.lat, result.to.lng);

    updateNavigationFrom(placeFrom);
    updateNavigationTo(placeTo);
    console.log("handleRedirectDirection: -------------------");
    updateShowScreen("Route");
    setIsDeepLink(false);
    navigation.navigate('Route', {
      type: 'deepLinkDirection',
      naviFrom: placeFrom,
      naviTo: placeTo
    });
    console.log('url direction: ', result);
    updateIsDeepLink(false);
  }

  const handleSharedLink = async (shortLink) => {
    try {
      const response = await fetch(shortLink, {
        method: 'HEAD',
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        },
        redirect: 'follow'
      });

      const finalUrl = response.url;
      const regex = /(https:\/\/www\.google\.com\/maps\/place\/[^\s]+)/;
      const match = finalUrl.match(regex);
      if (match) {
        setUrlShared(finalUrl);
      }

    } catch (error) {
      console.error('Lỗi trích xuất link:', error);
      return null;
    }
  };

  const handleOnchangeUrl = async (url) => {
    const regex = /@([-+]?[0-9]*\.?[0-9]+),([-+]?[0-9]*\.?[0-9]+)/;
    const match = url.match(regex);
    if (match) {
      // console.log('match: ----------------- ', match);
      const latLng = {
        lat: parseFloat(match[1]),
        lng: parseFloat(match[2]),
      };
      // console.log('latLng: ------------- ', latLng);
      const place = await getPlaceDetailFromLatLong(latLng.lat, latLng.lng);
      handleRedirectSearch(place.place_id);
    } else {
      console.log("Không tìm thấy tọa độ trong URL");
    }

  }

  return (
    isDeepLink ? (
      <>
        <View style={styles.loading}>
          <ActivityIndicator size={"large"} color={Colors.blueText} />
        </View>
        {urlShared &&
          <View style={styles.hidden}>
            <WebView
              source={{ uri: `${urlShared}` }}
              onNavigationStateChange={(navState) => {
                if (navState.url.includes('+Vi%E1%BB%87t+Nam')) {
                  setUrlShared(undefined);
                  handleOnchangeUrl(navState.url);
                }
              }}
              style={styles.hidden}
            />
          </View>
        }
      </>
    ) : null
  );
};

const mapStateToProps = (state) => ({
  myLocation: state.app.myLocation,
});
const mapDispatchToProps = (dispatch) => ({
  updateShowScreen: (show) => dispatch(appAction.showScreen(show)),
  updatePlace: (place) => dispatch(appAction.place(place)),
  updateNavigationFrom: (from) => dispatch(appAction.navigationFrom(from)),
  updateNavigationTo: (to) => dispatch(appAction.navigationTo(to)),
  updateIsDeepLink: (isDeeplink) => dispatch(appAction.isDeeplink(isDeeplink)),
});

export default connect(mapStateToProps, mapDispatchToProps)(React.memo(HandleDeepLink));

