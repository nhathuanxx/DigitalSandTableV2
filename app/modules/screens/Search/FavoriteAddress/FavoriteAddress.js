import React, { Fragment, useState, useRef, useEffect, useCallback } from "react";
// import { Text, View, SafeAreaView, Image } from "react-native";
import {
  TouchableOpacity,
  Dimensions,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableWithoutFeedback,
  ScrollView,
  Alert,
  Platform,
} from "react-native";
import { connect } from "react-redux";
// import { SearchBar, Icon } from "@rneui/themed";
import { Colors, Helpers, Images, Metrics, Fonts } from "@app/theme";
import * as appAction from "@app/storage/action/app";
import i18n from "@app/i18n/i18n";
import { SwipeListView } from "react-native-swipe-list-view";
import AsyncStorage from '@react-native-community/async-storage';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useFocusEffect } from '@react-navigation/native'; // Import useFocusEffect
import { useGetPlaceDetailFromAddress } from "@app/hooks/place_detail.hook";
import { useGetAutoComplete, useGetPlaceDetail } from "@app/hooks/place_detail.hook";
import { haversineDistance } from '@app/libs/utils.js';
import createStyles from './styles';
import { useTheme } from "@app/modules/components/context/ThemeContext";
import { useOrientation } from "@app/modules/components/context/OrientationContext";
import createHorizontalStyles from "./horizontalStyles";
import { SafeAreaInsetsContext } from "react-native-safe-area-context";



