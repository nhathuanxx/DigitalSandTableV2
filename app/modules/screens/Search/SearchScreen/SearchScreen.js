import React, { useState, useEffect, useCallback, useMemo, useContext } from 'react';
// import { Text, View, SafeAreaView, Image } from "react-native";
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
  KeyboardAvoidingView,
  ScrollView,
  Alert,
  Keyboard,
  StatusBar,
} from "react-native";
import { connect } from "react-redux";
import { Colors as Themes, Helpers, Images, Metrics, Fonts } from "@app/theme";
import * as appAction from "@app/storage/action/app";
// import styles from "./styles";
import i18n from "@app/i18n/i18n";
import { useGetAutoComplete, useGetPlaceDetail, useGetPlaceDetailFromAddress } from "@app/hooks/place_detail.hook";
import { SwipeListView } from "react-native-swipe-list-view";
import AsyncStorage from '@react-native-community/async-storage';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
// import styles from "./styles";
import { useRoute } from '@react-navigation/native';
import { SafeAreaInsetsContext, SafeAreaView } from "react-native-safe-area-context";
import { haversineDistance } from '@app/libs/utils.js';
import { useTheme } from "@app/modules/components/context/ThemeContext";
import createStyles from './styles';
import VoiceSearch from './VoiceSearch';
import { useOrientation } from "@app/modules/components/context/OrientationContext";
import createHorizontalStyles from "./horizontalStyles";
import { RadioContext } from "@app/modules/screens/Radio/RadioProvider";

const screenHeight = Dimensions.get('window').height;

