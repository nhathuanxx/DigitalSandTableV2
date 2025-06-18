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
    Platform,
} from "react-native";
import createStyles from './styles';
import { connect } from "react-redux";
import React, { Fragment, useState, useRef, useEffect, useMemo, useCallback, useContext } from "react";
import { Images, Metrics } from "@app/theme";
import * as appAction from "@app/storage/action/app";
import { SafeAreaInsetsContext, SafeAreaView } from "react-native-safe-area-context";
import LinearGradient from 'react-native-linear-gradient';
import { useTheme } from "@app/modules/components/context/ThemeContext";
import i18n from "@app/i18n/i18n";
import { getRouteDetailsIcon } from "@app/modules/components/config/routeStepIcon";
import Tts from 'react-native-tts';
import { getDistance } from 'geolib';
import storage from "@app/libs/storage";
import { formatDistance, getDefaultVoiceLanguage } from "@app/libs/utils";
import { useOrientation } from "@app/modules/components/context/OrientationContext";
import createHorizontalStyles from "./horizontalStyles";
import { RadioContext } from "@app/modules/screens/Radio/RadioProvider";
import crashlytics from '@react-native-firebase/crashlytics';

const NavigationStep = (props) => {

    const [stepText, setStepText] = useState("--");
    const [directionText, setDirectionText] = useState("--");
    const [stepQueue, setStepQueue] = useState([]); // Hàng đợi các hướng dẫn cần đọc
    const [dimensions, setDimensions] = useState(Dimensions.get("window"));
    const [isSpeak, setIsSpeak] = useState(true);
    const isReading = useRef(false); // Trạng thái đọc

    const { isDarkTheme } = useTheme();
    const { isPortrait } = useOrientation();
    const styles = isPortrait ?
        createStyles(isDarkTheme, dimensions.width, dimensions.height)
        : createHorizontalStyles(isDarkTheme, dimensions.width, dimensions.height);
    const { setVolumeRadio } = useContext(RadioContext);


    // Cấu hình giọng nói
    Tts.setDefaultRate(0.5);         // Tốc độ đọc (0.5 - 2.0)
    Tts.setDefaultPitch(1);        // Tông giọng (0.5 - 2.0)

    useEffect(() => {
        const onChange = ({ window }) => setDimensions(window);
        const subscription = Dimensions.addEventListener("change", onChange);

        return () => {
            subscription?.remove();
        };
    }, []);

    useEffect(() => {
        const fetchLanguage = async () => {
            const lang = await getLanguage();
            // cài ngôn ngữ
            Tts.setDefaultLanguage(getDefaultVoiceLanguage(lang));
        };
        fetchLanguage();

        const onTtsFinish = () => {
            isReading.current = false;

            // Lấy mục tiếp theo trong hàng đợi
            setStepQueue((prevQueue) => {
                if (prevQueue.length > 1) {
                    // Kích hoạt ducking
                    Tts.setDucking(true);
                    setVolumeRadio(0.05);

                    // Bỏ qua mục đã đọc và tiếp tục đọc mục tiếp theo
                    const [, ...remainingQueue] = prevQueue;
                    Tts.speak(remainingQueue[0]);
                    Tts.addEventListener('tts-finish', () => {
                        setVolumeRadio(1);
                    });
                    isReading.current = true;
                    return remainingQueue;
                }
                return []; // Hàng đợi rỗng nếu không còn gì để đọc
            });
        };

        // Đăng ký sự kiện hoàn thành
        Tts.addEventListener("tts-finish", onTtsFinish);

        return () => {
            // Gỡ bỏ sự kiện khi component unmount
            Tts.removeEventListener("tts-finish", onTtsFinish);
        };
    }, [])

    // Xử lý khi stepIndex hoặc routeResult thay đổi
    useEffect(() => {
        if (!props.routeResult || props.endLocationIndex == null || props.stepIndex == null) return;

        const currentLeg = props.routeResult[0]?.legs?.[props.endLocationIndex + 1];
        if (!currentLeg) return;

        const currentStep = currentLeg.steps?.[props.stepIndex];
        const nextStep = currentLeg.steps?.[props.stepIndex + 1];

        if (nextStep) {
            const instruction = nextStep.html_instructions || "";
            const maneuver = nextStep.maneuver || "";

            // Cập nhật văn bản chỉ khi có thay đổi
            setStepText((prev) => (prev !== instruction ? instruction : prev));
            setDirectionText((prev) => (prev !== maneuver ? maneuver : prev));

            // Thêm vào hàng đợi để đọc
            if (props.stepIndex !== 0 && currentStep) {
                setStepQueue((prevQueue) => {
                    if (prevQueue.length === 0 || prevQueue[prevQueue.length - 1] !== currentStep.html_instructions) {
                        return [...prevQueue, currentStep.html_instructions || ""];
                    }
                    return prevQueue;
                });
                // setStepQueue("đang test")
            }
        }
    }, [props.stepIndex, props.routeResult]);

    useEffect(() => {

        setIsSpeak(true)

    }, [props.stepIndex]);

    // Bắt đầu đọc nếu không đang đọc và hàng đợi không rỗng
    useEffect(() => {
        if (!isReading.current && stepQueue.length > 0) {
            // Kích hoạt ducking
            Tts.setDucking(true);
            setVolumeRadio(0.05);

            isReading.current = true;
            Tts.speak(stepQueue[0]);

            Tts.addEventListener('tts-finish', () => {
                setVolumeRadio(1);
            });
        }
    }, [stepQueue]);

    const testSound = () => {
        Tts.setDucking(true);
        setVolumeRadio(0.05);

        Tts.speak(stepText);
        Tts.addEventListener('tts-finish', () => {
            setVolumeRadio(1);
        });
    };

    const testCrash = () => {
        crashlytics().log('Test crash button clicked');
        crashlytics().crash();
    };

    const getValue = useMemo(() => {
        if (props.routeResult != null) {
            if (props.endLocationIndex < (props.routeResult[0].legs.length - 1)) {
                if (props.stepIndex < props.routeResult[0].legs[(props.endLocationIndex + 1)].steps.length - 1) {
                    const distance = getDistance(
                        { latitude: props.myLocation[1], longitude: props.myLocation[0] },
                        { latitude: props.routeResult[0].legs[(props.endLocationIndex + 1)].steps[(props.stepIndex)].end_location.lat, longitude: props.routeResult[0].legs[(props.endLocationIndex + 1)].steps[(props.stepIndex)].end_location.lng }
                    );
                    if (distance < 230 && distance > 180 && isSpeak) {
                        Tts.setDucking(true);
                        setVolumeRadio(0.05);
                        Tts.speak(`200 mét nữa ${stepText}`);
                        Tts.addEventListener('tts-finish', () => {
                            setVolumeRadio(1);
                        });
                        setIsSpeak(false);
                    }
                    return distance;
                } else {
                    return 0;
                }
            } else {
                return 0;
            }
        } else {
            return 0;
        }
    }, [props.stepIndex, props.myLocation, props.routeResult])


    const getDirectionText = useMemo(() => {
        if (directionText == "left") {
            return i18n.t("route.attributes.left")
        } else if (directionText == "right") {
            return i18n.t("route.attributes.right")
        } else if (directionText == "slight left") {
            return i18n.t("route.attributes.slightLeft")
        } else if (directionText == "slight right") {
            return i18n.t("route.attributes.slightRight")
        } else if (directionText == "uturn") {
            return i18n.t("route.attributes.uturn")
        } else if (directionText == "sharp left") {
            return i18n.t("route.attributes.sharpLeft")
        } else if (directionText == "sharp right") {
            return i18n.t("route.attributes.sharpRight")
        } else if (directionText == "straight") {
            return i18n.t("route.attributes.straight")
        } else {
            return "--";
        }
    }, [directionText])

    const getLanguage = async () => {
        const language = await storage.get("language");
        return language ? language : 'vi'
    };

    return (
        <>
            <StatusBar barStyle="light-content" />
            <SafeAreaInsetsContext.Consumer>
                {(insets) => (
                    <LinearGradient
                        colors={['rgba(0, 0, 0, 0.97)', '#637995']}
                        start={{ x: 0.5, y: 0 }}
                        end={{ x: 0.5, y: 1 }}
                        style={[
                            styles.navigationStepContainer,
                            {
                                paddingTop: isPortrait ? insets.top : 0,
                                marginTop: !isPortrait ? (Platform.OS === 'ios' ? Metrics.small : Metrics.tiny) : -insets.top,
                                marginRight: !isPortrait ? Metrics.normal : 0
                            }
                        ]}
                    >
                        <View style={styles.navigationStepBody}>
                            <View style={styles.icon}>
                                {/* <Text>3434</Text> */}
                                <Image source={getRouteDetailsIcon(directionText)} style={styles.img} />
                            </View>
                            <View style={styles.body}>
                                <View style={[styles.fistText]}>
                                    <Text style={[styles.textWhite, styles.textBold]}>{formatDistance(getValue)}</Text>
                                    <Text style={[styles.textWhite, styles.textDirection]}>{getDirectionText}</Text>
                                </View>
                                <Text numberOfLines={2} ellipsizeMode='tail' style={[styles.textWhite, styles.textBold]}>{stepText}</Text>
                            </View>
                        </View>
                        {/* <TouchableOpacity style={{ backgroundColor: 'red' }} onPress={testCrash}>
                            <Text style={{ color: 'white', padding: 10 }}>Test crash</Text>
                        </TouchableOpacity> */}
                    </LinearGradient>
                )}
            </SafeAreaInsetsContext.Consumer >
        </>
    )
}

function mapStateToProps(state) {
    return {
        stepIndex: state.app.stepIndex,
        endLocationIndex: state.app.endLocationIndex,
        routeResult: state.app.routeResult,
        myLocation: state.app.myLocation,

    };
}
const mapDispatchToProps = (dispatch) => ({

});
export default connect(mapStateToProps, mapDispatchToProps)(NavigationStep);