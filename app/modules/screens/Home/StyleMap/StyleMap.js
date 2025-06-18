import {
    TouchableOpacity,
    StatusBar,
    Dimensions,
    StyleSheet,
    Text,
    View,
    Image,
    FlatList,
    TextInput,
    ScrollView,
    Modal,
    Alert,
    Pressable
} from "react-native";
import { connect } from "react-redux";
import React, { Fragment, useState, useRef, useEffect } from "react";
import i18n from "@app/i18n/i18n";
import { Images, Colors, Metrics } from "@app/theme";
import * as appAction from "@app/storage/action/app";
import { getTimeFromValue } from '@app/libs/utils.js'
import stylesMap from '@app/config/mapStyles';
import _ from 'lodash';
import AsyncStorage from "@react-native-community/async-storage";
import { useNavigation } from '@react-navigation/native';
import { SafeAreaInsetsContext, SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "@app/modules/components/context/ThemeContext";
import createStyles from "./styles";
import Animated, { FadeIn, FadeOut, SlideInDown, SlideInUp, SlideOutDown } from "react-native-reanimated";
import storage from "@app/libs/storage";
import { useOrientation } from "@app/modules/components/context/OrientationContext";
import createHorizontalStyles from "./horizontalStyles";
import { Platform } from "react-native";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const StyleMap = (props) => {
    const [styleMap, setStyleMap] = useState('');
    const [dimensions, setDimensions] = useState(Dimensions.get("window"));

    const { isDarkTheme } = useTheme();
    const { isPortrait } = useOrientation();
    const styles = isPortrait ? createStyles(isDarkTheme, dimensions.width, dimensions.height)
        : createHorizontalStyles(isDarkTheme, dimensions.width, dimensions.height);
    const navigation = useNavigation();

    useEffect(() => {
        const onChange = ({ window }) => setDimensions(window);
        const subscription = Dimensions.addEventListener("change", onChange);

        return () => {
            subscription?.remove();
        };
    }, []);

    useEffect(async () => {
        const getData = async () => {
            try {
                const value = await AsyncStorage.getItem('styleMap');
                if (value !== null) {
                    setStyleMap(value);
                } else {
                    setStyleMap('normal');
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
        getData();
    }, [])
    const setStyleMapStorage = async (value) => {
        if (value !== undefined) {
            await AsyncStorage.setItem('styleMap', value);
            storage.set('isSelectedStyleMap', true);
        }
        // console.log('____________', props)
        // navigation.navigate('Overview')
        // props.renderAction
    }
    const renderOption = (item, index) => {
        return (
            <TouchableOpacity style={styleMap == item.name ? styles.optionSelected : styles.option} key={index} onPress={() => { setStyleMap(item.name) }}>
                <Text style={styleMap == item.name ? styles.optionTextSelected : styles.optionTextUnSelected}>{_.capitalize(i18n.t(`overview.attributes.${item.name}`))}</Text>
                <View style={styles.optionImage}>
                    <Image source={Images[`${item.name}MapStyle`]} style={styles.img} resizeMode="cover" />
                </View>
            </TouchableOpacity>
        )
    }
    return (
        <SafeAreaInsetsContext.Consumer>
            {(insets) => (
                <AnimatedPressable onPress={props.onClose} style={styles.backdrop}
                    entering={FadeIn}
                    exiting={FadeOut}
                >
                    <AnimatedPressable
                        onPress={(e) => e.stopPropagation()}
                        entering={SlideInDown.duration(200)}
                        exiting={SlideOutDown}
                        style={styles.container}
                    >
                        <View style={styles.styleMapContainerBackground}>
                            <View style={[styles.styleMapContainer]}>
                                <Text style={[
                                    styles.styleMapTitle,
                                    { marginLeft: (!isPortrait && Platform.OS === 'ios') ? insets.left : Metrics.small }
                                ]}>
                                    {i18n.t("overview.attributes.mapLayer")}
                                </Text>
                                <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}>
                                    <View style={[
                                        styles.styleMapOptions,
                                        { paddingHorizontal: (!isPortrait && Platform.OS === 'ios') ? insets.left : Metrics.small }
                                    ]}>
                                        {stylesMap.STYLES.map((item, index) => {
                                            return (
                                                <>
                                                    {renderOption(item, index)}
                                                    {index < stylesMap.STYLES.length - 1 &&
                                                        <View style={styles.spacerWidth}></View>
                                                    }
                                                </>
                                            )
                                        })}
                                    </View>
                                </ScrollView>
                                <View style={[styles.styleMapButtonContainer,
                                {
                                    marginBottom: insets.bottom,
                                    paddingHorizontal: (!isPortrait && Platform.OS === 'ios') ? insets.left : Metrics.small
                                }
                                ]}>
                                    <TouchableOpacity style={styles.styleMapButton} onPress={() => { setStyleMapStorage(styleMap), props.renderAction(), props.onClose() }}>
                                        <Text style={styles.styleMapButtonText}>{i18n.t("overview.attributes.application")}</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </AnimatedPressable>
                </AnimatedPressable >
            )
            }
        </SafeAreaInsetsContext.Consumer >
    )
}

function mapStateToProps(state) {
    return {
    };
}
const mapDispatchToProps = (dispatch) => ({
});
export default connect(mapStateToProps, mapDispatchToProps)(StyleMap);