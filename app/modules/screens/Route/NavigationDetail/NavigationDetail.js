import {
    TouchableOpacity,
    Dimensions,
    StyleSheet,
    Text,
    View,
    Image,
    FlatList,
    TextInput,
    ScrollView,
    // Animated,
    Alert,
    Platform,
    PanResponder,
} from "react-native";
import createStyles from './styles';
import { connect } from "react-redux";
import React, { Fragment, useState, useRef, useEffect, useMemo } from "react";
import i18n from "@app/i18n/i18n";
import { Images, Colors as Themes, Metrics } from "@app/theme";
import * as appAction from "@app/storage/action/app";
import constants from "@app/config/constants";
import { getPercent, getTime, addHoursToCurrentTime, formatDistance, getTimeFromValue } from "@app/libs/utils";
import { SafeAreaInsetsContext, SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "@app/modules/components/context/ThemeContext";
import { timeConversion } from "geolib";
// import { useTheme } from "@app/modules/components/context/ThemeContext";
import { useGetPlaceDetailFromLatLong, useGetAutoComplete, useGetPlaceDetail } from "@app/hooks/place_detail.hook";
import { useNavigation } from '@react-navigation/native';
import { haversineDistance } from '@app/libs/utils.js';
import AsyncStorage from '@react-native-community/async-storage';
// import MarqueeText from 'react-native-marquee';
import { useOrientation } from "@app/modules/components/context/OrientationContext";
import createHorizontalStyles from "./horizontalStyles";
import Animated, { FadeOut, SlideInDown, SlideInUp, SlideOutDown, SlideOutUp, useSharedValue, useAnimatedStyle, withTiming } from "react-native-reanimated";

const NavigationDetail = (props) => {
    const [expanded, setExpanded] = useState(true);
    const screenHeight = Dimensions.get('window').height;
    const Colors = Themes[isDarkTheme ? 'darkMode' : 'lightMode'];
    // Lưu thời gian hiện tại
    const [currentTime, setCurrentTime] = useState(new Date());
    const useFetchGetPlaceDetailFromLatLong = useGetPlaceDetailFromLatLong();
    const useFetchGetAutoComplete = useGetAutoComplete();
    const useFetchGetPlaceDetail = useGetPlaceDetail();
    const [currentLocation, setCurrentLocation] = useState([105.79829597455202, 21.013715429594125]);
    const [dimensions, setDimensions] = useState(Dimensions.get("window"));

    const { isDarkTheme } = useTheme();
    const { isPortrait } = useOrientation();
    const styles = isPortrait ?
        createStyles(isDarkTheme, dimensions.width, dimensions.height)
        : createHorizontalStyles(isDarkTheme, dimensions.width, dimensions.height);

    const navigation = useNavigation();


    useEffect(() => {
        const onChange = ({ window }) => setDimensions(window);
        const subscription = Dimensions.addEventListener("change", onChange);

        return () => {
            subscription?.remove();
        };
    }, []);

    // Cập nhật thời gian hiện tại mỗi giây (hoặc mỗi phút tùy yêu cầu)
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTime(new Date());
        }, 6000); // Cập nhật mỗi giây

        // Clear interval khi component unmount
        return () => clearInterval(interval);
    }, []);

    const distance = useMemo(() => {
        let distance = 0;
        if (props.routeResult != null) {
            distance = Math.floor(props.routeResult[0].legs[0].distance.value / 100) * 100
        }
        // console.log("________distanc55e_________-", distance)

        return distance;
    }, [props.routeResult])

    // Cập nhật animation khi expanded thay đổi
    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ translateY: withTiming(!expanded ? 0 : 300, { duration: 500 }) }],
    }));

    const animatedStyleOpen = useAnimatedStyle(() => ({
        transform: [{ translateY: withTiming(expanded ? 0 : 0, { duration: 3000 }) }],
    }));

    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: (evt, gestureState) => false, // Không chặn onPress
            onMoveShouldSetPanResponder: (evt, gestureState) => Math.abs(gestureState.dy) > 5, // Chỉ kích hoạt khi vuốt
            onPanResponderRelease: (evt, gestureState) => {
                if (gestureState.dy < -50) {
                    setExpanded(false); // Vuốt lên -> mở rộng
                } else if (gestureState.dy > 50) {
                    setExpanded(true); // Vuốt xuống -> thu nhỏ
                }
            },
        })
    ).current;;


    const distanceByIndex = (index) => {
        // console.log("_____________ifdex________", index)
        // console.log("_____________test________", props.endLocationIndex)
        let distance = 0;
        if (props.routeResult != null) {
            distance = Math.floor(props.routeResult[0].legs[index].distance.value / 100) * 100
        }
        console.log("________distance_________-", distance)
        return distance;
    };

    const getDuration = useMemo(() => {
        // console.log("========", props.remainingDistance)
        let duration;
        let time = getTime((props.remainingDistance / constants.CONVERT_METER_TO_KILOMETER), constants.AVERAGE_SPEED);
        if ((props.remainingDistance / constants.CONVERT_METER_TO_KILOMETER) < 1) {
            time = getTime((props.remainingDistance / constants.CONVERT_METER_TO_KILOMETER), 15);
        } else if ((props.remainingDistance / constants.CONVERT_METER_TO_KILOMETER) >= 1 && (props.remainingDistance / constants.CONVERT_METER_TO_KILOMETER) < 5) {
            time = getTime((props.remainingDistance / constants.CONVERT_METER_TO_KILOMETER), 18);
        }
        else if ((props.remainingDistance / constants.CONVERT_METER_TO_KILOMETER) >= 5 && (props.remainingDistance / constants.CONVERT_METER_TO_KILOMETER) < 10) {
            time = getTime((props.remainingDistance / constants.CONVERT_METER_TO_KILOMETER), 20);
        }
        else if ((props.remainingDistance / constants.CONVERT_METER_TO_KILOMETER) >= 10 && (props.remainingDistance / constants.CONVERT_METER_TO_KILOMETER) < 20) {
            time = getTime((props.remainingDistance / constants.CONVERT_METER_TO_KILOMETER), 30);
        } else {
            time = getTime((props.remainingDistance / constants.CONVERT_METER_TO_KILOMETER), 40);
        }
        if (props.speed > 30) {
            time = getTime((props.remainingDistance / constants.CONVERT_METER_TO_KILOMETER), props.speed);
        }

        return getTimeFromValue(
            time * 3600,
            i18n.t("route.attributes.day"),
            i18n.t("route.attributes.hour"),
            i18n.t("route.attributes.minute"),
        );
    }, [props.remainingDistance, props.speed, props.routeResult])

    const getDurationFromValue = (value) => {
        let duration;
        let time = getTime((value / constants.CONVERT_METER_TO_KILOMETER), constants.AVERAGE_SPEED);
        if ((value / constants.CONVERT_METER_TO_KILOMETER) < 1) {
            time = getTime((value / constants.CONVERT_METER_TO_KILOMETER), 15);
        } else if ((value / constants.CONVERT_METER_TO_KILOMETER) >= 1 && (value / constants.CONVERT_METER_TO_KILOMETER) < 5) {
            time = getTime((value / constants.CONVERT_METER_TO_KILOMETER), 18);
        }
        else if ((value / constants.CONVERT_METER_TO_KILOMETER) >= 5 && (value / constants.CONVERT_METER_TO_KILOMETER) < 10) {
            time = getTime((value / constants.CONVERT_METER_TO_KILOMETER), 20);
        }
        else if ((value / constants.CONVERT_METER_TO_KILOMETER) >= 10 && (value / constants.CONVERT_METER_TO_KILOMETER) < 20) {
            time = getTime((value / constants.CONVERT_METER_TO_KILOMETER), 30);
        } else {
            time = getTime((value / constants.CONVERT_METER_TO_KILOMETER), 40);
        }

        return getTimeFromValue(
            // (time % 3600) * 3600,
            Math.floor((time * constants.CONVERT_HOUR_TO_SECOND) / constants.CONVERT_HOUR_TO_MINUTE) * constants.CONVERT_HOUR_TO_MINUTE,
            i18n.t("route.attributes.day"),
            i18n.t("route.attributes.hour"),
            i18n.t("route.attributes.minute"),
        );
    }

    const getEndTime = useMemo(() => {
        let duration;
        let time = getTime((props.remainingDistance / constants.CONVERT_METER_TO_KILOMETER), constants.AVERAGE_SPEED);
        if ((props.remainingDistance / constants.CONVERT_METER_TO_KILOMETER) < 1) {
            time = getTime((props.remainingDistance / constants.CONVERT_METER_TO_KILOMETER), 15);
        } else if ((props.remainingDistance / constants.CONVERT_METER_TO_KILOMETER) >= 1 && (props.remainingDistance / constants.CONVERT_METER_TO_KILOMETER) < 5) {
            time = getTime((props.remainingDistance / constants.CONVERT_METER_TO_KILOMETER), 18);
        }
        else if ((props.remainingDistance / constants.CONVERT_METER_TO_KILOMETER) >= 5 && (props.remainingDistance / constants.CONVERT_METER_TO_KILOMETER) < 10) {
            time = getTime((props.remainingDistance / constants.CONVERT_METER_TO_KILOMETER), 20);
        }
        else if ((props.remainingDistance / constants.CONVERT_METER_TO_KILOMETER) >= 10 && (props.remainingDistance / constants.CONVERT_METER_TO_KILOMETER) < 20) {
            time = getTime((props.remainingDistance / constants.CONVERT_METER_TO_KILOMETER), 30);
        } else {
            time = getTime((props.remainingDistance / constants.CONVERT_METER_TO_KILOMETER), 40);
        }
        if (props.speed > 30) {
            time = getTime((props.remainingDistance / constants.CONVERT_METER_TO_KILOMETER), props.speed);
        }
        duration = addHoursToCurrentTime(time)
        return duration;
    }, [props.remainingDistance, props.speed, currentTime, props.routeResult])

    const getEndTimeByIndex = (index) => {
        let value = getTime((props.remainingDistance / constants.CONVERT_METER_TO_KILOMETER), constants.AVERAGE_SPEED);
        if ((props.remainingDistance / constants.CONVERT_METER_TO_KILOMETER) < 1) {
            value = getTime((props.remainingDistance / constants.CONVERT_METER_TO_KILOMETER), 15);
        } else if ((props.remainingDistance / constants.CONVERT_METER_TO_KILOMETER) >= 1 && (props.remainingDistance / constants.CONVERT_METER_TO_KILOMETER) < 5) {
            value = getTime((props.remainingDistance / constants.CONVERT_METER_TO_KILOMETER), 18);
        }
        else if ((props.remainingDistance / constants.CONVERT_METER_TO_KILOMETER) >= 5 && (props.remainingDistance / constants.CONVERT_METER_TO_KILOMETER) < 10) {
            value = getTime((props.remainingDistance / constants.CONVERT_METER_TO_KILOMETER), 20);
        }
        else if ((props.remainingDistance / constants.CONVERT_METER_TO_KILOMETER) >= 10 && (props.remainingDistance / constants.CONVERT_METER_TO_KILOMETER) < 20) {
            value = getTime((props.remainingDistance / constants.CONVERT_METER_TO_KILOMETER), 30);
        } else {
            value = getTime((props.remainingDistance / constants.CONVERT_METER_TO_KILOMETER), 40);
        }
        if (props.speed > 30) {
            value = getTime((props.remainingDistance / constants.CONVERT_METER_TO_KILOMETER), props.speed);
        }
        // value = Math.floor((value * constants.CONVERT_HOUR_TO_SECOND) / constants.CONVERT_HOUR_TO_MINUTE) * constants.CONVERT_HOUR_TO_MINUTE
        // console.log("__________________--value___________", value)

        if (props.routeResult != null) {
            for (let i = index; i > (props.endLocationIndex + 1); i--) {
                // value += props.routeResult[0].legs[i].duration.value
                const duration = props.routeResult[0].legs[i].distance.value;
                let time
                if ((duration / constants.CONVERT_METER_TO_KILOMETER) < 1) {
                    time = getTime((duration / constants.CONVERT_METER_TO_KILOMETER), 15);
                } else if ((duration / constants.CONVERT_METER_TO_KILOMETER) >= 1 && (duration / constants.CONVERT_METER_TO_KILOMETER) < 5) {
                    time = getTime((duration / constants.CONVERT_METER_TO_KILOMETER), 18);
                }
                else if ((duration / constants.CONVERT_METER_TO_KILOMETER) >= 5 && (duration / constants.CONVERT_METER_TO_KILOMETER) < 10) {
                    time = getTime((duration / constants.CONVERT_METER_TO_KILOMETER), 20);
                }
                else if ((duration / constants.CONVERT_METER_TO_KILOMETER) >= 10 && (duration / constants.CONVERT_METER_TO_KILOMETER) < 20) {
                    time = getTime((duration / constants.CONVERT_METER_TO_KILOMETER), 30);
                } else {
                    time = getTime((duration / constants.CONVERT_METER_TO_KILOMETER), 40);
                };
                value += Math.floor(time * constants.CONVERT_HOUR_TO_SECOND / 60) / 60
                // value += time
            }
            // console.log("__________________--value___________", value)

            const duration = addHoursToCurrentTime((value))
            return duration;
        } else {
            return 0;
        }
    }

    // Sử dụng Animated cho component
    // const [height] = useState(new Animated.Value(dimensions.height * 0.2)); // Bắt đầu với 1/5 chiều cao
    const toggleExpand = () => {
        // const newHeight = expanded ? dimensions.height * 0.6 : dimensions.height * 0.3;
        // Animated.timing(height, {
        //     toValue: newHeight,
        //     duration: 300, // Thời gian animation
        //     useNativeDriver: false,
        // }).start();

        setExpanded(!expanded);
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
            // Hiển thị thông báo lỗi
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

    const addLocationTo = async () => {
        const place = await getPlaceDetailFromLatLong(props.myLocation[1], props.myLocation[0]);
        props.updateNavigationFrom(place);
        props.updateShowScreen("addLocation");
        props.updateIsRouting(false);
        props.updateIsLoad(false);
    };

    const openType = async (text) => {
        try {
            const params = {
                location: `${props.myLocation[1]}, ${props.myLocation[0]}`,
                searchText: text,
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
                    searchText: text,
                    isListVisible: true,
                    distance: selectedDistance,
                });
                props.updatePlace(selectedItem);
            }
        } catch (error) {
            // Hiển thị thông báo lỗi
            Alert.alert(
                i18n.t("alert.attributes.warning"),
                error.message || i18n.t("alert.attributes.warning"),
                [
                    { text: i18n.t("alert.attributes.oke") },
                ]
            );
        }
        props.updateIsRouting(false);
        props.updateNavigationFrom(null);
        props.updateNavigationTo(null);
        props.updateNavigationToArray([]);
        props.updateEndLocationIndex(-1);
        props.updateShowScreen("overview");
        props.updateIsLoad(false);
    };

    const getDistance = async (item) => {
        let distance = 0;
        if (props.myLocation) {
            const place = await getPlaceDetail(item);
            const placeLocation = [place.results[0].geometry.location.lng, place.results[0].geometry.location.lat];
            distance = haversineDistance(props.myLocation, placeLocation)
        }
        return distance.toFixed(2);
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
                error.message || i18n.t("alert.attributes.warning"),
                [
                    { text: i18n.t("alert.attributes.oke") },
                ]
            );
        }
        return placeDetail;
    };


    const renderOption = (color, icon, name, type) => {
        return (
            <View style={styles.containerMenu}>
                <TouchableOpacity
                    style={[
                        styles.iconWrapper,
                        { backgroundColor: color },
                    ]}
                    onPress={() => { type == "add" ? addLocationTo() : openType(type) }}
                >
                    <Image
                        style={styles.imgContainerMenu}
                        source={icon}
                        resizeMode="contain"
                    />
                </TouchableOpacity>
                <Text style={styles.txtContainerMenu}>
                    {name}
                </Text>
            </View>
        )
    }

    const renderRoute = (time, distance, percent, index, item) => {
        // console.log(`_______________index${index}_________`, (index == (props.endLocationIndex + 1) && props.navigationToArray.length > 0))
        return (
            <View style={styles.routing} key={index}>
                {index != -1 && (
                    <View style={styles.addressLocation}>
                        <View style={styles.locationToContainer}>
                            {index <= props.endLocationIndex ? (
                                <Image
                                    style={styles.imgContainerMenu}
                                    source={Images.healthy}
                                    resizeMode="contain"
                                />
                            ) : (
                                <Text style={styles.textNumber}>{index + 1}</Text>
                            )}

                        </View>
                        <View style={styles.addressLocationText}>
                            <Text style={styles.addressLocationTitle}>{item.structured_formatting ? item.structured_formatting.main_text : (item.address_components ? item.address_components[0].short_name : i18n.t("route.attributes.yourLocation"))}</Text>
                            <Text style={styles.addressText}>{item.structured_formatting.secondary_text}</Text>
                        </View>
                    </View>
                )}
                {(index == -1 || index > props.endLocationIndex) && (
                    <>
                        <View style={styles.time}>
                            <Text style={styles.timeText}>{time}</Text>
                        </View>
                        <View style={styles.distance}>
                            <View style={styles.distanceValue}>
                                <Image source={Images.distance} style={styles.distanceIcon} />
                                <Text style={styles.distanceText}>{distance}</Text>
                            </View>
                            <View style={styles.distanceLine}></View>
                            <View style={styles.distanceValue}>
                                <Image source={Images.clock} style={styles.distanceIcon} />
                                {index == -1 && (
                                    <Text style={styles.distanceText}>{props.remainingDistance > 0 ? getEndTime : "--:--"}</Text>
                                )}
                                {index != -1 && (
                                    <Text style={styles.distanceText}>{(index == (props.endLocationIndex + 1)) ? getEndTime : getEndTimeByIndex(index)}</Text>
                                )}
                            </View>
                        </View>
                        <View style={styles.road}>
                            <View style={styles.progressContainer}>
                                <View style={styles.progressBar}>
                                    <View style={[styles.progress, { width: `${Math.abs(percent)}%` }]} />
                                </View>
                                <Image source={Images.percent} style={[styles.image, { left: `${Math.abs(percent)}%` }]} />

                            </View>
                        </View>
                    </>
                )}
                {index != -1 && index <= props.endLocationIndex && (
                    <View style={styles.completedTextView}>
                        <Text style={styles.completedText}>{i18n.t("route.attributes.completedText")}</Text>
                    </View>
                )}
                {index == -1 && (
                    <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}>
                        <View style={styles.options}>
                            {renderOption(Colors.complete, Images.addLocation, i18n.t("route.attributes.addDestination"), "add")}
                            {renderOption(Colors.yellow_bland, Images.eat, i18n.t("overview.attributes.eatDrink"), "nhà hàng")}
                            {renderOption(Colors.blue_shadow_light, Images.gas, i18n.t("overview.attributes.gasStation"), "xăng")}
                            {renderOption(Colors.purple_light, Images.parking, i18n.t("route.attributes.parking"), "bãi đỗ xe")}
                        </View>
                    </ScrollView>

                )}
            </View>
        )
    }

    const renderTime = () => {
        return (
            <View>
                <View style={styles.timeTitle}>
                    <Text style={styles.timeTextTitle}>{getDuration}</Text>
                </View>
                <View style={styles.distanceTitle}>
                    <View style={styles.distanceValue}>
                        <Text style={styles.distanceText}>{formatDistance(Math.floor(props.remainingDistance / 100) * 100)}</Text>
                    </View>
                    <Text style={styles.space}>-</Text>
                    <View style={styles.distanceValue}>
                        <Text style={styles.distanceText}>{props.remainingDistance > 0 ? getEndTime : "--:--"}</Text>
                    </View>
                </View>
            </View>
        )
    }

    return (
        <SafeAreaInsetsContext.Consumer>
            {(insets) => (
                <View style={[
                    styles.container,
                    { left: !isPortrait ? (Platform.OS === 'ios' ? insets.left : Metrics.normal) : 0 }
                ]}>
                    {/* <Animated.View style={[styles.routeStepsContainer, { height }]}> */}
                    {expanded && (
                        <View style={styles.location}>
                            {/* <MarqueeText
                                style={styles.locationText}
                                duration={4000}
                                speed={0.5}
                                loop={true}
                                // marqueeOnStart
                                isRTL={false}
                            >
                                {props.navigationTo != null && (props.navigationTo.structured_formatting ? props.navigationTo.structured_formatting.main_text : props.navigationTo.address_components[0].short_name)}
                                {props.navigationToArray.length > 0 && props.endLocationIndex <= (props.navigationToArray.length - 2) && props.navigationToArray[(props.endLocationIndex + 1)].structured_formatting.main_text}
                            </MarqueeText> */}
                            {/* <MarqueeTextElement width={Metrics.large * 4}>
                                {props.navigationTo != null && (props.navigationTo.structured_formatting ? props.navigationTo.structured_formatting.main_text : props.navigationTo.address_components[0].short_name)}
                                {props.navigationToArray.length > 0 && props.endLocationIndex <= (props.navigationToArray.length - 2) && props.navigationToArray[(props.endLocationIndex + 1)].structured_formatting.main_text}
                            </MarqueeTextElement> */}
                            <Text style={styles.locationText} numberOfLines={1} ellipsizeMode="tail">
                                {props.navigationTo != null && (props.navigationTo.structured_formatting ? props.navigationTo.structured_formatting.main_text : props.navigationTo.address_components[0].short_name)}
                                {props.navigationToArray.length > 0 && props.endLocationIndex <= (props.navigationToArray.length - 2) && props.navigationToArray[(props.endLocationIndex + 1)].structured_formatting.main_text}
                            </Text>
                        </View>
                    )}

                    {/* <View style={[styles.routeStepsContent]}> */}
                    {expanded ? (
                        <Animated.View
                            {...panResponder.panHandlers}
                            style={[
                                styles.routeStepsTittle, animatedStyleOpen,
                                {
                                    paddingBottom: !isPortrait ? (Platform.OS === "ios" ? insets.bottom / 2 : 0) : 0,
                                },
                            ]}
                        // pointerEvents="box-none"
                        >
                            <TouchableOpacity
                                style={styles.close}
                                onPress={props.closeNavigation}
                                onStartShouldSetResponder={() => true}
                                onMoveShouldSetResponder={() => true}
                            >
                                <Image source={Images.blackClose} style={styles.icon} />
                                <Text style={styles.text}>{i18n.t("route.attributes.end")}</Text>
                            </TouchableOpacity>
                            <View style={styles.line}></View>
                            <View style={styles.title}>
                                {!expanded ? (
                                    <Text style={styles.titleText} numberOfLines={4} ellipsizeMode="tail">
                                        {props.navigationTo != null &&
                                            (props.navigationTo.structured_formatting
                                                ? props.navigationTo.structured_formatting.main_text
                                                : props.navigationTo.address_components[0].short_name)}
                                        {props.navigationToArray.length > 0 &&
                                            props.endLocationIndex <= props.navigationToArray.length - 2 &&
                                            props.navigationToArray[props.endLocationIndex + 1]?.structured_formatting?.main_text}
                                    </Text>
                                ) : (
                                    renderTime()
                                )}
                            </View>
                            <View style={styles.line}></View>
                            <TouchableOpacity
                                style={styles.compact}
                                onPress={toggleExpand}
                                onStartShouldSetResponder={() => true}
                                onMoveShouldSetResponder={() => true}
                            >
                                <Image source={expanded ? Images.upArrow : Images.downArrow} style={styles.icon} />
                                <Text style={styles.text}>{expanded ? i18n.t("route.attributes.add") : i18n.t("route.attributes.minimize")}</Text>
                            </TouchableOpacity>
                        </Animated.View>
                    ) : (
                        <Animated.View
                            style={[animatedStyle]}
                            entering={SlideInDown.duration(300)
                                .springify()
                                .damping(20)
                            }
                            exiting={SlideOutDown.duration(300)
                                .springify()
                                .damping(20)
                            }
                        // pointerEvents="box-none"
                        >
                            <Animated.View
                                style={styles.routeStepsTittle}
                                {...panResponder.panHandlers}
                            // pointerEvents="box-none"
                            >
                                <TouchableOpacity
                                    style={styles.close}
                                    onPress={props.closeNavigation}
                                    onStartShouldSetResponder={() => true}
                                    onMoveShouldSetResponder={() => true}
                                >
                                    <Image source={Images.blackClose} style={styles.icon} />
                                    <Text style={styles.text}>{i18n.t("route.attributes.end")}</Text>
                                </TouchableOpacity>
                                <View style={styles.line}></View>
                                <View style={styles.title} >
                                    {!expanded ? (
                                        <Text style={styles.titleText} numberOfLines={4} ellipsizeMode="tail">
                                            {props.navigationTo != null && (props.navigationTo.structured_formatting ? props.navigationTo.structured_formatting.main_text : props.navigationTo.address_components[0].short_name)}
                                            {props.navigationToArray.length > 0 && props.endLocationIndex <= (props.navigationToArray.length - 2) && props.navigationToArray[(props.endLocationIndex + 1)]?.structured_formatting?.main_text}
                                        </Text>
                                    ) :
                                        renderTime()
                                    }
                                </View>
                                <View style={styles.line}></View>
                                <TouchableOpacity
                                    style={styles.compact}
                                    onPress={toggleExpand}
                                    onStartShouldSetResponder={() => true}
                                    onMoveShouldSetResponder={() => true}
                                >
                                    <Image source={expanded ? Images.upArrow : Images.downArrow} style={[styles.icon, styles.compactIcon]} />
                                    <Text style={styles.text}>{expanded ? i18n.t("route.attributes.add") : i18n.t("route.attributes.minimize")}</Text>
                                </TouchableOpacity>
                            </Animated.View>
                            <View style={styles.body}>

                                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1 }}>
                                    {props.navigationTo != null && renderRoute(
                                        `${props.remainingDistance > 0 ? getDuration : "--"}`,
                                        `${props.remainingDistance > 0 ? formatDistance(Math.floor(props.remainingDistance / 100) * 100) : "--"}`,
                                        `${props.remainingDistance > 0 ? getPercent(Math.abs(distance - props.remainingDistance), distance) : 0}`,
                                        -1, null)}
                                    {props.navigationToArray.length > 0 ? props.navigationToArray.map((item, index) => {
                                        return (
                                            renderRoute(
                                                `${index == (props.endLocationIndex + 1) ? getDuration : getDurationFromValue(distanceByIndex(index))}`,
                                                `${index == (props.endLocationIndex + 1) ? formatDistance(Math.floor(props.remainingDistance / 100) * 100) : formatDistance(distanceByIndex(index))}`,
                                                `${index == (props.endLocationIndex + 1) ? getPercent((distanceByIndex(index) - props.remainingDistance), distanceByIndex(index)) : 0}`,
                                                index,
                                                item,
                                                props.remainingDistance
                                            )
                                        )
                                    }) : null}
                                </ScrollView>
                                <View style={[styles.buttonContainer, { paddingBottom: (insets.bottom + Metrics.small) }]}>
                                    <TouchableOpacity style={[styles.button, styles.redButton]} onPress={props.closeNavigation}>
                                        <Text style={styles.textButton}>{i18n.t("route.attributes.stop")}</Text>
                                    </TouchableOpacity>
                                    <View style={styles.spacerWidth}></View>
                                    <TouchableOpacity style={[styles.button, styles.blueButton]} onPress={toggleExpand}>
                                        <Text style={styles.textButton}>{i18n.t("route.attributes.continue")}</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </Animated.View>
                    )}
                    {/* </View> */}
                    {/* </Animated.View> */}
                </View>
            )
            }
        </SafeAreaInsetsContext.Consumer >
    )
}

