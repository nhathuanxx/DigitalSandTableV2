import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  PermissionsAndroid,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Images, Colors as Themes, Metrics } from "@app/theme";
import { useNavigation, useRoute } from "@react-navigation/native";
import { fetchCamera } from "@app/libs/CameraAxios";
import i18n from "@app/i18n/i18n";
import { useGetPlaceDetailFromLatLong, useGetPlaceDetailFromAddress } from "@app/hooks/place_detail.hook";
import { connect } from "react-redux";
import * as appAction from "@app/storage/action/app";
import { haversineDistance } from '@app/libs/utils.js';
import { STREAM_URL, IMAGE_URL } from "@app/config/camera";
import Header from "../Header";
import ImageWithFallback from "../ImageWithFallback ";
import createStyles from "./styles";
import { useTheme } from "@app/modules/components/context/ThemeContext";
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import DropdownElement from "../../../../components/element/DropdownElement";

const ProvinceCamera = (props) => {
  const { isDarkTheme } = useTheme();
  const Colors = Themes[isDarkTheme ? 'darkMode' : 'lightMode'];
  const styles = createStyles(isDarkTheme);

  const navigation = useNavigation();
  const route = useRoute();
  const { province } = route.params;
  const useFetchPlaceDetailFromLatLong = useGetPlaceDetailFromLatLong();
  const useFetchPlaceDetailFromAddress = useGetPlaceDetailFromAddress();

  const [visibleData, setVisibleData] = useState([]);
  const [visibleDataFilter, setVisibleDataFilter] = useState([]);
  const [dataFilter, setDataFilter] = useState([]);
  const [timestamp, setTimestamp] = useState(Date.now);
  const [visibleItems, setVisibleItems] = useState(10);
  const [isLoadingMore, setIsLoadingMore] = useState(true);
  const [data, setData] = useState([]);
  const [count, setCount] = useState(1);
  const [selectedId, setSelectedId] = useState(undefined);
  const [districts, setDistricts] = useState(new Set([{ value: '', label: i18n.t(`account.camera.all`) }]));
  const [districtFilter, setDistrictFilter] = useState('');
  const [urlType, setUrlType] = useState(undefined);
  const [searchText, setSearchText] = useState('');
  const [dataFilterTemp, setDataFilterTemp] = useState([]);

  const getData = async (newController) => {
    // console.log('province : ', province);
    try {
      let response = [];
      if (data.length <= 0) { // load camera lần đầu
        const result = await fetchCamera(province.id, newController);
        setUrlType(result.style);
        setData(result.data);
        response = result.data.slice(visibleItems - 10, visibleItems);
        const uniqueDistricts = new Set([...districts]);
        result.data.forEach(item => {
          const districtValue = item.district;
          if (districtValue && districtValue !== '---' && ![...uniqueDistricts].some(d => d.value === districtValue)) {
            uniqueDistricts.add({ value: districtValue, label: districtValue });
          }
        });
        setDistricts(uniqueDistricts);
      } else if (districtFilter !== '' || searchText !== '') { // nếu đang lọc hoặc tìm kiếm
        response = dataFilter.slice(visibleItems - 10, visibleItems);
      } else {
        response = data.slice(visibleItems - 10, visibleItems);
      }
      if (response && response.length > 0) {
        const updatedResponse = [];

        for (let i = 0; i < response.length; i++) {
          let distance = undefined;
          if (response[i].location && response[i].location.latitude > 0) {
            const params = {
              latlng: `${response[i].location.latitude || ''},${response[i].location.longitude || ''}`
            }
            // const granted = await requestLocationPermission();
            if (props.myLocation != null) {
              const placeLocation = [response[i].location.longitude, response[i].location.latitude];
              distance = haversineDistance(props.myLocation, placeLocation).toFixed(2);
            }
          }
          updatedResponse.push({
            ...response[i],
            district: response[i].district || '---',
            distance: distance ? distance : '---',
          });


        }

        if (!newController.signal.aborted) {
          if (districtFilter || searchText !== '') {
            // console.log('setVisibleDataFilter ------------ ', updatedResponse);
            setVisibleDataFilter(prevData => [...prevData, ...updatedResponse]);
          }
          setVisibleData(prevData => [...prevData, ...updatedResponse]);
          setIsLoadingMore(false);
        }
      } else {
        setIsLoadingMore(false);
      }
    } catch (error) {
      console.log('error fetch data: === ', error);
      setIsLoadingMore(false);
    }
  };

  useEffect(() => {
    const newController = new AbortController();
    getData(newController);
    // console.log("active ------------ ");
    return () => {
      newController.abort();
    };
  }, [visibleItems, dataFilter]);


  const handleOnPressCamera = (item) => {
    const params = {
      cameraDetail: item,
      province: province,
      urlType: urlType,
      data: data
      // listCamera:
    }
    const locationList = data
      .filter(item => item.location && item.location.latitude > 0)
      .map(item => item.location);
    if (item.location && item.location.latitude > 0) {
      props.updateCameraLocationSelected([item.location.longitude, item.location.latitude]);
    }
    props.updateCameraLocations(locationList);
    navigation.navigate('CameraDetail', params)
  }

  const loadMoreItems = () => {
    if (isLoadingMore || (dataFilter.length > 0 && visibleItems >= dataFilter.length) || visibleItems >= data.length) return;
    setIsLoadingMore(true);
    setVisibleItems(prev => prev + 10);
  };

  const handleChangeCondition = (condition, action) => {
    setVisibleItems(10);
    setVisibleDataFilter([]);
    setIsLoadingMore(true);
    let searchTextFilter;
    let district;
    if (action === 'search') {
      setSearchText(condition);
      searchTextFilter = condition;
      district = districtFilter;
    } else {
      setDistrictFilter(condition.value);
      searchTextFilter = searchText;
      district = condition.value;
      // console.log('district filter --- ', district);
    }

    const filterData = data.filter(item =>
      (item.district?.toLowerCase().includes(searchTextFilter.toLowerCase()) ||
        item.address?.toLowerCase().includes(searchTextFilter.toLowerCase()) ||
        item.name?.toLowerCase().includes(searchTextFilter.toLowerCase())) &&
      (!item.district || item.district.includes(district))
    );
    // console.log('filterData =========== ', filterData);
    setDataFilter(filterData);
  }

  const renderHeader = () => (
    <Header name={i18n.t(`account.camera.${province.name}`)} prevScreen={'Province'} params={{ title: i18n.t(`account.navbar.camera`) }} />
  )

  const now = useMemo(() => Date.now(), []);

  const renderCameraItem = (item) => (
    <TouchableOpacity
      style={[styles.cameraItem, selectedId && selectedId === item.id ? { backgroundColor: Colors.backgroundGreen } : {}]}
      onPress={() => handleOnPressCamera(item)}
    >
      {urlType === IMAGE_URL &&
        <View style={styles.viewItemImage}>
          <ImageWithFallback
            ImageSource={`${item.link}?${now}`}
            fallbackSource={Images.noCamera}
            style={styles.cameraItemImage} />
        </View>
      }
      <View style={styles.cameraItemRight}>
        <View style={styles.cameraItemInfo}>
          <Image source={Images.trafficLight} style={[styles.cameraItemIcon, styles.iconBlue]} resizeMode='contain' />
          <Text style={[styles.cameraItemText, styles.textBold]}>{item.name}</Text>
        </View>
        <View style={styles.cameraItemInfo}>
          <Image source={Images.district} style={[styles.cameraItemIcon, styles.iconBlue]} resizeMode='contain' />
          <Text style={[styles.cameraItemText]}>{item.district}</Text>
        </View>
        {item.address &&
          <View style={styles.cameraItemInfo}>
            <Image source={Images.locationRoute} style={styles.cameraItemIcon} resizeMode='contain' />
            <Text style={[styles.cameraItemText]}>{item.address}</Text>
          </View>
        }
        <View style={styles.cameraItemInfo}>
          <Image source={Images.detailsRoute} style={[styles.cameraItemIcon, styles.iconBlue]} resizeMode='contain' />
          <Text style={[styles.cameraItemText]}>{i18n.t(`account.camera.distance`, { distance: item.distance })}</Text>
        </View>
      </View>
    </TouchableOpacity>
  )

  const renderContent = () => (
    <View style={styles.cameraArea}>
      <View style={styles.cameraAreaHeader}>
        {renderNavbar()}
      </View>
      <View style={styles.cameraList}>
        {visibleData.length > 0 ? (
          <FlatList
            // data={districtFilter && districtFilter.value !== 'all'  ? visibleDataFilter : visibleData}
            data={districtFilter !== '' || searchText !== '' ? visibleDataFilter : visibleData}
            keyExtractor={(item, index) => item.id ? item.id + index.toString() : index.toString()}
            renderItem={({ item }) => renderCameraItem(item)}
            onEndReached={loadMoreItems}
            onEndReachedThreshold={0.1}
            ListFooterComponent={isLoadingMore ?
              <ActivityIndicator size='large' color={Colors.blueText} /> : null}
          />
        ) : (
          <View>
            <Text style={styles.emptyText}>{i18n.t(`account.camera.empty`)}</Text>
          </View>
        )}
      </View>
    </View>
  )


  const renderNavbar = () => (
    <View style={styles.navbarFooter} >
      <TextInput
        style={styles.boxSearch}
        onChangeText={(text) => handleChangeCondition(text, 'search')}
        placeholder={i18n.t(`account.camera.placeholderSearch`)}
        placeholderTextColor={Colors.inputPlaceholder}
        disableFullscreenUI={true}
      />
      {/* <Dropdown
        style={styles.dropdown}
        data={[...districts].map(district => ({ value: district.value, label: district.label }))}
        labelField="label"
        valueField="value"
        placeholder={i18n.t(`account.camera.districtFilter`)}
        placeholderStyle={[styles.textPicker, styles.placeholder]}
        search={false}
        containerStyle={styles.dropdownContainer}
        selectedTextStyle={styles.textPicker}
        renderItem={(item) => (
          <View style={styles.itemStyle}>
            <Text style={styles.textPicker}>{item.label}</Text>
          </View>
        )}
        value={districtFilter}
        onChange={(value) => handleChangeCondition(value, 'filter')}

        renderRightIcon={() => (
          <Image
            source={Images.arrow_dow}
            style={{ width: 24, height: 24, tintColor: Colors.text }}
          />
        )}
      /> */}
      <DropdownElement
        data={[...districts].map(district => ({ value: district.value, label: district.label }))}
        value={districtFilter}
        onChange={(value) => handleChangeCondition(value, 'filter')}
        placeholder={i18n.t(`account.camera.districtFilter`)}
      />
    </View>
  )

  return (
    <View style={styles.container}>
      {renderHeader()}
      <View style={styles.content}>
        {isLoadingMore && visibleData.length <= 0 ? (
          <ActivityIndicator size='large' color={Colors.blueText} />
        ) : renderContent()}
      </View>
    </View>
  )
}

function mapStateToProps(state) {
  return {
    myLocation: state.app.myLocation,
    cameraLocations: state.app.cameraLocations,
    cameraLocationSelected: state.app.cameraLocationSelected
  };
}
const mapDispatchToProps = (dispatch) => ({
  // updatePlace: (place) => dispatch(appAction.place(place)),
  updateCameraLocations: (cameraLocations) => dispatch(appAction.cameraLocations(cameraLocations)),
  updateCameraLocationSelected: (cameraLocationSelected) => dispatch(appAction.cameraLocationSelected(cameraLocationSelected)),
});

export default connect(mapStateToProps, mapDispatchToProps)(React.memo(ProvinceCamera));
