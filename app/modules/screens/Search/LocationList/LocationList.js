import React, { useState, useEffect, useCallback } from 'react';
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
// import { Colors, Helpers, Images, Metrics, Fonts } from "@app/theme";
import * as appAction from "@app/storage/action/app";
// import styles from "./styles";
import i18n from "@app/i18n/i18n";
import { useGetAutoComplete, useGetPlaceDetail, useGetPlaceDetailFromAddress } from "@app/hooks/place_detail.hook";
import { SwipeListView } from "react-native-swipe-list-view";
import AsyncStorage from '@react-native-community/async-storage';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { SafeAreaInsetsContext, SafeAreaView } from "react-native-safe-area-context";
import { useRoute } from '@react-navigation/native';
// import { SafeAreaInsetsContext, SafeAreaView } from "react-native-safe-area-context";
import { haversineDistance } from '@app/libs/utils.js';
import { useTheme } from "@app/modules/components/context/ThemeContext";
import createStyles from './styles';

const screenHeight = Dimensions.get('window').height;

const LocationList = (props) => {

    const [text, setText] = useState("");
    const [predictions, setPredictions] = useState([]);
    const [isSearchActive, setIsSearchActive] = useState(true);
    const [isHiddenViewVisible, setIsHiddenViewVisible] = useState(false);
    const [searchHistory, setSearchHistory] = useState([]);
    const [isSearchDirectionVisible, setIsSearchDirectionVisible] = useState(false);
    const useFetchGetAutoComplete = useGetAutoComplete();
    const [relatedLocations, setRelatedLocations] = useState([]);
    const [selectedFavorite, setSelectedFavorite] = useState(null);
    const [savedHomeAddress, setSavedHomeAddress] = useState(null);
    const [savedOfficeAddress, setSavedOfficeAddress] = useState(null);
    const [savedFavoriteAddresses, setSavedFavoriteAddresses] = useState(null);
    const [autoCompleteData, setAutoCompleteData] = useState([]);
    const [lastNonEmptyText, setLastNonEmptyText] = useState("");
    const [data, setData] = useState([])
    const navigation = useNavigation();
    const [currentLocation, setCurrentLocation] = useState([105.79829597455202, 21.013715429594125]);
    const [distances, setDistances] = useState();
    const useFetchGetPlaceDetail = useGetPlaceDetail();
    const route = useRoute();
    const { searchText } = route.params || {}; // Nhận tham số từ navigation
    const { isDarkTheme } = useTheme();
    const styles = createStyles(isDarkTheme);
    const Colors = Themes[isDarkTheme ? 'darkMode' : 'lightMode'];
    const useFetchGetPlaceDetailFromAddress = useGetPlaceDetailFromAddress();

    useFocusEffect(
        useCallback(() => {
            if (route.params?.searchText) {
                setText(route.params.searchText);
                handleChangeSearch(route.params.searchText); // Gọi hàm tìm kiếm khi có searchText
            }
        }, [route.params])
    );

    useEffect(() => {
        loadSearchHistory();
        if (props.myLocation != null) {
            setCurrentLocation(props.myLocation)
        }
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


    const handleChangeSearch = (newText) => {
        setText(newText);

        if (newText.length > 0) {
            setLastNonEmptyText(newText);
            setIsSearchActive(false);

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
            if (lastNonEmptyText.length > 0) {
                const params = {
                    location: `${currentLocation[1]}, ${currentLocation[0]}`,
                    searchText: lastNonEmptyText,
                };
                useFetchGetAutoComplete.mutateAsync(params).then(async (response) => {
                    if (response.predictions.length > 0) {
                        setPredictions(response.predictions);
                        setIsHiddenViewVisible(true);
                    }
                });
            } else {
                setPredictions([]);
                setIsHiddenViewVisible(false);
                setRelatedLocations([]);
            }
        }
        if (newText === "") {
            setIsSearchDirectionVisible(true);
        } else {
            setIsSearchDirectionVisible(false);
        }
    };


    const handleClosePress = () => {
        navigation.navigate('SearchScreen');
    };

    const handleCloseBack = () => {
        navigation.goBack();
    };

    const handleLocationPress = async (item) => {
        try {
            const relatedLocations = await AsyncStorage.getItem('searchHistory');
            const parsedRelatedLocations = JSON.parse(relatedLocations) || [];

            if (!item.structured_formatting.main_text || item.structured_formatting.main_text.trim() === "") {
                console.warn("Invalid location: missing main text.");
                return;
            }

            const place = await getPlaceDetail(item);
            // console.log("__________item________", place.results[0])
            item.location = place.results[0].geometry.location;
            const selectedDistance = await getDistance(place);

            const predictionsWithDistance = await Promise.all(parsedRelatedLocations.map(async (location) => {
                // const placeDetail = await getPlaceDetail(location);
                const paramsPlace = {
                    address: location.description,
                };
                const placeDetail = await useFetchGetPlaceDetailFromAddress.mutateAsync(paramsPlace);
                const distance = await getDistance(placeDetail);
                return { ...location, distance };
            }));
            props.updatePlace(item);
            // Lưu lịch sử tìm kiếm
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
            // await loadSearchHistory();
            await AsyncStorage.setItem('relatedLocations', JSON.stringify(parsedRelatedLocations));


            navigation.navigate("SearchDirections", {
                item: { ...item, selectedDistance },
                relatedLocations: predictionsWithDistance,
                distance: `${selectedDistance}`,
                isListVisible: false,
            });
            console.log("______________", item)
            // props.updatePlace(item[0]);

            setIsHiddenViewVisible(false);
        } catch (error) {
            Alert.alert(
                i18n.t("alert.attributes.warning"),
                `${i18n.t("alert.attributes.warning")} (handleLocationPress-LocationList):${error.message}`,
                [
                    { text: i18n.t("alert.attributes.oke") },
                ]
            );
        }
    };


    const getDistance = async (item) => {
        let distance = 0;
        if (props.myLocation) {

            const placeLocation = [item.results[0].geometry.location.lng, item.results[0].geometry.location.lat];
            distance = haversineDistance(props.myLocation, placeLocation)
        }
        return distance.toFixed(2);
    }
    useEffect(async () => {
        const fetchDistances = async () => {
            const newDistances = {};
            for (const item of predictions) {
                const placeDetail = await getPlaceDetail(item);
                const dist = await getDistance(placeDetail);
                newDistances[item.place_id] = dist;
            }
            setDistances(newDistances);
        };
        fetchDistances();
    }, [predictions])

    const getPlaceDetail = async (place) => {
        // console.log("____________________palce_____________", place.place_id)
        let placeDetail = null;
        try {

            const params = {
                placeId: place.place_id,
            };
            const response = await useFetchGetPlaceDetail.mutateAsync(params);
            placeDetail = response;
        } catch (error) {
            Alert.alert(
                i18n.t("alert.attributes.warning"),
                `${i18n.t("alert.attributes.warning")} (getPlaceDetail-LocationList):${error.message}`,
                [
                    { text: i18n.t("alert.attributes.oke") },
                ]
            );
        }
        return placeDetail;
    }



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

    const renderSearch = () => (
        <View
            style={[
                styles.viewFooterInput,
                isHiddenViewVisible && {
                    borderBottomLeftRadius: Metrics.normal,
                    borderBottomRightRadius: Metrics.normal,
                },
            ]}
        >
            <TouchableOpacity onPress={handleCloseBack}>
                <Image source={Images.arrowLeftSearch} style={styles.icArrowLeft} />
            </TouchableOpacity>

            <TextInput
                style={styles.viewContentInput}
                placeholder={i18n.t("overview.attributes.searchInputMenu")}
                placeholderTextColor={Colors.textBrightGrey}
                value={text}
                onChangeText={handleChangeSearch}
            />

            {isSearchActive ? (
                <View style={styles.viewFooterInputIconFrame}>
                    <Text style={styles.viewFooterInputText}>
                        {i18n.t("overview.search.searchList")}
                    </Text>
                </View>
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

    const renderSearchContent = () => (
        <SafeAreaView style={styles.searchView}>
            {renderSearch()}
            {renderSearchEmpty()}
            {/* {renderItem()} */}
        </SafeAreaView>
    );

    return (
        <>
            {renderSearchContent()}
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
});

export default connect(mapStateToProps, mapDispatchToProps)(LocationList);

