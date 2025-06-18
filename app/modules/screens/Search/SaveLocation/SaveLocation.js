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
} from "react-native";
import { connect } from "react-redux";

import * as appAction from "@app/storage/action/app";
import { Colors as Themes, Helpers, Images, Metrics, Fonts } from "@app/theme";
import i18n from "@app/i18n/i18n";
import { useGetAutoComplete } from "@app/hooks/place_detail.hook";
import LocationInfo from "../LocationInfo/LocationInfo";
import { screensEnabled } from "react-native-screens";
import Map from "@app/modules/screens/Map/Map"
import { useRoute, useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-community/async-storage';
import { TouchableWithoutFeedback, Keyboard } from 'react-native';
import Share from 'react-native-share';
import StyleMap from "@app/modules/screens/Home/StyleMap/StyleMap";
import Radio from "@app/modules/screens/Radio/Radio";
import storage from "@app/libs/storage";
import { RadioContext } from "@app/modules/screens/Radio/RadioProvider";
import { useTheme } from "@app/modules/components/context/ThemeContext";
import createStyles from "./styles";
import { SafeAreaInsetsContext, SafeAreaView } from "react-native-safe-area-context";
import { useOrientation } from "@app/modules/components/context/OrientationContext";
import createHorizontalStyles from "./horizontalStyles";


const SaveLocation = ({ onComplete, data, title }) => {

  const [selectedOption, setSelectedOption] = useState(null);
  const [dimensions, setDimensions] = useState(Dimensions.get("window"));


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


  const sendDataToParent = async () => {
    try {
      if ((!title || typeof title !== "string" || title.trim() === "") && title === 'Favorite') {
        const FavoriteList = await AsyncStorage.getItem('Favorite');
        if (FavoriteList) {
          const FavoriteListJson = JSON.parse(FavoriteList);
          const placeIdList = FavoriteListJson?.map((e) => e?.item.place_id);
          const placeIdAddress = data.place_id;
          const index = placeIdList.indexOf(data.place_id)
          FavoriteListJson.splice(index, 1)
          const addressString = JSON.stringify(FavoriteListJson)
          await AsyncStorage.setItem(`${title}`, addressString)
        }
      } else {
        await AsyncStorage.removeItem(`${title}`)
      }
      onComplete(selectedOption);
    } catch (error) {
      Alert.alert(
        i18n.t("alert.attributes.warning"),
        `${i18n.t("alert.attributes.warning")} (sendDataToParent):${error.message}`,
        [
          { text: i18n.t("alert.attributes.oke") },
        ]
      );
    }
  };

  const isHome = async () => {
    try {
      const HomeList = await AsyncStorage.getItem('Home');
      if (HomeList) {
        const HomeListJson = JSON.parse(HomeList);
        const { place_id } = HomeListJson.item;
        const placeIdAddress = data.place_id;
        if (place_id === placeIdAddress) {
          // setIsFavorite(true);
          // setTitle('Home');
          setSelectedOption('Home')

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
        const placeIdAddress = data.place_id;
        if (place_id === placeIdAddress) {
          // setIsFavorite(true);
          // setTitle('Office');
          setSelectedOption('Office')
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
        const placeIdAddress = data.place_id;
        if (placeIdList.includes(placeIdAddress)) {
          setSelectedOption('Favorite')
          // setIsFavorite(true);
          // setTitle('Favorite');
        }
        //  else {
        //   setIsFavorite(false);
        // }
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


  useEffect(() => {
    isHome()
    isOffice()
    isFavoriteList()
  }, [data])




  return (
    <SafeAreaInsetsContext.Consumer>
      {(insets) => (
        <View style={styles.content} onTouchStart={(e) => e.stopPropagation()}>
          <View style={styles.horizontalBar}></View>
          <View style={[
            styles.contentContainer,
            { paddingHorizontal: (Platform.OS === "ios" && !isPortrait) ? insets.left : Metrics.regular }
          ]}>
            <Text style={styles.title}>{i18n.t("overview.saveLocation.saveLocationAs")}</Text>

            <View style={styles.optionList}>

              <View style={styles.contentCheck}>
                <TouchableOpacity
                  style={styles.optionContainer}
                  onPress={() => setSelectedOption('Favorite')}
                >
                  <View style={styles.optionLeft}>
                    <View style={styles.icons}>
                      <Image style={styles.iconWay} source={Images.starFavorite} /></View>
                    <Text style={styles.optionText}>{i18n.t("overview.searchFavorite.favourite")}</Text>
                  </View>
                  <Image
                    style={styles.checkbox}
                    source={selectedOption === 'Favorite' ? Images.vector : Images.ellipse}
                  />
                </TouchableOpacity>
              </View>
              <View style={styles.spacer} />

              <View style={styles.contentCheck}>
                <TouchableOpacity
                  style={styles.optionContainer}
                  onPress={() => setSelectedOption('Home')}
                >
                  <View style={styles.optionLeft}>
                    <View style={styles.icons}>
                      <Image style={styles.iconWay} source={Images.homeFavorite} /></View>
                    <Text style={styles.optionText}>{i18n.t("overview.searchFavorite.homeAddress")}</Text>
                  </View>
                  <Image
                    style={styles.checkbox}
                    source={selectedOption === 'Home' ? Images.vector : Images.ellipse}
                  />
                </TouchableOpacity>
              </View>
              <View style={styles.spacer} />

              <View style={styles.contentCheck}>
                <TouchableOpacity
                  style={styles.optionContainer}
                  onPress={() => setSelectedOption('Office')}
                >
                  <View style={styles.optionLeft}>
                    <View style={styles.icons}>
                      <Image style={styles.iconWay} source={Images.businessFavorite} /></View>
                    <Text style={styles.optionText}>{i18n.t("overview.searchFavorite.office")}</Text>
                  </View>
                  <Image
                    style={styles.checkbox}
                    source={selectedOption === 'Office' ? Images.vector : Images.ellipse}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>


          <View style={[
            styles.buttonBottom,
            { paddingHorizontal: (Platform.OS === "ios" && !isPortrait) ? insets.left : Metrics.regular }
          ]}>
            <TouchableOpacity style={styles.completeButton} onPress={sendDataToParent}>
              <Text style={styles.completeButtonText}>{i18n.t("overview.saveLocation.complete")}</Text>
            </TouchableOpacity>

          </View>
        </View>
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
  };
}

const mapDispatchToProps = (dispatch) => ({
  updateShowScreen: (show) => dispatch(appAction.showScreen(show)),
  updateTypeRouteInput: (type) => dispatch(appAction.typeRouteInput(type)),
  updateNavigationFrom: (from) => dispatch(appAction.navigationFrom(from)),
  updateNavigationTo: (to) => dispatch(appAction.navigationTo(to)),
  updateVehicle: (vehicle) => dispatch(appAction.vehicle(vehicle)),
  updateMyLocation: (myLocation) => dispatch(appAction.myLocation(myLocation)),
  updatePlace: (place) => dispatch(appAction.place(place)),
  updateMapView: (mapView) => dispatch(appAction.mapView(mapView)),
});

export default connect(mapStateToProps, mapDispatchToProps)(SaveLocation);
