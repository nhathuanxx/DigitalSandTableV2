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
  ScrollView,
  SegmentedControlIOSComponent
} from "react-native";
import { useNavigation } from '@react-navigation/native';
import styles from "./styles";
import { connect } from "react-redux";
import { Colors as Themes, Helpers, Images, Metrics, Fonts } from "@app/theme";
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
import DatePicker from 'react-native-datepicker';
import * as db from "@app/storage/sqliteDbUtils";
import { getDistance } from 'geolib';
import { Alert } from 'react-native';
import { useOrientation } from "@app/modules/components/context/OrientationContext";
import createHorizontalStyles from "./horizontalStyles";
import * as turf from '@turf/turf';

MapLibreGL.setAccessToken(null);

const MoveHistory = (props) => {
  const navigation = useNavigation();
  const route = useRoute(); // Make sure to define `route` first
  const [totalDistance, setTotalDistance] = useState(0);
  const [totalTime, setTotalTime] = useState(0);
  const [locationHistory, setLocationHistory] = useState([]);
  const [startLocationDetail, setStartLocationDetail] = useState(null);
  const [endLocationDetail, setEndLocationDetail] = useState(null);
  const useFetchGetPlaceDetailFromLatLong = useGetPlaceDetailFromLatLong();
  const [isMoveHistory, setIsMoveHistory] = useState(true);


  const camera = useRef(null);
  const mapRef = useRef(null);

  const [selectedIndex, setSelectedIndex] = useState(null);
  const [date, setDate] = useState(new Date());
  const [open, setOpen] = useState(false);
  const [isStyleMapVisible, setIsStyleMapVisible] = useState(false);
  const [renderKey, setRenderKey] = useState(0);
  const [zoomLevelIn, setZoomLevelIn] = useState(0);
  const [zoomLevelOut, setZoomLevelOut] = useState(0);
  const isDataAvailable = locationHistory.length > 0;
  const [styleMap, setStyleMap] = useState(undefined);

  const { isPortrait, dimensions } = useOrientation();
  const { isDarkTheme } = useTheme();
  const Colors = Themes[isDarkTheme ? 'darkMode' : 'lightMode'];
  const styles = isPortrait ?
    createStyles(isDarkTheme, dimensions.width, dimensions.height)
    : createHorizontalStyles(isDarkTheme, dimensions.width, dimensions.height);

  useEffect(() => {
    setIsMoveHistory(true); // Set true khi render component

    return () => {
      setIsMoveHistory(false); // Set false khi component unmount
    };
  }, []);


  const formatDate = (date, includeDayName = true) => {
    try {
      const daysOfWeek = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];
      const months = ["tháng 1", "tháng 2", "tháng 3", "tháng 4", "tháng 5", "tháng 6", "tháng 7", "tháng 8", "tháng 9", "tháng 10", "tháng 11", "tháng 12"];

      const dayName = daysOfWeek[date.getDay()];
      const day = String(date.getDate()).padStart(2, '0');
      const month = months[date.getMonth()];
      const year = date.getFullYear();

      if (includeDayName) {
        return `${dayName}, ${day} ${month}, ${year}`;
      }
      return `${day} ${month}, ${year}`;
    } catch (error) {
      // Hiển thị thông báo lỗi
      Alert.alert(
        i18n.t("alert.attributes.warning"),
        `${i18n.t("alert.attributes.warning")} (MoveHistory-formatDate):${error.message}`,
        [
          { text: i18n.t("alert.attributes.oke") },
        ]
      );
    }
  };


  const getDayName = (date) => {
    try {
      const daysOfWeek = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];
      return daysOfWeek[date.getDay()];
    } catch (error) {
      // Hiển thị thông báo lỗi
      Alert.alert(
        i18n.t("alert.attributes.warning"),
        `${i18n.t("alert.attributes.warning")} (MoveHistory-getDayName):${error.message}`,
        [
          { text: i18n.t("alert.attributes.oke") },
        ]
      );
    }
  };

  const handleBackLocation = () => {
    navigation.goBack();
  };

  const getWeekDays = (baseDate) => {

    try {
      const days = [];
      const dayOfWeek = baseDate.getDay();
      for (let i = 0; i < 7; i++) {
        const currentDay = new Date(baseDate);
        currentDay.setDate(baseDate.getDate() + (i - dayOfWeek));
        days.push({
          name: getDayName(currentDay),
          date: currentDay
        });
      }
      return days;
    } catch (error) {
      // Hiển thị thông báo lỗi
      Alert.alert(
        i18n.t("alert.attributes.warning"),
        `${i18n.t("alert.attributes.warning")} (MoveHistory-getWeekDays):${error.message}`,
        [
          { text: i18n.t("alert.attributes.oke") },
        ]
      );
    }
  };

  const weekDays = getWeekDays(date);
  const isToday = (day) => {
    const today = new Date();
    return day.getDate() === today.getDate() &&
      day.getMonth() === today.getMonth() &&
      day.getFullYear() === today.getFullYear();
  };

  // useEffect(async () => {
  //   const zoom = await mapRef.current?.getZoom();
  //   if (props.zoomLevelIn && zoom <= 17) {
  //     // setZoomLevel(zoom + 1)
  //     if (camera.current) {
  //       camera.current.setCamera({
  //         zoomLevel: zoom + 1,
  //         animationDuration: 1000,
  //       });
  //     }
  //   }
  // }, [props.zoomLevelIn]);


  // useEffect(async () => {
  //   const zoom = await mapRef.current?.getZoom();
  //   if (props.zoomLevelOut && zoom > 5) {
  //     // setZoomLevel(zoom - 1)
  //     camera.current.setCamera({
  //       zoomLevel: zoom - 1,
  //       animationDuration: 1000,
  //     });
  //   }
  // }, [props.zoomLevelOut]);

  useEffect(async () => {
    try {
      // db.getLocationHistory(date, setLocationHistory);  // Lấy dữ liệu lịch sử từ DB
      // console.log("+++++++++++++++++++++++status++++++++++++++++", getHistory(date))

      setLocationHistory(await getHistory(date))
    } catch (error) {
      Alert.alert(
        i18n.t("alert.attributes.warning"),
        `Lỗi lấy dữ liệu 'date': ${error.message}`,
        [
          { text: i18n.t("alert.attributes.oke") },
        ]
      );
    }
  }, [date]);

  const getHistory = (date) => {
    return new Promise((resolve, reject) => {
      db.getLocationHistory(date, (status, result) => {
        if (status) {
          resolve(result);
        } else {
          reject(new Error('lỗi lấy thông tin xe'));
        }
      });
    });
  };



  const getPlaceDetailFromLatLong = async (lat, long) => {
    let place = null;
    const params = {
      latlng: `${lat},${long}`,  // Correctly formatted latlng string
    };
    try {
      // Call your API function (assuming you're using Axios or similar)
      const response = await useFetchGetPlaceDetailFromLatLong.mutateAsync(params);
      // Check if response and data are available
      // console.log('-------------------response--------------', response)

      if (response.results.length) {
        place = response.results[0];

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
    return place;
  };

  useEffect(() => {
    try {
      if (locationHistory.length > 0) {
        // const totalTime = locationHistory.reduce((sum, item) => sum + parseFloat(item.totalTime), 0);
        // const totalDistance = locationHistory.reduce((sum, item) => sum + parseFloat(item.totalDistance), 0);
        const firstLocation = locationHistory[0];
        const lastLocation = locationHistory[locationHistory.length - 1];
        setTotalDistance(calculateTotalDistance(locationHistory));
        setTotalTime((locationHistory[locationHistory.length - 1].time - locationHistory[0].time) / 1000);
        getPlaceDetailFromLatLong(firstLocation.locationLat, firstLocation.locationLong).then((place) => {
          setStartLocationDetail(place);
          console.log('Start Location:', place?.formatted_address || place?.address);
        });


        getPlaceDetailFromLatLong(lastLocation.locationLat, lastLocation.locationLong).then((place) => {
          setEndLocationDetail(place);
          console.log('End Location:', place?.formatted_address || place?.address);
        });
        props.updateIsRouting(false)
      }
    } catch (error) {
      Alert.alert(
        i18n.t("alert.attributes.warning"),
        `Lỗi lấy dữ liệu 'locationHistory': ${error.message}`,
        [
          { text: i18n.t("alert.attributes.oke") },
        ]
      );
    }
  }, [locationHistory]);

  const calculateTotalDistance = (points) => {
    let totalDistance = 0;

    for (let i = 0; i < points.length - 1; i++) {
      const from = turf.point([parseFloat(points[i].locationLong), parseFloat(points[i].locationLat)]);
      const to = turf.point([parseFloat(points[i + 1].locationLong), parseFloat(points[i + 1].locationLat)]);
      const distance = turf.distance(from, to, { units: 'kilometers' });
      totalDistance += distance;
    }

    return totalDistance;
  }




  const formatDistance = (distance) => {
    if (distance < 1) {
      return `${(distance * 1000).toFixed(0)} m`;
    } else {
      return `${distance.toFixed(1)} km`;
    }
  };


  const formatTime = (seconds) => {
    const minutes = Math.round(seconds / 60);  // Chuyển đổi từ giây sang phút
    const hours = Math.floor(minutes / 60);  // Lấy số giờ
    const mins = minutes % 60;  // Lấy số phút còn lại
    return `${hours} giờ ${mins} phút`;
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

  const renderDateTime = (insets) => (
    <View style={[
      styles.dateView,
      { paddingTop: insets.top }
    ]}>
      <View style={styles.dateViewHeader}>
        <View style={styles.topBack}>
          <TouchableOpacity onPress={handleBackLocation}>
            <Image source={Images.arrowBack} style={styles.icArrowBack} />
          </TouchableOpacity>
          <Text style={styles.topTextMove}>{i18n.t("account.attributes.moveHistory")}</Text>
        </View>
      </View>
      <View style={[styles.containerDay, locationHistory.length === 0 && styles.containerDayWithBorder]}>
        <ScrollView horizontal={true} style={{}}>
          <View style={styles.dateContainer}>
            {weekDays.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.dateColumn,
                  (selectedIndex === index || date.toDateString() === item.date.toDateString())
                    ? styles.selectedDate
                    : {}
                ]}
                onPress={() => {
                  setSelectedIndex(index);
                  setDate(item.date); // Cập nhật ngày được chọn
                }}
              >
                <Text style={[
                  styles.dayText,
                  (selectedIndex === index || date.toDateString() === item.date.toDateString())
                    ? styles.selectedText
                    : isToday(item.date)
                ]}>
                  {item.name}
                </Text>
                <Text style={[
                  styles.dateText,
                  (selectedIndex === index || date.toDateString() === item.date.toDateString())
                    ? styles.selectedText
                    : isToday(item.date)
                ]}>
                  {String(item.date.getDate()).padStart(2, '0')}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
        {/* <View> */}
        <View style={styles.separator} />
        <DatePicker
          style={[styles.iconDatePicker]}
          date={date}
          confirmBtnText={i18n.t("account.attributes.confirm")}
          cancelBtnText={i18n.t("account.attributes.cancel")}
          // locale="vi"
          mode="date"
          format="YYYY-MM-DD"
          minDate="2000-01-01"
          maxDate="2100-12-31"
          // confirmBtnText="Xác nhận"
          // cancelBtnText="Hủy"
          customStyles={{
            dateInput: {
              height: 0, // Ẩn hoàn toàn dateInput
              borderWidth: 0, // Không viền
            },
            placeholderText: {
              display: 'none', // Ẩn text placeholder nếu cần
            },
          }}
          iconComponent={
            <Image source={Images.calendar} style={styles.calendar} />
          }
          onDateChange={(selectedDate) => {
            const isoDate = new Date(selectedDate);
            setOpen(false);
            setDate(isoDate);
            // Cập nhật chỉ số dựa trên ngày đã chọn
            const index = weekDays.findIndex(item => item.date.toDateString() === isoDate.toDateString());
            setSelectedIndex(index);
            // console.log("____________đã nhấn______________", weekDays)
          }}
        />
        {/* </View> */}
      </View>
    </View>
  )

  const renderMenu = (insets) => {
    return isDataAvailable ? (
      <View style={styles.viewContentIconTop}>
        <View style={styles.underline}>
          <TouchableOpacity style={styles.iconPadding} onPress={zoomIn}>
            <Image source={Images.plus} style={styles.iconRegular} />
          </TouchableOpacity>
        </View>
        <View style={styles.underline}>
          <TouchableOpacity style={styles.iconPadding} onPress={zoomOut}>
            <Image source={Images.minus} style={styles.iconRegular} />
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={handleStyleMap} style={styles.iconPadding}>
          <Image source={Images.box} style={styles.iconRegular} />
        </TouchableOpacity>
      </View>
    ) : null
  }

  const renderHistory = (insets) => {
    return isDataAvailable ? (
      <View style={[
        styles.bottom,
        { paddingBottom: insets.bottom }
      ]}>
        <View style={styles.bottomContainer}>
          <Text style={styles.bottomText}>{formatDate(date)}</Text>
          <View style={styles.bottomDistance}>
            <Text style={styles.textDistance}>{formatDistance(totalDistance)}</Text>
            <Text style={styles.dash}>-</Text>
            <Text style={styles.textDistance}>{formatTime(totalTime)}</Text>
          </View>
        </View>
        {/* ------------------------------------------------------------------------------------ */}

        <ScrollView style={{ flex: 1 }}>
          <View style={[styles.containerRowBottom, { paddingBottom: Platform.OS === 'ios' ? 0 : Metrics.normal }]}>
            <View>
              <View style={styles.rowImagesTop}>
                <Image source={Images.brownCircle} style={styles.iconStyleTop} />
                <Image source={Images.fiveVerticalDots} style={styles.iconStyleBottomDotsTop} />

              </View>

              <View style={styles.rowTextTop}>
                <Text
                  numberOfLines={1}
                  ellipsizeMode='tail'
                  style={styles.textTitle}>
                  {startLocationDetail?.formatted_address}
                </Text>
                <Text
                  numberOfLines={1}
                  ellipsizeMode='tail'
                  style={styles.textContent}>
                  {startLocationDetail?.address}
                </Text>
                <Text style={styles.textContent}>
                  {formatDate(date, false)}</Text>
              </View>

            </View>
            <View>
              <View style={styles.rowImagesBot}>

                <Image source={Images.fiveVerticalDots} style={styles.iconStyleBottomDotsBot} />
                <Image source={Images.brownCircle} style={styles.iconStyleBottom} />

              </View>
              <View style={styles.rowTextBot}>
                <Text
                  numberOfLines={1}
                  ellipsizeMode='tail'
                  style={styles.textTitle}>
                  {endLocationDetail?.formatted_address}

                </Text>
                <Text
                  numberOfLines={1}
                  ellipsizeMode='tail'
                  style={styles.textContent}>
                  {endLocationDetail?.address}
                </Text>
                <Text style={styles.textContent}>
                  {formatDate(date, false)}
                </Text>
              </View>
            </View>
          </View>
        </ScrollView>
        {/* ------------------------------------------------------------------------------------------- */}
      </View>
    ) : (
      <View style={styles.notDataContainer}>
        <View style={styles.notDataBot}>
          <Image style={[styles.imageIcon, { tintColor: Colors.write_bright }]} source={Images.closeMovingHistory} />
          <Text style={styles.textNotData}>{i18n.t("overview.moveHistory.noHistoryShown")}</Text>
        </View>
      </View>
    )
  }

  const renderContentPortrait = (insets) => {
    return (
      <View style={styles.content} pointerEvents="box-none">
        <View style={styles.contentTop}>
          {renderDateTime(insets)}
          {renderMenu(insets)}
        </View>
        {renderHistory(insets)}
      </View>
    )
  }
  const renderContentHorizontal = (insets) => {
    return (
      <View
        style={[
          styles.content, {
            paddingHorizontal: Platform.OS === 'ios' ? insets.left : 0
          }
        ]}
        pointerEvents="box-none">
        <View style={styles.contentLeft}>
          {renderDateTime(insets)}
          {renderHistory(insets)}
        </View>
        <View style={[
          styles.contentRight,
          {
            paddingTop: Platform.OS === 'ios' ? Metrics.small : insets.top,
            paddingHorizontal: Platform.OS === 'ios' ? insets.right : Metrics.small
          }
        ]}>
          {renderMenu(insets)}
        </View>
      </View>
    )
  }


  // -----------------------------------------------------------------------------------------------------
  return (
    // <TouchableWithoutFeedback onPress={() => {
    //   Keyboard.dismiss();

    // }}>
    <SafeAreaInsetsContext.Consumer>
      {(insets) => (
        <View style={styles.container}>

          <Map locationHistory={locationHistory}
            key={renderKey} zoomLevelOut={zoomLevelOut} zoomLevelIn={zoomLevelIn} isInteractive={false}
            isMoveHistory={isMoveHistory}
          />
          {isPortrait ? renderContentPortrait(insets) : renderContentHorizontal(insets)}

          {isStyleMapVisible && renderStyleMap()}

        </View >
      )}
    </SafeAreaInsetsContext.Consumer >
    // </TouchableWithoutFeedback >
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

});

export default connect(mapStateToProps, mapDispatchToProps)(MoveHistory);
