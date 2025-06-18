import LocationSelection from "./LocationSelection/LocationSelection";
import NavigationSearchInput from "./NavigationSearchInput/NavigationSearchInput";
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
    StatusBar,
    Alert,
    Platform,
    ActivityIndicator,
} from "react-native";
import { connect } from "react-redux";
import React, { Fragment, useState, useRef, useEffect, useMemo, useCallback, useContext } from "react";
import i18n from "@app/i18n/i18n";
import { Colors as Themes, Helpers, Images, Metrics } from "@app/theme";
import * as appAction from "@app/storage/action/app";
import { SafeAreaInsetsContext, SafeAreaView } from "react-native-safe-area-context";
import Map from "../Map/Map";
import RouteSelection from "./RouteSelection/RouteSelection";
import RouteSteps from "./RouteSteps/RouteSteps";
import { useRoute, useNavigation } from '@react-navigation/native';
import { useGetPlaceDetailFromLatLong } from "@app/hooks/place_detail.hook";
import { useTheme } from "@app/modules/components/context/ThemeContext";
import createStyles from "./styles";
import NavigationStep from "@app/modules/screens/Route/NavigationStep/NavigationStep"
import NavigationSpeed from "@app/modules/screens/Route/NavigationSpeed/NavigationSpeed"
import NavigationDetail from "@app/modules/screens/Route/NavigationDetail/NavigationDetail"
import EndLocation from "@app/modules/screens/Route/EndLocation/EndLocation"
import AddLocation from "@app/modules/screens/Route/AddLocation/AddLocation"
import Radio from "@app/modules/screens/Radio/Radio";
import { RadioContext } from "@app/modules/screens/Radio/RadioProvider";
import { useOrientation } from "@app/modules/components/context/OrientationContext";
import createHorizontalStyles from "./horizontalStyles";
import AlertError from "@app/modules/components/alert/AlertError/AlertError";
import AlertTrueFalse from "@app/modules/components/alert/AlertTrueFalse/AlertTrueFalse";

