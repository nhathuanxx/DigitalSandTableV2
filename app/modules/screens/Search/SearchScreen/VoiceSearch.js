import React, { useEffect, useRef, useState, useContext } from "react";
import {
  Image,
  Text,
  TouchableOpacity,
  View,
  Pressable,
  FlatList,
  ActivityIndicator,
  Platform,
  Dimensions,
  Alert
} from "react-native";
import { connect } from "react-redux";
import { Images, Colors as Themes, Metrics } from "@app/theme";
import i18n from "@app/i18n/i18n";
import Voice from '@react-native-community/voice';
import storage from "@app/libs/storage";
import { useTheme } from "@app/modules/components/context/ThemeContext";
import createStyles from './styles';
import { useOrientation } from "@app/modules/components/context/OrientationContext";
import createHorizontalStyles from "./horizontalStyles";
import { RadioContext } from "@app/modules/screens/Radio/RadioProvider";
import { useGetPlaceDetailFromAddress } from "@app/hooks/place_detail.hook";
import { useNavigation } from "@react-navigation/native";
import * as appAction from "@app/storage/action/app";
import { VOICE_REGEX } from "@app/config/voice";
import AnimatedVoice from "./AnimatedVoice";

const VoiceSearch = ({ handleClose, handleSearch, content, updateShowScreen, updateNavigationFrom, updateNavigationTo, handleSaveVoiceSearchHistory }) => {

  const [started, setStarted] = useState('');
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [recognizedText, setRecognizedText] = useState('');
  const [dimensions, setDimensions] = useState(Dimensions.get("window"));

  const timerRef = useRef(null);
  const finalResultTimerRef = useRef(null);
  const fullResultsRef = useRef([]);

  const { isPlaying, pauseRadio, resumeRadio } = useContext(RadioContext);
  const { isDarkTheme } = useTheme();
  const { isPortrait } = useOrientation();
  const styles = isPortrait ? createStyles(isDarkTheme, dimensions.width, dimensions.height) : createHorizontalStyles(isDarkTheme, dimensions.width, dimensions.height);
  const Colors = Themes[isDarkTheme ? 'darkMode' : 'lightMode'];
  const useFetchGetPlaceDetailFromAddress = useGetPlaceDetailFromAddress();
  const navigation = useNavigation();

  useEffect(() => {
    const onChange = ({ window }) => setDimensions(window);
    const subscription = Dimensions.addEventListener("change", onChange);

    return () => {
      subscription?.remove();
    };
  }, []);

  useEffect(() => {
    Voice.onSpeechStart = onSpeechStart;
    Voice.onSpeechResults = onSpeechResults;
    Voice.onSpeechPartialResults = onSpeechPartialResults;
    Voice.onSpeechError = onSpeechError;

    startRecognizing();

    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
      clearTimeout(timerRef.current);
      clearTimeout(finalResultTimerRef.current);
    };
  }, []);

  useEffect(() => {
    if (results.length > 0) {
      resumeRadio();
      if (Platform.OS === 'ios') {
        const route = extractRoute(recognizedText);
        if (route) {
          console.log('route: ----- ', route);
          handleRoute(route);
        } else {
          handleSearch(recognizedText);
        }
      } else {
        const route = extractRoute(results[0]);
        if (route) {
          console.log('route: ----- ', route);
          handleRoute(route);
        } else {
          handleSearch(results[0]);
        }
      }
      const timer = setTimeout(() => {
        setIsLoading(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [results]);

  const startRecognizing = async () => {
    try {
      pauseRadio();
      await Voice.start('vi-VN');
      setStarted(i18n.t("overview.search.listening"));
      setResults([]);

      // if (Platform.OS === 'ios') {
      fullResultsRef.current = [];
      finalResultTimerRef.current = setTimeout(() => {
        if (fullResultsRef.current.length > 0 && Platform.OS === 'ios') {
          setResults(fullResultsRef.current);
        } else {
          handleClose();
        }
      }, 2500);
      // }
    } catch (error) {
      console.error('Error starting voice recognition:', error);
    }
  };

  const onSpeechPartialResults = (event) => {
    // if (Platform.OS === 'ios') {
    if (finalResultTimerRef.current) {
      clearTimeout(finalResultTimerRef.current);
    }

    const partialText = event.value.join(' ');
    setRecognizedText(partialText);

    finalResultTimerRef.current = setTimeout(async () => {
      if (Platform.OS === 'ios') {
        if (fullResultsRef.current.length > 0) {
          setResults(fullResultsRef.current);
        } else {
          handleClose();
        }
      } else {
        await Voice.stop();
      }
    }, 2500);
  };

  const onSpeechResults = (event) => {
    if (finalResultTimerRef.current) {
      clearTimeout(finalResultTimerRef.current);
    }
    if (Platform.OS === 'ios') {
      const newResults = event.value;
      fullResultsRef.current = [...fullResultsRef.current, ...newResults];

      finalResultTimerRef.current = setTimeout(() => {
        if (fullResultsRef.current.length > 0) {
          setResults(fullResultsRef.current);
        } else {
          handleClose();
        }
      }, 2500);
    } else {
      setResults(event.value);
    }
  };

  const onSpeechError = (error) => {
    Alert.alert(
      i18n.t("alert.attributes.warning"),
      error.message || i18n.t("alert.attributes.warning"),
      [
        { text: i18n.t("alert.attributes.oke") },
      ]
    );
    handleClose();
  };

  const onSpeechStart = (e) => {
    setStarted(i18n.t("overview.search.listening"));
  };

  const extractRoute = (inputText) => {
    let match = null;
    VOICE_REGEX.some((item) => {
      const result = inputText.toLowerCase().match(item.regex);
      if (result) {
        if (result.length < 3) {
          match = { from: null, to: result[1], type: item.type };
        } else {
          match = { from: result[1], to: result[2], type: item.type };
        }
        return true;
      }
      return false;
    });

    return match;
  };

  const handleRoute = async (route) => {
    const paramsTo = {
      address: route.to
    };
    try {
      const placeTo = await useFetchGetPlaceDetailFromAddress.mutateAsync(paramsTo);
      // console.log('place to: ', placeTo.results[0]);
      if (route.from && route.type !== 'navigation') {
        const paramsFrom = {
          address: route.from
        };
        const placeFrom = await useFetchGetPlaceDetailFromAddress.mutateAsync(paramsFrom);
        updateNavigationFrom(placeFrom.results[0]);
        updateNavigationTo(placeTo.results[0]);
        updateShowScreen("Route");
        handleClose();
        handleSaveVoiceSearchHistory({
          ...placeFrom.results[0],
          location: placeFrom.results[0].geometry.location,
          description: placeFrom.results[0].formatted_address
        });
        handleSaveVoiceSearchHistory({
          ...placeTo.results[0],
          location: placeTo.results[0].geometry.location,
          description: placeTo.results[0].formatted_address
        });
        navigation.navigate('Route', {
          type: '',
        });
      } else {
        updateNavigationTo(placeTo.results[0]);
        updateShowScreen("Route");
        handleClose();
        handleSaveVoiceSearchHistory({
          ...placeTo.results[0],
          location: placeTo.results[0].geometry.location,
          description: placeTo.results[0].formatted_address
        });
        navigation.navigate('Route', {
          type: 'route',
          start: route.type === 'navigation' ? 'start' : null
        });
      }
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
  }

  return (
    <Pressable
      style={styles.voiceContainer}
      onPress={handleClose}
    >
      <Pressable style={styles.voiceBody} onPress={(e) => e.stopPropagation()}>
        {results.length > 0 ? (
          <>
            {isLoading ? (
              <ActivityIndicator size={Metrics.medium * 2} color={Colors.blueText} />
            ) : (
              <Image source={Images.success} style={styles.voiceIcon} />
            )}
            <View style={styles.voiceBodyRight}>
              {Platform.OS === 'ios' ? (
                <Text style={styles.voiceResult}>{recognizedText}</Text>
              ) : (
                <Text style={styles.voiceResult}>{results[0]}</Text>
              )}
            </View>
          </>
        ) : (
          <>
            <AnimatedVoice />
            <View style={styles.voiceBodyRight}>
              <Text style={styles.voiceContentText}>{started}</Text>
              <Text style={styles.voiceDescText}>
                {recognizedText ? recognizedText : i18n.t("overview.search.voiceDesc")}
              </Text>
            </View>
          </>
        )}
      </Pressable>
    </Pressable>
  );
};

function mapStateToProps(state) {
  return {
    showScreen: state.app.showScreen,
    navigationFrom: state.app.navigationFrom,
    navigationTo: state.app.navigationTo,
  };
}
const mapDispatchToProps = (dispatch) => ({
  updateShowScreen: (show) => dispatch(appAction.showScreen(show)),
  updateNavigationFrom: (from) => dispatch(appAction.navigationFrom(from)),
  updateNavigationTo: (to) => dispatch(appAction.navigationTo(to)),
});

export default connect(mapStateToProps, mapDispatchToProps)(React.memo(VoiceSearch));