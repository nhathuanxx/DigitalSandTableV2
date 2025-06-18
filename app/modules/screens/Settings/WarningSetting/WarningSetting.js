import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Text,
  View,
  Dimensions,
  Pressable,
  Alert,
  ScrollView,
  Platform
} from "react-native";
import i18n from "@app/i18n/i18n";
import storage from "@app/libs/storage";
import SettingHeader from "../component/SettingHeader";
// import Slider from "react-native-smooth-slider";
import { Colors as Themes, Metrics, Images } from "@app/theme";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import SettingFooter from "../component/SettingFooter";
import { useNavigation } from "@react-navigation/native";
import { useTheme } from "@app/modules/components/context/ThemeContext";
import createSettingScreenStyle from "../SettingScreenStyles";
import AlertError from "@app/modules/components/alert/AlertError/AlertError";
import { SafeAreaInsetsContext, SafeAreaView } from "react-native-safe-area-context";
import { useOrientation } from "@app/modules/components/context/OrientationContext";
import RadioElement from "../component/RadioElement";
import SmoothSliderElement from "@app/modules/components/element/SmoothSliderElement";

const { width } = Dimensions.get('window');
const sliderWidth = width - Metrics.medium * 4;

const WarningSetting = ({ }) => {

  const { isDarkTheme, applyTheme } = useTheme();
  const { isPortrait, dimensions } = useOrientation();
  const settingScreenStyle = createSettingScreenStyle(isDarkTheme);
  const Colors = Themes[isDarkTheme ? 'darkMode' : 'lightMode'];

  const [speedWarning, setSpeedWarning] = useState(10);
  const [selectedSoundId, setSelectedSoundId] = useState('1');
  const [selectedTimeId, setSelectedTimeId] = useState('1');
  const [isAlert, setIsAlert] = useState(false);

  const navigation = useNavigation();

  useEffect(async () => {
    let speedWarningValue = await storage.get('speedWarning');
    let speedWarningSoundValue = await storage.get('speedWarningSound');
    let violationAlertHideTimeValue = await storage.get('violationAlertHideTime');
    if (speedWarningValue) { setSpeedWarning(speedWarningValue) };
    if (speedWarningSoundValue) {
      const selectedSound = sounds.find(sound => sound.value === speedWarningSoundValue);
      setSelectedSoundId(selectedSound.id);
    };

    if (violationAlertHideTimeValue) {
      const selectedTime = warningHiddenTimeOptions.find(item => item.value === violationAlertHideTimeValue);
      setSelectedTimeId(selectedTime.id);
    }

  }, [])

  const getSounds = () => {
    return [
      {
        id: '1', // acts as primary key, should be unique and non-empty string
        label: i18n.t(`setting.warningSound.voice`),
        value: 'voice',
        color: selectedSoundId === '1' ? Colors.blueText : Colors.textGrey,
        size: Metrics.tiny * 5,
        borderSize: 1,
        selected: true,
      },
      {
        id: '2',
        label: i18n.t(`setting.warningSound.sound`),
        value: 'sound',
        color: selectedSoundId === '2' ? Colors.blueText : Colors.textGrey,
        size: Metrics.tiny * 5,
        borderSize: 1,
        selected: false,
      },
      {
        id: '3',
        label: i18n.t(`setting.warningSound.turnOff`),
        value: 'turnOff',
        color: selectedSoundId === '3' ? Colors.blueText : Colors.textGrey,
        size: Metrics.tiny * 5,
        borderSize: 1,
        selected: false,
      }
    ]
  };
  const sounds = useMemo(getSounds, [selectedSoundId]);

  const getWarningHiddenTimeOptions = () => {
    return [
      {
        id: '1',
        value: 0,
        label: i18n.t(`setting.warningHiddenTime.default`),
        color: selectedTimeId === '1' ? Colors.blueText : Colors.textGrey,
        size: Metrics.tiny * 5,
        borderSize: 1,
        selected: true,
      },
      {
        id: '2',
        value: 3 * 86400 * 1000, // ms
        label: i18n.t(`setting.warningHiddenTime.threeDays`),
        color: selectedTimeId === '2' ? Colors.blueText : Colors.textGrey,
        size: Metrics.tiny * 5,
        borderSize: 1,
        selected: false,
      },
      {
        id: '3',
        value: 7 * 86400 * 1000, // ms
        label: i18n.t(`setting.warningHiddenTime.oneWeek`),
        color: selectedTimeId === '3' ? Colors.blueText : Colors.textGrey,
        size: Metrics.tiny * 5,
        borderSize: 1,
        selected: false,
      },
      {
        id: '4',
        value: 30 * 86400 * 1000, // ms
        label: i18n.t(`setting.warningHiddenTime.oneMonth`),
        color: selectedTimeId === '4' ? Colors.blueText : Colors.textGrey,
        size: Metrics.tiny * 5,
        borderSize: 1,
        selected: false,
      },
      {
        id: '5',
        value: 90 * 86400 * 1000, // ms
        label: i18n.t(`setting.warningHiddenTime.threeMonths`),
        color: selectedTimeId === '5' ? Colors.blueText : Colors.textGrey,
        size: Metrics.tiny * 5,
        borderSize: 1,
        selected: false,
      },
      {
        id: '6',
        value: 'Infinity',
        label: i18n.t(`setting.warningHiddenTime.forever`),
        color: selectedTimeId === '6' ? Colors.blueText : Colors.textGrey,
        size: Metrics.tiny * 5,
        borderSize: 1,
        selected: false,
      },
    ]
  }
  const warningHiddenTimeOptions = useMemo(getWarningHiddenTimeOptions, [selectedTimeId]);

  const handleSave = () => {
    storage.set('speedWarning', speedWarning);
    const selectedSound = sounds.find(sound => sound.id === selectedSoundId);
    if (selectedSound) {
      storage.set('speedWarningSound', selectedSound.value);
    }

    const selectedTime = warningHiddenTimeOptions.find(item => item.id === selectedTimeId);
    if (selectedTime) {
      const currentTime = new Date().getTime();
      storage.set('violationAlertHideTime', selectedTime.value);
      storage.set('lastViolationAlertTime', currentTime);
    }

    setIsAlert(true);
  }

  const handleCancel = (async () => {
    navigation.navigate('Overview');
  })

  const handleSetDefaulValue = () => {
    setSpeedWarning(17);
    setSelectedSoundId('1');
    storage.set('speedWarning', 17);
    storage.set('speedWarningSound', 'voice');

    const currentTime = new Date().getTime();
    setSelectedTimeId('1');
    storage.set('violationAlertHideTime', 0);
    storage.set('lastViolationAlertTime', currentTime);

    setIsAlert(true);
  }

  const handleOnValueChange = useCallback((field, value) => {
    switch (field) {
      case 'speedWarning':
        setSpeedWarning(value);
        break;
      case 'speedWarningSound':
        setSelectedSoundId(value);
        break;
      case 'warningHiddenTime':
        setSelectedTimeId(value);
        break;
    }
  }, []);

  const closeAlert = useCallback(() => {
    setIsAlert(false);
  }, []);

  const renderWarningSpeed = useCallback((field, value, min, max, step, unit) => (
    <SmoothSliderElement
      field={field}
      value={value}
      unit={unit}
      step={step}
      max={max}
      min={min}
      trackWidth={dimensions.width - Metrics.medium * 4}
      trackHeight={Metrics.normal / 2}
      thumbSize={Metrics.icon}
      handleOnValueChange={handleOnValueChange}
    />
  ), []);


  const renderWarningSpeedSound = useCallback(() => (
    <RadioElement
      data={sounds}
      fieldName={'speedWarningSound'}
      selectedId={selectedSoundId}
      handleOnValueChange={handleOnValueChange}
    />
  ), [selectedSoundId]);

  const renderWarningHiddenTime = useCallback(() => (
    <RadioElement
      data={warningHiddenTimeOptions}
      fieldName={'warningHiddenTime'}
      selectedId={selectedTimeId}
      handleOnValueChange={handleOnValueChange}
    />
  ), [selectedTimeId]);

  const renderAlert = () => {
    return (
      <AlertError
        title={i18n.t("alert.attributes.success")}
        iconSoucre={Images.success}
        handleClose={closeAlert}
      />
    )
  }

  return (
    <GestureHandlerRootView style={settingScreenStyle.flexFull}>
      <SafeAreaInsetsContext.Consumer>
        {(insets) => (
          <>
            <SettingHeader settingName={'warning'} setDefaulValue={handleSetDefaulValue} />
            <ScrollView>
              <View style={[
                settingScreenStyle.settingContent,
                { paddingHorizontal: (!isPortrait && Platform.OS === 'ios') ? insets.left : Metrics.medium }
              ]}>
                {/* {renderWarningSpeed('speedWarning', speedWarning, 1, 30, 1, 'velocity')} */}
                <View style={settingScreenStyle.line}></View>
                {/*{renderWarningSpeedSound()}
        <View style={settingScreenStyle.line}></View> */}
                {renderWarningHiddenTime()}
              </View>
            </ScrollView>
            <SettingFooter handleSave={handleSave} handleCancel={handleCancel} />
            {isAlert && renderAlert()}
          </>
        )}
      </SafeAreaInsetsContext.Consumer >
    </GestureHandlerRootView>
  )

}

export default WarningSetting;