const SearchScreen = (props) => {

  const route = useRoute();
  const { searchText, voiceSearch, timestamp } = route.params || {};

  const [text, setText] = useState("");
  const [predictions, setPredictions] = useState([]);
  const [isSearchActive, setIsSearchActive] = useState(true);
  const [isHiddenViewVisible, setIsHiddenViewVisible] = useState(false);
  const [searchHistory, setSearchHistory] = useState([]);
  const [isSearchDirectionVisible, setIsSearchDirectionVisible] = useState(false);
  const useFetchGetAutoComplete = useGetAutoComplete();
  const [relatedLocations, setRelatedLocations] = useState([]);
  const [autoCompleteData, setAutoCompleteData] = useState([]);
  const useFetchGetPlaceDetailFromAddress = useGetPlaceDetailFromAddress();


  const [data, setData] = useState([])
  const navigation = useNavigation();
  const [currentLocation, setCurrentLocation] = useState([105.79829597455202, 21.013715429594125]);
  const [distances, setDistances] = useState();
  const useFetchGetPlaceDetail = useGetPlaceDetail();
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [isVoiceSearch, setIsVoiceSearch] = useState(voiceSearch);
  const [isBtnVoiceSearch, setIsBtnVoiceSearch] = useState(true);
  const [dimensions, setDimensions] = useState(Dimensions.get("window"));

  const { resumeRadio } = useContext(RadioContext);
  const { isDarkTheme } = useTheme();
  const { isPortrait } = useOrientation();
  const styles = isPortrait ? createStyles(isDarkTheme, dimensions.width, dimensions.height) : createHorizontalStyles(isDarkTheme, dimensions.width, dimensions.height);
  const Colors = Themes[isDarkTheme ? 'darkMode' : 'lightMode'];

  useEffect(() => {
    const onChange = ({ window }) => setDimensions(window);
    const subscription = Dimensions.addEventListener("change", onChange);

    return () => {
      subscription?.remove();
    };
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadSearchHistory()
      {
        setText('');
        setPredictions([]);
        setIsHiddenViewVisible(false);
        setIsSearchActive(true)
      }
      // Các trạng thái khác...
    }, [route.params])
  );

  useEffect(() => {
    if (voiceSearch && timestamp) {
      setIsVoiceSearch(voiceSearch);
    }
  }, [voiceSearch, timestamp]);


  useEffect(() => {
    loadSearchHistory();
    if (props.myLocation != null) {
      setCurrentLocation(props.myLocation)
    }
    //sự kiện hiện bàn phím
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', (event) => {
      // setKeyboardVisible(true);
      setKeyboardHeight(event.endCoordinates.height + StatusBar.currentHeight);
    });

    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardHeight(0);
    });

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  const loadSearchHistory = async () => {
    try {
      const history = await AsyncStorage.getItem('searchHistory');
      if (history) {
        setSearchHistory(JSON.parse(history));
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

  const saveSearchHistory = async (history) => {
    try {
      await AsyncStorage.setItem('searchHistory', JSON.stringify(history));
      const storedHistory = await AsyncStorage.getItem('searchHistory');
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

  const handleItemPress = async (itemText) => {
    let selectedAddress;
    let relatedLocations = [];

    if (itemText === "favourite") {
      // Điều hướng đến FavoriteAddress 
      navigation.navigate('FavoriteAddress');
      return;
    } else if (itemText === "homeAddress") {
      const homeAddress = await AsyncStorage.getItem('Home');
      selectedAddress = JSON.parse(homeAddress);
      if (!selectedAddress) {
        navigation.navigate('FavoriteAddress');
      }
    } else if (itemText === "office") {
      const officeAddress = await AsyncStorage.getItem('Office');
      selectedAddress = JSON.parse(officeAddress);
      if (!selectedAddress) {
        navigation.navigate('FavoriteAddress');
      }
    }
    if (selectedAddress) {
      console.log("__________________", selectedAddress)
      const params = {
        location: `${currentLocation[1]}, ${currentLocation[0]}`, // Vị trí hiện tại
        searchText: selectedAddress?.item?.structured_formatting?.main_text || selectedAddress?.item.formatted_address, // Tìm kiếm từ địa chỉ đã lưu
      };
      try {
        const response = await useFetchGetAutoComplete.mutateAsync(params);
        relatedLocations = response.predictions || [];

        const relatedLocationsWithDistance = await Promise.all(
          relatedLocations.map(async (location) => {
            const distance = await getDistance(location);
            return { ...location, distance };
          })
        );
        // if (relatedLocationsWithDistance.length > 0) {
        const selectedLocation = relatedLocationsWithDistance.length > 0 ? relatedLocationsWithDistance[0] : null;
        const distance = selectedLocation?.distance || 0;
        navigation.navigate('SearchDirections', {
          selectedAddress: selectedAddress.item, // Truyền đối tượng item đầy đủ
          relatedLocations: relatedLocationsWithDistance,
          distance: distance || 0,
          item: selectedAddress.item, // Truyền location được chọn
        });

        props.updatePlace(selectedLocation);
        // } else {
        //   _showMessageUtil(i18n.t("no_suggestions_found"), "warning");
        // }
      } catch (error) {
        Alert.alert(
          i18n.t("alert.attributes.warning"),
          error.message || i18n.t("alert.attributes.warning"),
          [
            { text: i18n.t("alert.attributes.oke") },
          ]
        );
      }
    }
  };





  const handleChangeSearch = (newText) => {
    setText(newText);

    if (newText.length > 0) {
      setIsSearchActive(false);
      setIsBtnVoiceSearch(false);
      const params = {
        location: `${currentLocation[1]}, ${currentLocation[0]}`,
        searchText: newText,
      };
      useFetchGetAutoComplete.mutateAsync(params).then(async (response) => {
        setAutoCompleteData(response.predictions.slice(0, 5));


        if (response.predictions.length > 0) {
          setPredictions(response.predictions);
          setIsHiddenViewVisible(true);
        }

      });
    } else {
      setIsSearchActive(true);
      setPredictions([]);
      setIsHiddenViewVisible(false);
      setRelatedLocations([]);
    }

    if (newText === "") {
      setIsSearchDirectionVisible(true);
    } else {
      setIsSearchDirectionVisible(false);
    }

  };

  const handleClosePress = () => {
    setIsBtnVoiceSearch(true);
    setText("");
    setIsSearchActive(true);
    setIsHiddenViewVisible(false);
    setPredictions([]);
    setIsSearchDirectionVisible(false);
    props.updatePlace(null);
  };



  const handleCloseBack = () => {
    navigation.navigate('Overview', { setView: new Date().getTime() });
    props.updatePlace(null);
    props.updateMapView({});
  };

  const handleMenuClick = async (item) => {
    console.log('-----------------------------------------------------------------------------');
    try {
      const params = {
        location: `${currentLocation[1]}, ${currentLocation[0]}`,
        searchText: item.textSearch,
      };
      const response = await useFetchGetAutoComplete.mutateAsync(params);
      const predictions = response.predictions || [];
      if (predictions.length > 0) {
        const predictionsWithDistance = await Promise.all(predictions.map(async (location) => {
          const distance = await getDistance(location);
          return { ...location, distance };
        }));
        await AsyncStorage.setItem('relatedLocations', JSON.stringify(predictionsWithDistance));
        const selectedItem = predictionsWithDistance[0];
        const place = await getPlaceDetail(predictionsWithDistance[0])
        selectedItem.location = place.results[0].geometry.location

        const selectedDistance = selectedItem.distance;
        // Chuyển đến màn hình SearchDirections
        navigation.navigate("SearchDirections", {
          item: selectedItem,
          relatedLocations: predictionsWithDistance,
          searchText: item.text,
          isListVisible: true,
          distance: selectedDistance,
        });
        props.updatePlace(selectedItem);
      }
    } catch (error) {
      Alert.alert(
        i18n.t("alert.attributes.warning"),
        `${i18n.t("alert.attributes.warning")} (handleMenuClick-SearchScreen):${error.message}`,
        [
          { text: i18n.t("alert.attributes.oke") },
        ]
      );
    }
  };

  const handleLocationPress = async (item) => {
    try {
      const place = await getPlaceDetail(item)
      item.location = place.results[0].geometry.location
      console.log("_______________search__________", place.results)
      const relatedLocations = await AsyncStorage.getItem('searchHistory');
      const parsedRelatedLocations = JSON.parse(relatedLocations) || [];


      if (!item.structured_formatting.main_text || item.structured_formatting.main_text.trim() === "") {
        console.warn("Invalid location: missing main text.");
        return;
      }
      const selectedDistance = await getDistance(item);
      // const relatedDistances = await Promise.all(parsedRelatedLocations.map(async (location) => {
      //   const distance = await getDistance(location);
      //   return { ...location, distance };
      // }));
      const predictionsWithDistance = await Promise.all(predictions.map(async (prediction) => {
        const distance = await getDistance(prediction);
        return { ...prediction, distance };
      }));

      setSearchHistory((prevHistory) => {
        const existingItem = prevHistory.find(historyItem => historyItem.place_id === item.place_id);
        if (existingItem) {
          return prevHistory;
        }
        let updatedHistory = [item, ...prevHistory];
        if (updatedHistory.length > 50) {
          updatedHistory = updatedHistory.slice(0, 50);
        }
        saveSearchHistory(updatedHistory);
        return updatedHistory;
      });

      await AsyncStorage.setItem('relatedLocations', JSON.stringify(parsedRelatedLocations));
      // Chuyển đến màn hình SearchDirections
      // console.log('predictionsWithDistance: -- ', predictionsWithDistance);
      navigation.navigate("SearchDirections", {
        item: { ...item, selectedDistance },
        distance: `${distances[item.place_id]}`,
        relatedLocations: predictionsWithDistance,
      });

      props.updatePlace(item);
      setIsHiddenViewVisible(false);
    } catch (error) {
      Alert.alert(
        i18n.t("alert.attributes.warning"),
        `${i18n.t("alert.attributes.warning")} (handleLocationPress-SearchScreen):${error.message}`,
        [
          { text: i18n.t("alert.attributes.oke") },
        ]
      );
    }
  };

  const handleSearchHistoryClick = async (item) => {
    try {
      if (!item.location) {
        const paramsPlace = {
          address: item.description,
        };
        const response = await useFetchGetPlaceDetailFromAddress.mutateAsync(paramsPlace);
        // console.log("__________test___________", response.results[0])
        item.location = response.results[0].geometry.location;
      }

      const distance = await getDistance(item);
      const params = {
        location: `${currentLocation[1]}, ${currentLocation[0]}`,
        searchText: item.structured_formatting ? item.structured_formatting.main_text : item.formatted_address,
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
      let searchHistoryAfter = searchHistory;
      const index = searchHistoryAfter.findIndex(history =>
        history.place_id === item.place_id ||
        (history.location.lat === item.location.lat && history.location.lng === item.location.lng)
      );
      if (index !== -1) {
        // Lấy phần tử đó ra khỏi mảng
        const [item] = searchHistoryAfter.splice(index, 1);
        // Đưa phần tử đó lên đầu mảng
        searchHistoryAfter.unshift(item);
      }
      await saveSearchHistory(searchHistoryAfter);
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

  const deleteRow = (rowMap, placeId, data) => {
    let check = true;
    const keys = Object.keys(rowMap);

    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      const rowRef = rowMap[key];

      if (rowRef) {
        if (rowRef.props?.item?.location == undefined) {
          clearHistory();
          check = false;
          Alert.alert(
            i18n.t("alert.attributes.warning"),
            i18n.t("alert.attributes.errorHistory"),
            [
              { text: i18n.t("alert.attributes.oke") },
            ]
          );
          break; // Dừng vòng lặp khi có lỗi lần đầu tiên
        }
      }
    }
    if (check == true) {
      const place = `${data.location.lat}-${data.location.lng}`
      const rowKey = Object.keys(rowMap).find(key => `${rowMap[key]?.props?.item?.location.lat}-${rowMap[key]?.props?.item?.location.lng}` === place);
      if (rowKey) {

        rowMap[rowKey].closeRow();
        const newSearchHistory = searchHistory.filter(item => `${item.location.lat}-${item.location.lng}` !== place);
        setSearchHistory(newSearchHistory);
        saveSearchHistory(newSearchHistory)
      }
    }
    // console.log("___________________log_____________", rowMap)
    // Lấy danh sách key từ rowMap
  };

  const clearHistory = () => {
    setSearchHistory([]);
    AsyncStorage.removeItem('searchHistory');
  };

  const getDistance = async (item) => {
    // console.log("___________________--", item)
    const params = {
      address: item.description,
    };

    try {
      let distance = 0;
      if (props.myLocation) {
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
        `${i18n.t("alert.attributes.warning")} (getDistance-SearchScreen):${error.message}`,
        [
          { text: i18n.t("alert.attributes.oke") },
        ]
      );
    }
  }

  useEffect(async () => {
    const fetchDistances = async () => {
      const newDistances = {};
      for (const item of predictions) {
        const dist = await getDistance(item);
        newDistances[item.place_id] = dist;
      }
      setDistances(newDistances);
    };
    fetchDistances();
  }, [predictions])

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
        `${i18n.t("alert.attributes.warning")} (getPlaceDetail-SearchScreen):${error.message}`,
        [
          { text: i18n.t("alert.attributes.oke") },
        ]
      );
    }
    return placeDetail;
  }

  const handleShowVoiceSearch = () => {
    setKeyboardVisible(false);
    Keyboard.dismiss();
    setIsVoiceSearch(true);
    // if (isPlaying) {
    // pauseRadio();
    // }
  }
  const handleCloseVoiceSearch = useCallback(() => {
    setIsVoiceSearch(false);
    resumeRadio();
  }, [])

  const handleVoiceSearch = useCallback(async (searchText) => {
    setText(searchText);
    // resumeRadio();
    // handleChangeSearch(searchText);
    try {
      const params = {
        location: `${currentLocation[1]}, ${currentLocation[0]}`,
        searchText: searchText,
      };
      const response = await useFetchGetAutoComplete.mutateAsync(params);
      const predictions = response.predictions || [];
      if (predictions.length > 0) {
        const predictionsWithDistance = await Promise.all(predictions.map(async (location) => {
          const distance = await getDistance(location);
          return { ...location, distance };
        }));
        await AsyncStorage.setItem('relatedLocations', JSON.stringify(predictionsWithDistance));
        const selectedItem = predictionsWithDistance[0];
        const place = await getPlaceDetail(predictionsWithDistance[0])
        selectedItem.location = place.results[0].geometry.location
        const selectedDistance = selectedItem.distance;
        setIsVoiceSearch(false);
        handleSaveVoiceSearchHistory(selectedItem); // lưu lịch sử
        // Chuyển đến màn hình SearchDirections
        navigation.navigate("SearchDirections", {
          item: selectedItem,
          relatedLocations: predictionsWithDistance,
          searchText: searchText,
          isListVisible: true,
          distance: selectedDistance,
        });
        props.updatePlace(selectedItem);
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
  }, [])

  const renderLocationItem = ({ item, index }) => {
    return (
      // <SafeAreaInsetsContext.Consumer>
      //   {(insets) => (
      <View style={styles.locationList}>
        <TouchableOpacity
          key={index}
          style={styles.viewLocationContent}
          onPress={() => handleLocationPress(item)} // Gọi hàm khi nhấn vào
        >
          <View style={styles.contentListLeftSection}>
            <Text style={styles.txtAddress}>
              {item.structured_formatting.main_text}
            </Text>
            <Text
              numberOfLines={3}
              elLipSizeMode='tail'
              style={styles.address}>{item.description}</Text>
          </View>

          <View style={styles.iconPathOnly}>
            <TouchableOpacity>
              <Image
                source={Images.direction}
                style={styles.iconRightDirections}
              />
            </TouchableOpacity>

            <Text style={styles.distance}>
              {props.myLocation != null ? `${distances[item.place_id] ? distances[item.place_id] : "-- "} km` : `-- km`}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
      //   )}
      // </SafeAreaInsetsContext.Consumer >

      // </ScrollView>
    );
  };

  const handleSaveVoiceSearchHistory = useCallback((place) => {
    setSearchHistory((prevHistory) => {
      const existingItem = prevHistory.find(historyItem => historyItem.place_id === place.place_id);
      if (existingItem) {
        return prevHistory;
      }
      let updatedHistory = [place, ...prevHistory];
      if (updatedHistory.length > 50) {
        updatedHistory = updatedHistory.slice(0, 50);
      }
      saveSearchHistory(updatedHistory);
      return updatedHistory;
    });
  }, [searchHistory])

  const renderInputSearchView = () => (
    <View
      style={[
        styles.inputSearchView,
        isHiddenViewVisible && {
          borderBottomLeftRadius: Metrics.normal,
          borderBottomRightRadius: Metrics.normal,
        },
      ]}
    >
      {/* Back button */}
      <TouchableOpacity onPress={handleCloseBack} style={styles.btnBack}>
        <Image source={Images.arrowLeftSearch} style={styles.icArrowLeft} />
      </TouchableOpacity>

      {/* Text Input */}
      <TextInput
        style={styles.viewContentInput}
        placeholder={i18n.t("overview.attributes.searchInputMenu")}
        placeholderTextColor={Colors.textBrightGrey}
        value={text}
        onChangeText={handleChangeSearch}
        disableFullscreenUI={true}
      />
      {/* Right Side Button */}
      {isSearchActive ? (
        <>
          {!isPortrait &&
            <TouchableOpacity style={styles.footerIconFrame}
              onPress={handleShowVoiceSearch}
            >
              <View>
                <Image style={styles.iconVoice} source={Images.frame} />
              </View>
            </TouchableOpacity>
          }
          <View style={styles.viewFooterInputIconFrame}>
            <Text style={styles.viewFooterInputText}>
              {i18n.t("overview.search.searchList")}
            </Text>
          </View>
        </>
      ) : (
        <TouchableOpacity
          style={styles.viewFooterInputIconFrame}
          onPress={handleClosePress}
        >
          <View style={styles.iconStyleMenuClose}>
            <Image style={styles.iconCloseInput} source={Images.close} />
          </View>
        </TouchableOpacity>
      )}


    </View>
  );

  const onRowDidOpen = rowKey => {
    console.log('This row opened', rowKey);
  };
  const renderItemSwipeList = data => (
    <TouchableHighlight
      onPress={() => handleSearchHistoryClick(data.item)} // Gọi hàm xử lý khi nhấn vào mục lịch sử
      style={styles.rowFront}
      underlayColor={'#AAA'}
    >
      <View style={styles.rowContainer}>
        <View style={styles.titleCenter}>
          <View>
            <Image
              source={Images.historyTime}
              style={styles.iconStyleHistory}
            />
          </View>
          <View style={styles.textTitle}>
            <View style={styles.title}>
              <Text style={styles.textStyle}
                numberOfLines={1}
                ellipsizeMode='tail'
              >
                {data.item.structured_formatting ? data.item.structured_formatting.main_text : data.item.name}
              </Text>
            </View>
            <View>
              <Text style={styles.addressStyle}
                numberOfLines={1}
                ellipsizeMode='tail'
              >
                {data.item.description}
              </Text>
            </View>
          </View>
        </View>
        <View>
          <Image
            source={Images.direction}
            style={styles.iconRight}
          />
        </View>
      </View>
    </TouchableHighlight>
  );

  const renderHiddenItem = (data, rowMap) => (
    <View style={styles.rowBack}>
      <TouchableOpacity
        style={[styles.backRightBtn, styles.backRightBtnRight]}
        onPress={() => deleteRow(rowMap, data.item.place_id, data.item)} // Sử dụng 'id' thay vì 'key'
      >
        <Image
          style={styles.iconClose}
          source={Images.close}
        />
      </TouchableOpacity>
    </View>
  );
  const renderSwipeListView = () => {
    return (
      <FlatList
        data={searchHistory.slice(0, 8)} // renderItem của SwipeListView
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <SwipeListView
            data={[item]} // Chỉ truyền một item tại mỗi lần lặp
            renderItem={renderItemSwipeList}
            renderHiddenItem={renderHiddenItem}
            disableRightSwipe={true}
            rightOpenValue={-50}
            onRowDidOpen={onRowDidOpen}
            keyboardShouldPersistTaps="handled"
          />
        )}
      />
    );
  };

  const renderSearchEmpty = () =>
    isHiddenViewVisible && (
      <View style={styles.ViewLocationContentList}>
        <FlatList
          data={predictions}
          renderItem={renderLocationItem}
          keyExtractor={(item, index) => index.toString()}
          keyboardShouldPersistTaps="handled"
        />
        {/* <View style={styles.loadMoreContainer}>
                    <TouchableOpacity style={styles.loadMoreButton}>
                        <Text style={styles.loadMoreText}>{i18n.t("overview.search.seeMoreResults")}</Text>
                    </TouchableOpacity>
                </View> */}
      </View>
    );

  const renderItem = () =>
    predictions.length === 0 && (
      <View style={styles.contentBottom}>
        <View style={styles.containerVerticalLine}>
          {[
            { icon: Images.home, text: "homeAddress" },
            { icon: Images.agency, text: "office" },
            { icon: Images.favorites, text: "favourite" },
          ].map((item, index) => (
            <>
              <View key={index} style={styles.item}>
                <TouchableOpacity
                  style={styles.iconText}
                  onPress={() => handleItemPress(item.text)}
                >
                  <Image source={item.icon} style={styles.iconVerticalLine} />
                  <Text style={styles.textIcon}>
                    {i18n.t(`overview.attributes.${item.text}`)}

                  </Text>
                </TouchableOpacity>
              </View>
              {index < 2 && <View style={styles.verticalLine} />}
            </>
          ))}
        </View>
        <View style={styles.viewFooterHistory}>
          {searchHistory.length > 0 &&
            <View style={styles.historyList}>
              {renderSwipeListView()}
            </View>
          }
          <View style={{ flex: 1 }}>
            {/* Nếu có lịch sử tìm kiếm, hiển thị nút xóa */}
            {searchHistory.length > 0 ? (
              <View style={styles.searchHistoryDelete}>
                <TouchableOpacity onPress={clearHistory}>
                  <Text style={styles.searchHistoryText}>{i18n.t("overview.search.clearSearchHistory")}</Text>
                </TouchableOpacity>
              </View>
            ) : (
              // Nếu không có lịch sử tìm kiếm, hiển thị thông báo
              <View style={styles.searchHistory}>
                <TouchableOpacity>
                  <Text style={styles.searchHistoryText}>{i18n.t("overview.search.noSearchHistory")}</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </View >

    );

  const getItems = () => {
    return [
      {
        icon: Images.eatDrink,
        text: i18n.t("overview.attributes.eatDrink"), // Text for ăn uống
        color: Colors.yellow_bland,
        textSearch: "Ăn uống",
      },
      {
        icon: Images.hotel,
        text: i18n.t("overview.attributes.hotel"), // Text for khách sạn
        color: Colors.blue_bland,
        textSearch: "Khách sạn",
      },
      {
        icon: Images.seatSing,
        text: i18n.t("overview.attributes.sightSeeing"),
        color: Colors.light_green_bland,
        textSearch: "Thăm quan",
      },
      {
        icon: Images.gasStation,
        text: i18n.t("overview.attributes.gasStation"),
        color: Colors.blue_shadow_light,
        textSearch: "Trạm xăng",
      },
      {
        icon: Images.entertainment,
        text: i18n.t("overview.attributes.entertainment"),
        color: Colors.purple_light,
        textSearch: "Giải trí",
      },
    ]
  };

  const items = useMemo(getItems, []);

  const renderHeaderService = () =>
    (predictions.length === 0) && (
      <View style={styles.viewHeaderService}>
        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1 }}>
          <View style={styles.viewContentService}>
            {items.map((menuItem, index) => (
              <>
                <TouchableOpacity key={index}
                  style={styles.containerMenu}
                  onPress={() => handleMenuClick(menuItem)}
                >
                  <View
                    style={[
                      styles.iconWrapper,
                      { backgroundColor: menuItem.color },
                    ]}
                  >
                    <Image
                      style={styles.imgContainerMenu}
                      source={menuItem.icon}
                    />
                  </View>
                  <Text style={styles.txtContainerMenu} numberOfLines={1} ellipsizeMode='tail'>
                    {menuItem.text}
                  </Text>
                </TouchableOpacity>
                {
                  index !== items.length - 1 && <View style={styles.spacer}></View>
                }
              </>
            ))}
          </View>
        </ScrollView>

      </View>
    )

  const renderVoiceSearch = () => (
    <VoiceSearch
      handleClose={handleCloseVoiceSearch}
      // keyboardHeight={keyboardHeight}
      handleSearch={handleVoiceSearch}
      handleSaveVoiceSearchHistory={handleSaveVoiceSearchHistory}
    />
  )

  const renderButtonVoiceSearch = () => (
    <SafeAreaInsetsContext.Consumer>
      {(insets) => (
        <View style={[styles.viewShowVoiceSearch, { bottom: keyboardHeight + Metrics.normal + insets.bottom }]}>
          <TouchableOpacity style={styles.btnVoiceSearch} onPress={handleShowVoiceSearch}>
            <Image source={Images.frame} style={styles.btnVoiceSearchIcon} />
            <Text style={styles.btnVoiceSearchText}>{i18n.t("overview.search.voiceSearch")}</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaInsetsContext.Consumer >
  )

  // render màn ngang

  //

  const renderSearchContent = () => (
    <SafeAreaView style={styles.searchView}>
      {renderInputSearchView()}
      {renderSearchEmpty()}
      {renderHeaderService()}
      {renderItem()}
      {isBtnVoiceSearch && isPortrait && renderButtonVoiceSearch()}
      {isVoiceSearch && renderVoiceSearch()}
    </SafeAreaView>
  );

  return (
    <>
      {renderSearchContent()}
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

export default connect(mapStateToProps, mapDispatchToProps)(SearchScreen);