const FavoriteAddress = (props) => {

  const route = useRoute();
  const navigation = useNavigation();
  const [isFavoriteSaved, setIsFavoriteSaved] = useState(false);
  const [isOptionTitleContentVisible, setIsOptionTitleContentVisible] = useState(false);
  const [isDeleteSavedItemVisible, setIsDeleteSavedItemVisible] = useState(false);

  const [namePart, setNamePart] = useState('')
  const [dataToDelete, setDataToDelete] = useState('')

  const [data, setData] = useState([])
  const [content, setContent] = useState('')
  const useFetchGetPlaceDetailFromAddress = useGetPlaceDetailFromAddress();
  const [currentLocation, setCurrentLocation] = useState([105.79829597455202, 21.013715429594125]);
  const [newData, setNewData] = useState('')
  const useFetchGetAutoComplete = useGetAutoComplete();
  const useFetchGetPlaceDetail = useGetPlaceDetail();
  const [savedFavoriteAddresses, setSavedFavoriteAddresses] = useState([]);
  const [savedHomeAddress, setSavedHomeAddress] = useState({});
  const [savedOfficeAddress, setSavedOfficeAddress] = useState({});
  const [deleteAddressType, setDeleteAddressType] = useState(null);
  const [deleteAddressIndex, setDeleteAddressIndex] = useState(null);
  const [dataToEdit, setDataToEdit] = useState({})
  const [isEdit, setIsEdit] = useState(false);

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



  const handleTouchablePress = () => {
    hideAllOverlays();
  };

  const hideAllOverlays = () => {
    setIsOptionTitleContentVisible(false);
    setIsDeleteSavedItemVisible(false);
  };

  const handleCloseOverView = () => {
    // props.navigation.navigate('Overview')
    props.navigation.goBack();
  };


  const handleShowOptionTitleContent = (type, index = null) => {
    setContent(type)
    setDeleteAddressType(type);
    setDeleteAddressIndex(index + 1);
    setIsOptionTitleContentVisible(true);
  };


  const handleOpenLocationSelection = async (type) => {
    setContent(type)
    navigation.navigate("LocationSelection", {
      fromScreen: 'FavoriteAddress',
      locationTitle: type,
    }
    );
  }

  useFocusEffect(
    useCallback(() => {
      // Gọi các hàm async một cách bình thường, nhưng không cần async ở đây
      const loadData = async () => {
        await initHomeList();
        await initOfficeList();
        await initFavoriteList();
      };

      loadData(); // Gọi hàm async trong useFocusEffect

      return () => {
        // Cleanup nếu cần
      };
    }, [])
  );


  useEffect(() => {
    initHomeList()
    initOfficeList()
    initFavoriteList()
  }, [])

  const initHomeList = async () => {
    const HomeList = await AsyncStorage.getItem('Home')
    const HomeListJson = JSON.parse(HomeList)
    setSavedHomeAddress(HomeListJson)
  }


  const initOfficeList = async () => {
    const OfficeList = await AsyncStorage.getItem('Office')
    const OfficeListJson = JSON.parse(OfficeList)
    setSavedOfficeAddress(OfficeListJson)
  }


  const initFavoriteList = async () => {
    const FavoriteList = await AsyncStorage.getItem('Favorite')
    const FavoriteListJson = JSON.parse(FavoriteList)
    setSavedFavoriteAddresses(FavoriteListJson || [])
  }

  useEffect(async () => {
    await AsyncStorage.setItem('Favorite', JSON.stringify(savedFavoriteAddresses))
  }, [savedFavoriteAddresses])


  useEffect(() => {
    const saveAddress = async () => {
      const selectedAddress = route.params?.selectedAddress;
      const locationTitle = route.params?.locationTitle;

      if (selectedAddress && locationTitle) {
        if (locationTitle === "Home") {
          setIsEdit(false)
          initFavoriteList()
          initOfficeList()
          setSavedHomeAddress(selectedAddress);
          await AsyncStorage.setItem('Home', JSON.stringify(selectedAddress));
        } else if (locationTitle === "Office") {
          setIsEdit(false)
          initFavoriteList()
          initHomeList()
          setSavedOfficeAddress(selectedAddress);
          await AsyncStorage.setItem('Office', JSON.stringify(selectedAddress));
        } else if (locationTitle === "Favorite") {
          if (isEdit) {
            setDataToEdit(selectedAddress);
          } else {
            console.log("9999999999999999999999999999999999999999", selectedAddress)
            setSavedFavoriteAddresses(prev => {
              const index = prev?.findIndex(
                address => address?.item?.structured_formatting?.main_text === selectedAddress?.item?.structured_formatting?.main_text
              );
              let updatedList;
              if (index !== -1) {
                updatedList = [
                  selectedAddress,
                  ...prev.slice(0, index),
                  ...prev.slice(index + 1)
                ];
              } else {
                updatedList = [selectedAddress, ...prev];
              }
              const limitList = updatedList.slice(0, 3);
              return limitList;
            });
          }
        }
      }
    };

    saveAddress();
    initHomeList()
    initOfficeList()
  }, [route.params?.selectedAddress, route.params?.locationTitle]);




  const handleEditLocation = () => {
    navigation.navigate("LocationSelection", {
      fromScreen: 'FavoriteAddress',
      locationTitle: content,

    });
    setIsOptionTitleContentVisible(false)
    setIsEdit(true)
  }


  useEffect(() => {
    if (isEdit) {
      const isEmpty = Object.keys(dataToEdit)?.length
      if (isEmpty) {
        handleEdit(dataToEdit)
      }
    }
  }, [isEdit, dataToEdit])


  const handleEdit = async (dataToEdit) => {

    if (deleteAddressType === 'Favorite' && deleteAddressIndex !== null) {
      const updatedFavorites = [...savedFavoriteAddresses];
      const placeIdList = updatedFavorites.map((e) => e.item?.place_id);
      // if (placeIdList.includes(dataToEdit.item?.place_id))
      //   {
      //   Alert.alert(
      //     i18n.t("overview.saveLocation.notification"),
      //     i18n.t("overview.searchFavorite.theLocationIsAlreadyOnTheList")
      //   );
      //   return;
      // }

      if (placeIdList.includes(dataToEdit.item?.place_id)) {
        // Thông báo đã bị bỏ đi ở đây
        return;
      } else {

        updatedFavorites[deleteAddressIndex - 1] = dataToEdit;
        setSavedFavoriteAddresses(updatedFavorites);
        await AsyncStorage.setItem('Favorite', JSON.stringify(updatedFavorites));
      }
    }
    setIsOptionTitleContentVisible(false);
    setIsEdit(false);
    setDeleteAddressIndex(null);
    setDataToEdit({});
  }




  const handleShowDeleteSavedItem = () => {
    setIsDeleteSavedItemVisible(true);
    setIsOptionTitleContentVisible(false); // Hide the other section
  };

  const handleDeleteAllSavedItems = async () => {
    try {
      setSavedFavoriteAddresses([]);
      await AsyncStorage.removeItem('savedFavoriteAddresses');
      setIsDeleteSavedItemVisible(false);
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

  const handleDeleteSavedAddress = async () => {
    try {
      if (deleteAddressType === 'Favorite' && deleteAddressIndex !== null) {
        const updatedFavorites = [...savedFavoriteAddresses];
        updatedFavorites.splice(deleteAddressIndex - 1, 1);
        setSavedFavoriteAddresses(updatedFavorites);
        await AsyncStorage.setItem('Favorite', JSON.stringify(updatedFavorites));
      } else if (deleteAddressType === 'Home') {
        setSavedHomeAddress(null);
        await AsyncStorage.removeItem('Home');
      } else if (deleteAddressType === 'Office') {
        setSavedOfficeAddress(null);
        await AsyncStorage.removeItem('Office');
      }
      setIsOptionTitleContentVisible(false)
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

  // ----------------------------------------------------------------------------------------------------------------------------------

  const getDistance = async (item) => {
    try {
      let distance = 0;
      if (props.myLocation) {
        // const place = await getPlaceDetail(item);
        // const placeLocation = [place.results[0].geometry.location.lng, place.results[0].geometry.location.lat];
        // distance = haversineDistance(props.myLocation, placeLocation)
        if (item.location || item.geometry) {
          let placeLocation = [];
          if (item.location) {
            placeLocation = [item.location.lng, item.location.lat];
          } else {
            placeLocation = [item.geometry.location.lng, item.geometry.location.lat];
          }
          distance = haversineDistance(props.myLocation, placeLocation)
        } else {
          // const place = await getPlaceDetail(item);
          const params = {
            address: item.description,
          };
          const response = await useFetchGetPlaceDetailFromAddress.mutateAsync(params);
          // console.log("_____________item______", response.results[0].geometry.location)
          const placeLocation = [response.results[0].geometry.location.lng, response.results[0].geometry.location.lat];
          distance = haversineDistance(props.myLocation, placeLocation)
        }
      }
      return distance.toFixed(2);
    } catch (error) {
      Alert.alert(
        i18n.t("alert.attributes.warning"),
        `${i18n.t("alert.attributes.warning")} (getDistance-FavoriteAddress):${error.message}`,
        [
          { text: i18n.t("alert.attributes.oke") },
        ]
      );
    }
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
        `${i18n.t("alert.attributes.warning")} (getPlaceDetail-FavoriteAddress):${error.message}`,
        [
          { text: i18n.t("alert.attributes.oke") },
        ]
      );
    }
    return placeDetail;
  }




  const handleToPlace = async (items, index) => {
    console.log('***********************', items)
    try {
      const params = {
        location: `${currentLocation[1]}, ${currentLocation[0]}`,
        searchText: items.structured_formatting ? items.structured_formatting.main_text : items.formatted_address,
      };
      const response = await useFetchGetAutoComplete.mutateAsync(params);
      const predictions = response.predictions || [];
      if (predictions.length > 0) {
        const predictionsWithDistance = await Promise.all(predictions.map(async (location) => {
          const distance = await getDistance(location);
          return { ...location, distance };
        }));
        await AsyncStorage.setItem('relatedLocations', JSON.stringify(predictionsWithDistance));
        const item = predictionsWithDistance[index];

        const selectedDistance = items.distance;

        const distance = await getDistance(items);

        navigation.navigate("SearchDirections", {
          item: items,
          relatedLocations: predictionsWithDistance,
          distance: distance,
        });
        props.updatePlace(items);

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







  // -------------------------------------------------------------------------------------------------------------------------------------
  return (
    <SafeAreaInsetsContext.Consumer>
      {(insets) => (
        <TouchableWithoutFeedback onPress={handleTouchablePress}>
          {/* Platform.OS === "ios" && */}
          <View style={[styles.container]}>
            {/* {(isOptionTitleContentVisible || isDeleteSavedItemVisible) && (
              <View style={styles.overlayBackground} />
            )} */}
            {/* header */}
            <View style={[
              styles.header,
              {
                paddingTop: (Platform.OS === "ios" && !isPortrait) ? 0 : insets.top,
                paddingHorizontal: (Platform.OS === "ios" && !isPortrait) ? insets.left : 0
              }
            ]}>
              <TouchableOpacity onPress={handleCloseOverView} style={styles.headerBtnBack}>
                <Image source={Images.arrowBack} style={styles.icArrowBack} />
              </TouchableOpacity>
              <Text style={styles.textHeader}>{i18n.t("overview.searchFavorite.favouritePlace")}</Text>
            </View>

            {/* content */}
            <View style={[styles.content, { paddingHorizontal: (Platform.OS === "ios" && !isPortrait) ? insets.left : 0 }]}>
              <View style={styles.contentTop}>
                {/* image banner */}
                <View style={[styles.contentBanner, styles.contentTopItem]}>
                  <Image style={styles.imageContent} source={Images.backgroundFavoritePlace} />
                  <View style={styles.contentContainer}>
                    <View style={styles.textContainer}>
                      <Text style={styles.titleText}>{i18n.t("overview.searchFavorite.saveLocations")}</Text>
                      <Text style={styles.descriptionText}>{i18n.t("overview.searchFavorite.saveFrequentLocations")}</Text>
                    </View>
                    <Image style={styles.imageContentFrequently} source={Images.frequently} />
                  </View>
                </View>
                {/* địa chỉ nhà */}
                <View style={styles.spacer}></View>
                <View style={[styles.section, styles.contentTopItem]}>
                  <View style={[styles.sectionContent, styles.fullHeight]}>
                    <View style={styles.leftSection}>
                      <Image style={styles.iconSection} source={Images.homeFavorite} />
                      <Text style={styles.sectionTextTitle}>{i18n.t("overview.searchFavorite.homeAddress")}</Text>
                    </View>

                    {!savedHomeAddress ? (
                      <TouchableOpacity
                        onPress={() => handleOpenLocationSelection("Home")}
                        style={styles.middleSection}
                      >
                        <Text style={styles.sectionText}>{i18n.t("overview.searchFavorite.setHomeAddress")}</Text>
                      </TouchableOpacity>
                    ) : (
                      <View >
                        <TouchableOpacity
                          // onPress={() => handleOpenLocationSelection("Home")}
                          onPress={() => handleToPlace(savedHomeAddress?.item)}
                          style={styles.sectionAddress}
                        >
                          <Text numberOfLines={2} ellipsizeMode="tail" style={styles.sectionTextAddress}>
                            {savedHomeAddress?.item?.description || savedHomeAddress?.item?.formatted_address}
                          </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={styles.iconSelect}
                          onPress={() => handleShowOptionTitleContent("Home")}
                        // onPress={handleShowDeleteSavedItem}
                        >
                          <Image source={Images.thereVertical} style={styles.rightIconImage} />
                        </TouchableOpacity>
                      </View>
                    )}
                  </View>
                </View>
                {/* cơ quan */}
                <View style={styles.spacer}></View>
                <View style={[styles.section, styles.contentTopItem]}>
                  <View style={[styles.sectionContent, styles.fullHeight]}>
                    <View style={styles.leftSection}>
                      <Image style={styles.iconSection} source={Images.businessFavorite} />
                      <Text style={styles.sectionTextTitle}>{i18n.t("overview.searchFavorite.office")}</Text>
                    </View>
                    {!savedOfficeAddress ? (
                      <TouchableOpacity
                        onPress={() => handleOpenLocationSelection("Office")}
                        style={styles.middleSection}
                      >
                        <Text style={styles.sectionText}>{i18n.t("overview.searchFavorite.setOfficeAddress")}</Text>
                      </TouchableOpacity>
                    ) : (
                      <View >
                        <TouchableOpacity
                          // onPress={() => handleOpenLocationSelection("Office")}
                          onPress={() => handleToPlace(savedOfficeAddress?.item)}
                          style={styles.sectionAddress}
                        >
                          <Text numberOfLines={2} ellipsizeMode="tail" style={styles.sectionTextAddress}>
                            {savedOfficeAddress?.item?.description || savedOfficeAddress?.item?.formatted_address}
                          </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                          style={styles.iconSelect}
                          onPress={() => handleShowOptionTitleContent("Office")}
                        >
                          <Image source={Images.thereVertical} style={styles.rightIconImage} />
                        </TouchableOpacity>
                      </View>
                    )}
                  </View>
                </View>

              </View>
              {/* yêu thích */}
              <View style={styles.section}>
                <View style={[styles.sectionContent]}>
                  <View style={styles.leftSection}>
                    <Image style={styles.iconSection} source={Images.starFavorite} />
                    <Text style={styles.sectionTextTitle}>{i18n.t("overview.searchFavorite.favourite")}</Text>
                    {savedFavoriteAddresses?.length ? (
                      <TouchableOpacity
                        style={styles.rightIconSection}
                        onPress={handleShowDeleteSavedItem}
                      >
                        <Image source={Images.thereVertical} style={styles.rightIconImage} />
                      </TouchableOpacity>
                    ) : null}
                  </View>
                  {savedFavoriteAddresses?.length ? (
                    // savedFavoriteAddresses?.map((e, index) => (
                    <ScrollView>
                      {savedFavoriteAddresses.slice(0, 3).map((e, index) => (
                        <View key={index} style={styles.navFooter}>
                          <TouchableOpacity
                            // onPress={() => handleOpenLocationSelection("Favorite")}
                            onPress={() => handleToPlace(e?.item, index)}
                            style={styles.textNav}
                          >
                            <Text numberOfLines={1} ellipsizeMode="tail" style={styles.titleTextNav}>
                              {e?.item?.structured_formatting ? e?.item?.structured_formatting?.main_text : e?.item?.name}
                            </Text>
                            <Text numberOfLines={2} ellipsizeMode="tail" style={styles.addressTextNav}>
                              {e?.item?.description ? e?.item?.description : e?.item?.formatted_address}
                            </Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            style={styles.rightIconSection}
                            onPress={() => handleShowOptionTitleContent('Favorite', index)}
                          >
                            <Image source={Images.thereVertical} style={styles.rightIconImage} />
                          </TouchableOpacity>
                        </View>
                      ))}
                    </ScrollView>
                  ) : (
                    <TouchableOpacity
                      onPress={() => handleOpenLocationSelection("Favorite")}
                      style={styles.middleSection}
                    >
                      <Text style={styles.sectionText}>{i18n.t("overview.searchFavorite.addFavoritePlace")}</Text>
                    </TouchableOpacity>
                  )}


                </View>
              </View>

            </View>

            {/* footer */}
            <View style={[styles.footer]}>
              <View style={styles.favoriteFooter}>

                {savedFavoriteAddresses?.length ? (
                  <View style={[
                    styles.footerAddLocation,
                    {
                      paddingBottom: Platform.OS === 'ios' ? insets.bottom : Metrics.regular,
                      paddingHorizontal: (Platform.OS === "ios" && !isPortrait) ? insets.left : Metrics.small
                    }
                  ]}>
                    <TouchableOpacity
                      style={styles.footerAddLocationBtn}
                      onPress={() => handleOpenLocationSelection("Favorite")}
                    >
                      <Image style={styles.iconExtraLocation} source={Images.extraLocation} />
                      <Text style={styles.footerAddLocationText}>{i18n.t("overview.searchFavorite.addFavoritePlace")}</Text>
                    </TouchableOpacity>
                  </View>
                ) : <View></View>}

                {/* {isOptionTitleContentVisible && (
                  <View style={[
                    styles.absoluteOverlay
                  ]}>
                    <View style={[
                      styles.optionTitleContent,
                      {
                        paddingBottom: Platform.OS === 'ios' ? insets.bottom : Metrics.regular,
                        paddingHorizontal: (!isPortrait && Platform.OS === 'ios') ? insets.left : Metrics.small,
                      }
                    ]}>
                      <Text style={styles.optionTitle}>{i18n.t("overview.searchFavorite.option")}</Text>
                      <View style={[
                        styles.optionList,
                        {}
                      ]}>
                        <TouchableOpacity style={styles.optionButton} onPress={handleEditLocation}>
                          <Image style={[styles.iconFooter, styles.iconColor]} source={Images.fixLocation} />
                          <Text style={styles.optionText}>{i18n.t("overview.searchFavorite.editLocation")}</Text>
                        </TouchableOpacity>
                        <View style={styles.spacerModal}></View>
                        <TouchableOpacity style={styles.optionButton} onPress={handleDeleteSavedAddress}>
                          <Image style={styles.iconFooter} source={Images.deleteLocation} />
                          <Text style={[styles.optionText, styles.optionTextColor]}>{i18n.t("overview.searchFavorite.deleteLocation")}</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                )} */}

                {/* {isDeleteSavedItemVisible && (
                  <View style={[styles.absoluteOverlay]}>
                    <View style={[
                      styles.optionTitleContent,
                      {
                        paddingBottom: Platform.OS === "ios" ? insets.bottom : Metrics.regular,
                        paddingHorizontal: (!isPortrait && Platform.OS === 'ios') ? insets.left : Metrics.small,
                      }
                    ]}>
                      <Text style={styles.optionTitle}>{i18n.t("overview.searchFavorite.option")}</Text>
                      <TouchableOpacity style={styles.optionButton} onPress={handleDeleteAllSavedItems}>
                        <Image style={styles.iconFooter} source={Images.deleteLocation} />
                        <Text style={[styles.optionText, styles.optionTextColor]}>{i18n.t("overview.searchFavorite.deleteAllSavedItems")}</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                )} */}
              </View>
            </View>

            {isOptionTitleContentVisible && (
              <View style={[
                styles.absoluteOverlay
              ]}>
                <View style={[
                  styles.optionTitleContent,
                  {
                    paddingBottom: Platform.OS === 'ios' ? insets.bottom : Metrics.regular,
                    paddingHorizontal: (!isPortrait && Platform.OS === 'ios') ? insets.left : Metrics.small,
                  }
                ]}>
                  <Text style={styles.optionTitle}>{i18n.t("overview.searchFavorite.option")}</Text>
                  <View style={[styles.optionList]}>
                    <TouchableOpacity style={styles.optionButton} onPress={handleEditLocation}>
                      <Image style={[styles.iconFooter, styles.iconColor]} source={Images.fixLocation} />
                      <Text style={styles.optionText}>{i18n.t("overview.searchFavorite.editLocation")}</Text>
                    </TouchableOpacity>
                    <View style={styles.spacerModal}></View>
                    <TouchableOpacity style={styles.optionButton} onPress={handleDeleteSavedAddress}>
                      <Image style={styles.iconFooter} source={Images.deleteLocation} />
                      <Text style={[styles.optionText, styles.optionTextColor]}>{i18n.t("overview.searchFavorite.deleteLocation")}</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            )}

            {isDeleteSavedItemVisible && (
              <View style={[
                styles.absoluteOverlay
              ]}>
                <View style={[
                  styles.optionTitleContent,
                  {
                    paddingBottom: Platform.OS === 'ios' ? insets.bottom : Metrics.regular,
                    paddingHorizontal: (!isPortrait && Platform.OS === 'ios') ? insets.left : Metrics.small,
                  }
                ]}>
                  <Text style={styles.optionTitle}>{i18n.t("overview.searchFavorite.option")}</Text>
                  <View style={[styles.optionList]}>
                    <TouchableOpacity style={styles.optionButton} onPress={handleDeleteAllSavedItems}>
                      <Image style={styles.iconFooter} source={Images.deleteLocation} />
                      <Text style={[styles.optionText, styles.optionTextColor]}>{i18n.t("overview.searchFavorite.deleteAllSavedItems")}</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            )}
          </View >
        </TouchableWithoutFeedback >
      )
      }
    </SafeAreaInsetsContext.Consumer >
  );
};

function mapStateToProps(state) {
  return {
    showScreen: state.app.showScreen,
    typeRouteInput: state.app.typeRouteInput,
    navigationFrom: state.app.navigationFrom,
    navigationTo: state.app.navigationTo,
    myLocation: state.app.myLocation,
    place: state.app.place
  };
}
const mapDispatchToProps = (dispatch) => ({
  updateShowScreen: (show) => dispatch(appAction.showScreen(show)),
  updateTypeRouteInput: (type) => dispatch(appAction.typeRouteInput(type)),
  updateNavigationFrom: (from) => dispatch(appAction.navigationFrom(from)),
  updateNavigationTo: (to) => dispatch(appAction.navigationTo(to)),
  updatePlace: (place) => dispatch(appAction.place(place)),
  updateMyLocation: (myLocation) => dispatch(appAction.myLocation(myLocation)),
});






export default connect(mapStateToProps, mapDispatchToProps)(FavoriteAddress);

