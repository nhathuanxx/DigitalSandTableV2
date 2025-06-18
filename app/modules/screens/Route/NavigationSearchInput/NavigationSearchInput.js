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
    Platform,
    BackHandler,
} from "react-native";
import { connect } from "react-redux";
import React, { Fragment, useState, useRef, useEffect, useCallback } from "react";
import i18n from "@app/i18n/i18n";
import { Images, Metrics } from "@app/theme";
import * as appAction from "@app/storage/action/app";
import { useNavigation } from '@react-navigation/native';
import { SafeAreaInsetsContext, SafeAreaView } from "react-native-safe-area-context";
import _ from 'lodash';
import { debounce } from 'lodash';
import { useTheme } from "@app/modules/components/context/ThemeContext";
import createStyles from "./styles";
import { useOrientation } from "@app/modules/components/context/OrientationContext";
import createHorizontalStyles from "./horizontalStyles";

const NavigationSearchInput = (props) => {

    const vehicles = ['car', 'bike', 'taxi'];
    const navigation = useNavigation();
    const [textFrom, setTextFrom] = useState(null);
    const [textTo, setTextTo] = useState(null);
    const [isButtonDisabled, setButtonDisabled] = useState(false);
    const [dimensions, setDimensions] = useState(Dimensions.get("window"));

    const { isDarkTheme } = useTheme();
    const { isPortrait } = useOrientation();
    const styles = isPortrait ?
        createStyles(isDarkTheme, dimensions.width, dimensions.height)
        : createHorizontalStyles(isDarkTheme, dimensions.width, dimensions.height);


    useEffect(() => {
        const handleBackPress = () => {
            if (navigation.canGoBack()) {
                navigation.goBack(); // Quay về màn hình trước nếu có
            } else {
                // Nếu không có màn hình trước, có thể hiển thị Alert hoặc thoát ứng dụng
                Alert.alert("Thông báo", "Bạn có muốn thoát ứng dụng?", [
                    { text: "Hủy", style: "cancel" },
                    { text: "Thoát", onPress: () => BackHandler.exitApp() }
                ]);
            }

            // Cập nhật state khác nếu cần
            props.updateShowScreen("overview");
            props.updateNavigationFrom(null);
            props.updateNavigationTo(null);
            props.updateMapView({});
            props.updateNavigationToArray([]);

            return true; // Chặn hành động back mặc định của Android
        };

        BackHandler.addEventListener('hardwareBackPress', handleBackPress);

        return () => BackHandler.removeEventListener('hardwareBackPress', handleBackPress);
    }, []);

    useEffect(() => {
        const onChange = ({ window }) => setDimensions(window);
        const subscription = Dimensions.addEventListener("change", onChange);

        return () => {
            subscription?.remove();
        };
    }, []);


    useEffect(() => {
        if (props.navigationFrom != null) {
            if (props.navigationFrom.myLocation) {
                setTextFrom(i18n.t("route.attributes.yourLocation"))
            } else {
                setTextFrom(
                    props.navigationFrom.structured_formatting ?
                        props.navigationFrom.structured_formatting.main_text :
                        props.navigationFrom.address_components[0].short_name
                )
            }
        }
    }, [props.navigationFrom])

    useEffect(() => {
        if (props.navigationTo != null) {
            setButtonDisabled(true);
            if (props.navigationTo.myLocation) {
                setTextTo(i18n.t("route.attributes.yourLocation"))
            } else {
                setTextTo(props.navigationTo.structured_formatting ? props.navigationTo.structured_formatting.main_text : props.navigationTo.address_components[0].short_name)
            }
            setTimeout(() => {
                setButtonDisabled(false);
            }, 3000);
        }
    }, [props.navigationTo])


    // useEffect(() => {
    //     if (props.textInputFrom != null) {
    //         setTextFrom(props.textInputFrom)
    //     } else {
    //         setTextFrom(null)
    //     }
    // }, [props.textInputFrom])

    // useEffect(() => {
    //     if (props.textInputTo != null) {
    //         setTextTo(props.textInputTo)
    //     } else {
    //         setTextTo(null)
    //     }
    // }, [props.textInputTo])

    const swapRoute = () => {
        if (props.navigationFrom && props.navigationTo) {
            const from = props.navigationFrom
            const to = props.navigationTo
            props.updateNavigationFrom(to)
            props.updateNavigationTo(from)
            if (textFrom != null || textTo != null) {
                props.handleTextInputTo(textFrom);
                props.handleTextInputFrom(textTo);
            }
            props.updateRoute(null)
            props.updateShowScreen(null);
            props.updateIsEndPoint(false);
            props.updateStepIndex(0);
            props.updateEndLocationIndex(-1);
            props.updateIsLoad(false);
        }
    }

    const handlePress = () => {
        if (isButtonDisabled) return;

        setButtonDisabled(true);
        swapRoute();

        setTimeout(() => {
            setButtonDisabled(false);
        }, 3000);
    };


    const handleCloseRoute = () => {
        // props.navigation.navigate('Overview')
        // navigation.navigate('Overview', { setView: new Date().getTime() });
        navigation.goBack()
        props.updateShowScreen("overview");
        props.updateNavigationFrom(null);
        props.updateNavigationTo(null);
        props.updateMapView({});
        props.updateNavigationToArray([])
    };


    const handleTypeInput = (type) => {
        props.updateTypeRouteInput(type);
        props.updateShowScreen("locationSelection");
    };

    const setVehicleSelected = (vehicle) => {
        props.updateVehicle(vehicle)
        props.updateRoute(null);
    }

    const getVehicleIcon = (selected, vehicleType) => {
        if (selected) {
            const vehicleText = `selected${_.capitalize(vehicleType)}`
            return Images[vehicleText]
        } else {
            const vehicleText = `unSelected${_.capitalize(vehicleType)}`
            return Images[vehicleText]
        }
    }

    const addLocation = () => {
        props.updateShowScreen("addLocation")
    }

    const renderIconCenter = () => {
        return (
            <View style={styles.iconFunction}>
                {(props.navigationTo != null && props.navigationFrom != null) || props.navigationToArray.length > 0 ? (
                    <TouchableOpacity style={styles.iconCenter} onPress={addLocation}>
                        <Image
                            source={Images.addNavigation}
                            style={styles.addSwapVoidImg}
                        />
                    </TouchableOpacity>
                ) : null}
                {props.navigationToArray.length <= 0 ? (
                    <TouchableOpacity style={styles.iconCenter} disabled={isButtonDisabled} onPress={handlePress}>
                        <Image
                            source={Images.swapNavigation}
                            style={styles.addSwapVoidImg}
                        />
                    </TouchableOpacity>
                ) : null}
                {/* <View style={styles.iconCenter}>
                    <Image
                        source={Images.voidNavigation}
                        style={styles.addSwapVoidImg}
                    />
                </View> */}
            </View>
        )
    }

    const renderInputText = (img, placeholder, styleText) => {
        return (
            <View style={styles.inputLocationItem}>
                <View style={styles.navigationImg}>
                    <Image
                        source={img}
                        style={styles.fromToImg}
                    />
                </View>
                <View style={styles.inputText} >
                    <Text style={styleText} numberOfLines={1} ellipsizeMode="tail">
                        {placeholder}
                    </Text>
                </View>
            </View>
        )
    }

    const renderVehicleIcon = (img, text) => {
        return (
            <View style={styles.vehicle}>
                <Image
                    source={img}
                    style={styles.vehicleIcon}
                    resizeMode="contain"
                />
                <Text style={styles.vehicleText}>{text}</Text>
            </View>
        )
    }

    const renderVehicleIconUnSelected = (img, text) => {
        return (
            <View style={styles.vehicleUnSelected}>
                <Image
                    source={img}
                    style={styles.vehicleIcon}
                    resizeMode="contain"
                />
                <Text style={styles.vehicleTextUnSelect}>{text}</Text>
            </View>
        )
    }

    const renderFromTo = () => {
        return (
            <View style={styles.inputLocation}>
                <TouchableOpacity onPress={() => { handleTypeInput("from") }}>
                    {
                        props.navigationFrom == null ?
                            renderInputText(Images.fromNavigation, i18n.t("route.attributes.enterTheStartingPoint"), styles.textGrey) :
                            renderInputText(Images.fromNavigation, textFrom,
                                styles.locationSelectionText)
                    }
                </TouchableOpacity>
                <View style={styles.inputLocationItem}>
                    <View style={styles.navigationImg}>
                        <Image
                            source={Images.centerNavigation}
                            style={styles.centerImg}
                        />
                    </View>
                    <View style={styles.centerInputText}>
                        <View style={styles.line} />
                    </View>
                </View>
                <TouchableOpacity onPress={() => { handleTypeInput("to") }}>
                    {
                        props.navigationTo == null ?
                            renderInputText(Images.toNavigation, i18n.t("route.attributes.enterTheDestination"), styles.textGrey) :
                            renderInputText(Images.toNavigation,
                                textTo,
                                styles.locationSelectionText)
                    }
                </TouchableOpacity>
            </View>
        )
    }

    const renderArrayTo = () => {
        return (
            <ScrollView
                style={styles.inputLocations}
                onPress={addLocation}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ flexGrow: 1 }}
            >
                <TouchableOpacity onPress={addLocation}>
                    {
                        renderInputText(Images.fromNavigation, textFrom, styles.locationSelectionText)
                    }
                    <View style={styles.inputLocationItem}>
                        <View style={styles.navigationImg}>
                            <Image
                                source={Images.twoDots}
                                style={styles.twoDotsImg}
                            />
                        </View>
                    </View>
                    {props.navigationToArray.map((item, index) => {
                        return (
                            <Fragment key={index}>
                                {renderInputText(Images.toNavigation, props.navigationToArray[index].structured_formatting ? props.navigationToArray[index].structured_formatting.main_text : props.navigationToArray[index].address_components[0].short_name, styles.locationSelectionText)}
                                {index != (props.navigationToArray.length - 1) ? (
                                    <View style={styles.inputLocationItem}>
                                        <View style={styles.navigationImg}>
                                            <Image
                                                source={Images.twoDots}
                                                style={styles.twoDotsImg}
                                            />
                                        </View>
                                    </View>
                                ) : null}
                            </Fragment>

                        )
                    })}
                </TouchableOpacity>
            </ScrollView>
        )
    }
    return (
        <SafeAreaInsetsContext.Consumer>
            {(insets) => (
                <View style={[
                    styles.navigationSearchInputContainer,
                    {
                        marginTop: Platform.OS === 'ios' ? Metrics.small : Metrics.tiny
                    }
                ]}>
                    <View style={styles.navigationInput}>
                        <View >
                            <TouchableOpacity onPress={handleCloseRoute} style={styles.navigationBack}>
                                <Image
                                    source={Images.backNavigation}
                                    style={styles.backImg}
                                />
                            </TouchableOpacity>
                        </View>

                        <View style={styles.navigationLocation}>
                            {props.navigationToArray.length < 1 ? (
                                renderFromTo()
                            ) : (
                                renderArrayTo()
                            )}
                            <>
                                {renderIconCenter()}
                            </>
                        </View>
                    </View>
                    <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                        <View style={styles.navigationIcon}>
                            {vehicles.map((item, index) => {
                                return (
                                    <TouchableOpacity key={index} onPress={() => (setVehicleSelected(item))}>
                                        {
                                            props.vehicle == item ?
                                                renderVehicleIcon(getVehicleIcon(true, item), i18n.t(`route.attributes.${item}`)) :
                                                renderVehicleIconUnSelected(getVehicleIcon(false, item), i18n.t(`route.attributes.${item}`))
                                        }
                                    </TouchableOpacity>
                                )
                            })}
                        </View>
                    </ScrollView>
                </View>
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
        route: state.app.route,
        navigationToArray: state.app.navigationToArray,
    };
}
const mapDispatchToProps = (dispatch) => ({
    updateShowScreen: (show) => dispatch(appAction.showScreen(show)),
    updateTypeRouteInput: (type) => dispatch(appAction.typeRouteInput(type)),
    updateNavigationFrom: (from) => dispatch(appAction.navigationFrom(from)),
    updateNavigationTo: (to) => dispatch(appAction.navigationTo(to)),
    // handleTextInputFrom: (address) => dispatch(appAction.handleTextInputFrom(address)), // Thêm vào đây
    // handleTextInputTo: (address) => dispatch(appAction.handleTextInputTo(address)), // Thêm vào đây
    updateVehicle: (vehicle) => dispatch(appAction.vehicle(vehicle)),
    updatePlace: (place) => dispatch(appAction.place(place)),
    updateMyLocation: (myLocation) => dispatch(appAction.myLocation(myLocation)),
    updateMapView: (mapView) => dispatch(appAction.mapView(mapView)),
    updateRouteResult: (routeResult) => dispatch(appAction.routeResult(routeResult)),
    updateRoute: (route) => dispatch(appAction.route(route)),
    updateMapView: (mapView) => dispatch(appAction.mapView(mapView)),
    updateNavigationToArray: (navigationToArray) => dispatch(appAction.navigationToArray(navigationToArray)),
    updateIsEndPoint: (isEndPoint) => dispatch(appAction.isEndPoint(isEndPoint)),
    updateStepIndex: (stepIndex) => dispatch(appAction.stepIndex(stepIndex)),
    updateEndLocationIndex: (endLocationIndex) => dispatch(appAction.endLocationIndex(endLocationIndex)),
    updateIsLoad: (isLoad) => dispatch(appAction.isLoad(isLoad)),
});
export default connect(mapStateToProps, mapDispatchToProps)(NavigationSearchInput);