function mapStateToProps(state) {
    return {
        myLocation: state.app.myLocation,
        navigationFrom: state.app.navigationFrom,
        navigationTo: state.app.navigationTo,
        routeResult: state.app.routeResult,
        remainingDistance: state.app.remainingDistance,
        speed: state.app.speed,
        navigationToArray: state.app.navigationToArray,
        endLocationIndex: state.app.endLocationIndex,
    };
}
const mapDispatchToProps = (dispatch) => ({
    updateShowScreen: (show) => dispatch(appAction.showScreen(show)),
    updateIsRouting: (isRouting) => dispatch(appAction.isRouting(isRouting)),
    updateNavigationFrom: (from) => dispatch(appAction.navigationFrom(from)),
    updateIsRouting: (isRouting) => dispatch(appAction.isRouting(isRouting)),
    updateMapView: (mapView) => dispatch(appAction.mapView(mapView)),
    updatePlace: (place) => dispatch(appAction.place(place)),
    updateNavigationTo: (to) => dispatch(appAction.navigationTo(to)),
    updateNavigationToArray: (navigationToArray) => dispatch(appAction.navigationToArray(navigationToArray)),
    updateEndLocationIndex: (endLocationIndex) => dispatch(appAction.endLocationIndex(endLocationIndex)),
    updateRemainingDistance: (remainingDistance) => dispatch(appAction.remainingDistance(remainingDistance)),
    updateStepIndex: (stepIndex) => dispatch(appAction.stepIndex(stepIndex)),
    updateIsLoad: (isLoad) => dispatch(appAction.isLoad(isLoad)),
});
export default connect(mapStateToProps, mapDispatchToProps)(NavigationDetail);