const Route = (props) => {

    const route = useRoute();
    const useFetchGetPlaceDetailFromLatLong = useGetPlaceDetailFromLatLong();

    const [textInputFrom, setTextInputFrom] = useState(null);
    const [textInputTo, setTextInputTo] = useState(null);
    const [indexLocationTo, setIndexLocationTo] = useState(null);
    const [isRadioVisible, setRadioVisible] = useState(false);
    const [visibleAlertTrueFalse, setVisibleAlertTrueFalse] = useState(false);

    const { isPlaying, nameChannel } = useContext(RadioContext);
    const [isMyLocation, setIsMyLocation] = useState(true);
    const [dimensions, setDimensions] = useState(Dimensions.get("window"));
    const [visibleAlert, setVisibleAlert] = useState(false);
    const [isRouteNavigation, setIsRouteNavigation] = useState(false);
    const [isLoadData, setIsLoadData] = useState(false);

    const { isDarkTheme } = useTheme();
    const Colors = Themes[isDarkTheme ? 'darkMode' : 'lightMode'];
    const { isPortrait } = useOrientation();
    const styles = isPortrait ?
        createStyles(isDarkTheme, dimensions.width, dimensions.height)
        : createHorizontalStyles(isDarkTheme, dimensions.width, dimensions.height);

    const param = route.params;

    useEffect(() => {
        props.updateIsLoad(false);
        const onChange = ({ window }) => setDimensions(window);
        const subscription = Dimensions.addEventListener("change", onChange);
        setIsLoadData(props.isLoad);
        return () => {
            subscription?.remove();
        };
    }, []);

    useEffect(() => {
        // console.log("_____________isLoad_6666________", props.isLoad)
        setIsLoadData(props.isLoad);
    }, [props.isLoad]);

    useEffect(async () => {
        if (param) {
            if (param.type === "route") {
                if (props.myLocation !== null) {
                    try {
                        const place = await getPlaceDetailFromLatLong(props.myLocation[1], props.myLocation[0]);
                        place.myLocation = true
                        props.updateNavigationFrom(place);
                        setTextInputFrom(`${i18n.t("route.attributes.yourLocation")}`)
                        if (param.start === "start") {
                            props.updateShowScreen("routeSteps");
                            props.updateIsRouting(true);
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

                }
            }
        }
        props.updateIsReturn(true);
    }, [])

    useEffect(async () => {
        if (param) {
            if (param.from == "chooseLocation") {
                setTextInputFrom(null);
                setTextInputTo(null);
            }
        }
    }, [param])

    useEffect(async () => {
        if (props.isRouting) {
            setIsRouteNavigation(true)
        } else {
            setIsRouteNavigation(false)
        }
    }, [props.isRouting])

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

    const handleTextInputFrom = (value) => {
        setTextInputFrom(value);
    }

    const handleTextInputTo = (value) => {
        setTextInputTo(value);
    }

    const handleIndexLocationTo = (value) => {
        setIndexLocationTo(value);
    }

    const handleShowRadio = () => {
        setRadioVisible(true);
    };
    const handleCloseRadio = useCallback(() => {
        setRadioVisible(false);
    }, []);

    const moveToMarker = () => {
        if (props.myLocation != null) {
            if (!props.isRouting) {
                setIsMyLocation(!isMyLocation)
            }
            props.updateIsReturn(true);
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

    const closeAlertTrueFalse = () => {
        setVisibleAlertTrueFalse(false);
    };

    const closeNavigation = () => {
        setVisibleAlertTrueFalse(true);
    };

    const handleAcceptClose = async () => {
        const place = await getPlaceDetailFromLatLong(props.myLocation[1], props.myLocation[0]);
        place.myLocation = true;
        props.updateNavigationFrom(place);
        props.updateShowScreen(null);
        props.updateMapView({})
        props.updateIsRouting(false)
        props.updateRemainingDistance(0)
        props.updateStepIndex(0)
        props.updateIsLoad(false)
        closeAlertTrueFalse();
    }

    const renderAlertTrueFalse = () => {
        return (
            <AlertTrueFalse
                title={i18n.t("alert.attributes.closeNavigationTitle")}
                body={i18n.t("alert.attributes.closeNavigationBody")}
                handleClose={closeAlertTrueFalse}
                handleAccept={handleAcceptClose}
            />
        )
    }

    const renderAlert = () => {
        return (
            <AlertError title={i18n.t("alert.attributes.noMyLocation")}
                body={i18n.t("alert.attributes.setMyLocation")}
                handleClose={closeAlert}
            />
        )
    }

    const renderBtnRadio = () => (
        <TouchableOpacity
            onPress={handleShowRadio}
            style={[styles.viewIconRadio]}
        >
            <Image
                style={[styles.iconStyle, isPlaying ? styles.iconRadio : {}]}
                source={isPlaying ? Images[nameChannel] : Images.music}
                resizeMode="contain"
            />
        </TouchableOpacity>
    )

    const renderRadio = () => {
        return (
            <Radio
                handleCloseRadio={handleCloseRadio}
            />
        );
    };

    const renderBtnMyLocation = () => {
        return (
            <TouchableOpacity onPress={moveToMarker} style={{ marginTop: Metrics.small }}>
                <View style={styles.viewIconRadio}>
                    <Image
                        style={[
                            styles.iconStyle,
                            { tintColor: !props.isReturn ? Colors.gray : null }
                        ]}
                        source={Images.location}
                    />
                </View>
            </TouchableOpacity>
        )
    }

    const renderNavigationSpeed = () => {
        return props.isRouting ? (
            <NavigationSpeed />
        ) : null;
    };
    // const renderNavigationSpeed = () => (
    //     <NavigationSpeed />
    // )

    const renderContentTopPortrait = (insets) => {
        return (
            <SafeAreaView style={[styles.contentTop]}>
                {!props.isRouting && props.showScreen != "addLocation" ? (
                    <NavigationSearchInput textInputFrom={textInputFrom} textInputTo={textInputTo} handleTextInputFrom={handleTextInputFrom} handleTextInputTo={handleTextInputTo} />
                ) : null}

                {!props.isRouting && props.showScreen === "addLocation" ? (
                    <AddLocation handleIndexLocationTo={handleIndexLocationTo} textInputFrom={textInputFrom} />
                ) : null}

                {props.isLoad == true && props.isRouting && !props.isEndPoint ? (
                    <NavigationStep />
                ) : null}


                <View style={[styles.viewBtnAction]}>
                    {renderNavigationSpeed()}
                    <View style={styles.btnActionRight}>
                        {renderBtnRadio()}
                        {renderBtnMyLocation()}
                    </View>
                </View>

            </SafeAreaView>
        )
    }
    const renderContentTopHorizontal = (insets) => {
        return (
            <SafeAreaView style={[
                styles.contentTop,
                {
                    paddingHorizontal: (Platform.OS === 'ios') ? insets.top : Metrics.normal,
                    flexDirection: (props.isRouting && !props.isEndPoint) ? 'column' : 'row',
                    justifyContent: 'space-between'
                }
            ]}>
                {!props.isRouting && props.showScreen != "addLocation" ? (
                    <NavigationSearchInput textInputFrom={textInputFrom} textInputTo={textInputTo} handleTextInputFrom={handleTextInputFrom} handleTextInputTo={handleTextInputTo} />
                ) : null}

                {!props.isRouting && props.showScreen === "addLocation" ? (
                    <AddLocation handleIndexLocationTo={handleIndexLocationTo} textInputFrom={textInputFrom} />
                ) : null}

                {props.isLoad == true && props.isRouting && !props.isEndPoint ? (
                    <NavigationStep />
                ) : null}


                <View style={[styles.viewBtnAction, { marginTop: (Platform.OS === 'ios') ? Metrics.small : Metrics.tiny }]}>
                    {renderNavigationSpeed()}
                    <View style={styles.btnActionRight}>
                        {renderBtnRadio()}
                        {renderBtnMyLocation()}
                    </View>
                </View>

            </SafeAreaView>
        )
    }

    return (
        <SafeAreaInsetsContext.Consumer>
            {(insets) => (
                <>
                    <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />
                    {/* <SafeAreaView style={{ flex: 1 }} edges={['left', 'right']}> */}
                    <View style={styles.container}>
                        <Map
                            isInteractive={false}
                            isMyLocation={isMyLocation}
                            isRouteNavigation={true}
                        />

                        {isPortrait ? renderContentTopPortrait(insets) : renderContentTopHorizontal(insets)}

                        {props.showScreen === "locationSelection" ? (
                            <LocationSelection handleTextInputFrom={handleTextInputFrom} handleTextInputTo={handleTextInputTo} indexLocationTo={indexLocationTo} />
                        ) : null}
                        {props.routeResult && props.showScreen !== "routeSteps" && props.showScreen !== "locationSelection" && props.showScreen != "addLocation" && (
                            <RouteSelection textInputFrom={textInputFrom} />
                        )}
                        {!props.isRouting && props.showScreen === "routeSteps" && (
                            <RouteSteps />
                        )}
                        {props.isLoad == true && props.isRouting && !props.isEndPoint ? (
                            <NavigationDetail closeNavigation={closeNavigation} />
                        ) : null}
                        {props.isEndPoint ? (
                            <EndLocation />
                        ) : null}
                        {isRadioVisible && renderRadio()}
                    </View>
                    {/* </SafeAreaView> */}
                    {visibleAlert && renderAlert()}
                    {visibleAlertTrueFalse && renderAlertTrueFalse()}
                </>
            )}
        </SafeAreaInsetsContext.Consumer >
    )
}

function mapStateToProps(state) {
    return {
        showScreen: state.app.showScreen,
        typeRouteInput: state.app.typeRouteInput,
        navigationFrom: state.app.navigationFrom,
        navigationTo: state.app.navigationTo,
        vehicle: state.app.vehicle,
        routeResult: state.app.routeResult,
        myLocation: state.app.myLocation,
        isRouting: state.app.isRouting,
        isEndPoint: state.app.isEndPoint,
        isReturn: state.app.isReturn,
        isLoad: state.app.isLoad,
    };
}
const mapDispatchToProps = (dispatch) => ({
    updateShowScreen: (show) => dispatch(appAction.showScreen(show)),
    updateTypeRouteInput: (type) => dispatch(appAction.typeRouteInput(type)),
    updateNavigationFrom: (from) => dispatch(appAction.navigationFrom(from)),
    updateNavigationTo: (to) => dispatch(appAction.navigationTo(to)),
    updateVehicle: (vehicle) => dispatch(appAction.vehicle(vehicle)),
    updateRouteResult: (routeResult) => dispatch(appAction.routeResult(routeResult)),
    updateRoute: (route) => dispatch(appAction.route(route)),
    updateIsRouting: (isRouting) => dispatch(appAction.isRouting(isRouting)),
    updateMapView: (mapView) => dispatch(appAction.mapView(mapView)),
    updateIsReturn: (isReturn) => dispatch(appAction.isReturn(isReturn)),
    updateRemainingDistance: (remainingDistance) => dispatch(appAction.remainingDistance(remainingDistance)),
    updateStepIndex: (stepIndex) => dispatch(appAction.stepIndex(stepIndex)),
    updateIsLoad: (isLoad) => dispatch(appAction.isLoad(isLoad)),
});
export default connect(mapStateToProps, mapDispatchToProps)(Route);