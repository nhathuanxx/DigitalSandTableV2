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
} from "react-native";
import { connect } from "react-redux";
import React, { Fragment, useState, useRef, useEffect, useCallback, useMemo } from "react";
import i18n from "@app/i18n/i18n";
import { Images, Metrics } from "@app/theme";
import * as appAction from "@app/storage/action/app";
import { useNavigation } from '@react-navigation/native';
import { SafeAreaInsetsContext, SafeAreaView } from "react-native-safe-area-context";
import _ from 'lodash';
import { debounce } from 'lodash';
import createStyles from './styles';
import { useTheme } from "@app/modules/components/context/ThemeContext";
import { getTimeFromValue } from "@app/libs/utils";
import { useOrientation } from "@app/modules/components/context/OrientationContext";
import createHorizontalStyles from "./horizontalStyles";

const AddLocation = (props) => {
    const [numberLocation, setNumberLocation] = useState(1);
    const [locationArray, setLocationArray] = useState([]);
    const [dimensions, setDimensions] = useState(Dimensions.get("window"));
    const scrollViewRef = useRef();


    const { isDarkTheme } = useTheme();
    const { isPortrait } = useOrientation();
    const styles = isPortrait ?
        createStyles(isDarkTheme, dimensions.width, dimensions.height)
        : createHorizontalStyles(isDarkTheme, dimensions.width, dimensions.height);
    // sự kiện quay ngang
    useEffect(() => {
        const onChange = ({ window }) => setDimensions(window);
        const subscription = Dimensions.addEventListener("change", onChange);

        return () => {
            subscription?.remove();
        };
    }, []);

    useEffect(() => {
        scrollViewRef.current.scrollToEnd({ animated: true });
        if (props.navigationToArray.length == 0) {
            props.updateNavigationToArray([...props.navigationToArray, props.navigationTo])
        }
        setLocationArray(prevArray => [...prevArray, props.navigationFrom]);
    }, [props.navigationFrom])

    useEffect(() => {
        if (props.navigationToArray <= 1) {
            setLocationArray(prevArray => [...prevArray, ...props.navigationToArray]);

        } else {
            setLocationArray([props.navigationFrom, ...props.navigationToArray]);
        }
    }, [props.navigationToArray])

    const allTime = useMemo(() => {
        let time = 0;
        for (let leg of props.routeResult[0].legs) {
            time += leg.duration.value;
        }
        return time;
    }, [props.routeResult])

    const back = () => {
        props.updateNavigationToArray([])
        props.updateShowScreen("overview")
    }

    const deleteLocation = (item, index) => {
        if (locationArray.length > 2) {
            const oldArray = props.navigationToArray;
            const updatedArray = oldArray.filter((_, i) => i !== (index - 1));
            props.updateNavigationToArray(updatedArray)
        } else {
            // Tìm phần tử không bị xóa
            const remainingLocation = locationArray.filter((_, i) => i !== index);
            // Cập nhật props.updateNavigationFrom với phần tử không bị chọn
            if (remainingLocation.length > 0) {
                props.updateNavigationFrom(remainingLocation[0]);
                props.updateNavigationTo(null);
            }
            props.updateNavigationToArray([])
            props.updateShowScreen("overview")
        }
    }

    const handleTypeInput = () => {
        props.updateTypeRouteInput("add");
        props.updateShowScreen("locationSelection");
    };

    const update = (index) => {
        props.updateTypeRouteInput("update");
        props.updateShowScreen("locationSelection");
        // console.log("____________oke____________")
        props.handleIndexLocationTo(index)
    };

    const complete = () => {
        const from = props.navigationFrom
        from.myLocation = true
        props.updateNavigationFrom(from)
        if (locationArray.length > 2) {
            props.updateNavigationTo(null)
        } else if (locationArray.length == 2) {
            props.updateNavigationToArray([])
            props.updateNavigationTo(locationArray[1])
        } else if (locationArray.length == 1) {
            props.updateNavigationTo(null)
            props.updateNavigationToArray([])
        } else {
            props.updateNavigationToArray([])
        }
        props.updateShowScreen("overview")
    }

    const renderInputItem = (item, index) => {
        // console.log(')))))', item)
        return (
            <View style={styles.inputLocationItem} key={index}>
                <View style={styles.inputBody}>
                    <View style={styles.navigationImg}>
                        <Image
                            source={index == 0 ? Images.fromNavigation : Images.toNavigation}
                            style={styles.fromToImg}
                        />
                    </View>
                    <TouchableOpacity style={styles.inputText} onPress={() => { if (index != -1) { update(index) } else { handleTypeInput() } }} >
                        <Text style={item != null ? styles.blackText : styles.grayText} numberOfLines={1} ellipsizeMode="tail">
                            {/* {`${getText(index)}`} */}
                            {(index == 0 && props.textInputFrom != null) ? props.textInputFrom :
                                (item != null ? (item.structured_formatting ? item.structured_formatting.main_text : item.address_components[0].short_name) : i18n.t("route.attributes.selectDestination"))
                            }
                        </Text>
                    </TouchableOpacity>
                    <View style={styles.icon} >
                        <Image
                            source={Images.menu}
                            style={styles.img}
                        />
                    </View>
                </View>
                {index != -1 ? (
                    <TouchableOpacity style={styles.close} onPress={() => { deleteLocation(item, index) }}>
                        <Image
                            source={Images.closeDirection}
                            style={styles.imgClose}
                        />
                    </TouchableOpacity>
                ) : (
                    <View style={styles.close} />
                )}
            </View>
        )
    }

    return (
        <SafeAreaInsetsContext.Consumer>
            {(insets) => (
                <View style={[styles.navigationSearchInputContainer]}>
                    <View style={styles.navigationInput}>
                        <View style={styles.navigationBack}>
                            <TouchableOpacity style={styles.back} onPress={back}>
                                <Image
                                    source={Images.backNavigation}
                                    style={styles.backImg}
                                    resizeMode="contain"
                                />
                            </TouchableOpacity>
                        </View>

                        <View style={styles.navigationLocation}>
                            <ScrollView
                                showsVerticalScrollIndicator={false}
                                contentContainerStyle={{ flexGrow: 1 }}
                                ref={scrollViewRef}
                                onContentSizeChange={() => scrollViewRef.current.scrollToEnd({ animated: true })}
                            >
                                {locationArray.map((item, index) => {
                                    return (
                                        renderInputItem(item, index)
                                    )
                                })}
                                {locationArray.length < 9 && renderInputItem(null, -1)}


                            </ScrollView>
                        </View>
                    </View>
                    <View style={styles.addLocationContainer}>
                        <View>
                            <Text style={[styles.blackText, styles.textSize]}>
                                {`${i18n.t("route.attributes.allTime")}: ${getTimeFromValue(
                                    allTime,
                                    i18n.t("route.attributes.day"),
                                    i18n.t("route.attributes.hour"),
                                    i18n.t("route.attributes.minute"),
                                )}`}
                            </Text>
                        </View>
                        <TouchableOpacity style={[styles.okButton]} onPress={complete}>
                            <Text style={[styles.blueText]} >
                                {i18n.t("route.attributes.completed")}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )}
        </SafeAreaInsetsContext.Consumer >
    )
}

function mapStateToProps(state) {
    return {
        navigationFrom: state.app.navigationFrom,
        navigationTo: state.app.navigationTo,
        navigationToArray: state.app.navigationToArray,
        routeResult: state.app.routeResult,
    };
}
const mapDispatchToProps = (dispatch) => ({
    updateShowScreen: (show) => dispatch(appAction.showScreen(show)),
    updateNavigationFrom: (from) => dispatch(appAction.navigationFrom(from)),
    updateNavigationTo: (to) => dispatch(appAction.navigationTo(to)),
    updateTypeRouteInput: (type) => dispatch(appAction.typeRouteInput(type)),
    updateNavigationToArray: (navigationToArray) => dispatch(appAction.navigationToArray(navigationToArray)),
});
export default connect(mapStateToProps, mapDispatchToProps)(AddLocation);