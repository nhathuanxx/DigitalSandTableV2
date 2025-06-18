import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import {
  Text,
  View,
  Dimensions,
  Pressable,
  Alert,
  ScrollView,
  Platform,
} from "react-native";
import i18n from "@app/i18n/i18n";
import storage from "@app/libs/storage";
import SettingHeader from "../component/SettingHeader";
import { Colors as Themes, Images, Metrics } from "@app/theme";
import SettingFooter from "../component/SettingFooter";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useNavigation } from "@react-navigation/native";
import { useTheme } from "@app/modules/components/context/ThemeContext";
import createSettingScreenStyle from "../SettingScreenStyles";
import AlertError from "@app/modules/components/alert/AlertError/AlertError";
import SystemSetting from 'react-native-system-setting';
import { SafeAreaInsetsContext, SafeAreaView } from "react-native-safe-area-context";
import { useOrientation } from "@app/modules/components/context/OrientationContext";
import RadioElement from "../component/RadioElement";
import SmoothSliderElement from "@app/modules/components/element/SmoothSliderElement";
import { RadioContext } from "@app/modules/screens/Radio/RadioProvider";
import SwitchElement from "@app/modules/components/element/SwitchElement";

// const { width } = Dimensions.get('window');
// const sliderWidth = width - Metrics.medium * 4;

const WarningSetting = ({ }) => {

  const { isDarkTheme, applyTheme } = useTheme();
  const { isPortrait, dimensions } = useOrientation();
  const settingScreenStyle = createSettingScreenStyle(isDarkTheme);
  const Colors = Themes[isDarkTheme ? 'darkMode' : 'lightMode'];
  const { setVolumeRadio } = useContext(RadioContext);

  const navigation = useNavigation();

  const [volume, setVolume] = useState(10);
  const [soundSystemId, setSoundSystemId] = useState('1');
  const [themeId, setThemeId] = useState('2');
  const [isLog, setIsLog] = useState(false);
  const [isAlert, setIsAlert] = useState(false);

  useEffect(async () => {

    let volumeValue = await storage.get('volume');
    let soundSystemValue = await storage.get('soundSystem');
    let themeValue = await storage.get('theme');
    let logValue = await storage.get('log');
    if (volumeValue) { setVolume(volumeValue) };
    if (logValue) { setIsLog(!!(logValue + 1)) }
    if (soundSystemValue) {
      const item = soundSystems.find(sound => sound.value === soundSystemValue);
      setSoundSystemId(item.id);
    };
    if (themeValue) {
      const item = themes.find(theme => theme.value === themeValue);
      setThemeId(item.id);
    };

    // Lắng nghe sự thay đổi âm lượng hệ thống
    // const listener = SystemSetting.addVolumeListener((data) => {
    //   if (data) {
    //     console.log("----------------Âm lượng --------:", data);
    //     setVolume(Math.round(data.value * 10));
    //   }
    // });

    return () => {
      // SystemSetting.removeVolumeListener(listener); // Gỡ bỏ listener khi component unmount
    };
  }, []);

  const getSoundSystems = () => {
    return [
      {
        id: '1', // acts as primary key, should be unique and non-empty string
        label: i18n.t(`setting.soundSystem.music`),
        value: 'music',
        color: soundSystemId === '1' ? Colors.blueText : Colors.textGrey,
        size: Metrics.tiny * 5,
        borderSize: 1,
      },
      {
        id: '2',
        label: i18n.t(`setting.soundSystem.system`),
        value: 'system',
        color: soundSystemId === '2' ? Colors.blueText : Colors.textGrey,
        size: Metrics.tiny * 5,
        borderSize: 1,
      },
      {
        id: '3',
        label: i18n.t(`setting.soundSystem.alarm`),
        value: 'alarm',
        color: soundSystemId === '3' ? Colors.blueText : Colors.textGrey,
        size: Metrics.tiny * 5,
        borderSize: 1,
      },
      {
        id: '4',
        label: i18n.t(`setting.soundSystem.announcement`),
        value: 'announcement',
        color: soundSystemId === '4' ? Colors.blueText : Colors.textGrey,
        size: Metrics.tiny * 5,
        borderSize: 1,
      },
      {
        id: '5',
        label: i18n.t(`setting.soundSystem.alarmBell`),
        value: 'alarmBell',
        color: soundSystemId === '5' ? Colors.blueText : Colors.textGrey,
        size: Metrics.tiny * 5,
        borderSize: 1,
      }
    ]
  };

  const soundSystems = useMemo(getSoundSystems, [soundSystemId]);

  const getThemes = () => {
    return [
      {
        id: '1', // acts as primary key, should be unique and non-empty string
        label: i18n.t(`setting.theme.auto`),
        value: 'auto',
        color: themeId === '1' ? Colors.blueText : Colors.textGrey,
        size: Metrics.tiny * 5,
        borderSize: 1,
      },
      {
        id: '2',
        label: i18n.t(`setting.theme.light`),
        value: 'light',
        color: themeId === '2' ? Colors.blueText : Colors.textGrey,
        size: Metrics.tiny * 5,
        borderSize: 1,
      },
      {
        id: '3',
        label: i18n.t(`setting.theme.dark`),
        value: 'dark',
        color: themeId === '3' ? Colors.blueText : Colors.textGrey,
        size: Metrics.tiny * 5,
        borderSize: 1,
      }
    ]
  };

  const themes = useMemo(getThemes, [themeId]);

  const handleSetDefaulValue = () => {
    setVolume(10);
    setSoundSystemId('1');
    setThemeId('2');
    setIsLog(false);
    storage.set('volume', 10);
    storage.set('soundSystem', 'music');
    storage.set('theme', 'light');
    applyTheme('light');
    storage.set('log', -1);
    setIsAlert(true);
  };

  const handleCloseSystem = async () => {
    // let volumeValue = await storage.get('volume');
    // SystemSetting.setVolume(volumeValue / 10);
  };


  const handleSave = useCallback(() => {
    storage.set('log', isLog);
    storage.set('volume', volume);
    setVolumeRadio(volume * 0.1);

    let themeSelected = themes.find(theme => theme.id === themeId);
    if (themeSelected) {
      storage.set('theme', themeSelected.value);
      applyTheme(themeSelected.value);
    }

    let soundSystemSelected = soundSystems.find(sound => sound.id === soundSystemId);
    if (soundSystemSelected) {
      storage.set('soundSystem', soundSystemSelected.value);
    }
    setIsAlert(true);
  }, [isLog, volume, themeId, soundSystemId]);

  const handleCancel = useCallback(async () => {
    let volumeValue = await storage.get('volume');
    // SystemSetting.setVolume(volumeValue / 10);
    navigation.navigate('Overview');
  }, []);

  const closeAlert = useCallback(() => {
    setIsAlert(false);
  }, []);

  const handleOnValueChange = useCallback((field, value) => {
    switch (field) {
      case 'volume':
        // SystemSetting.setVolume(value / 10);
        setVolumeRadio(value * 0.1);
        setVolume(value);
        break;
      case 'soundSystem':
        setSoundSystemId(value);
        break;
      case 'theme':
        setThemeId(value);
        break;
    }
  }, []);


  const renderVolume = useCallback((field, value, min, max, step, unit) => (
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


  const renderSoundSystem = useCallback(() => (
    <RadioElement
      data={soundSystems}
      fieldName={'soundSystem'}
      selectedId={soundSystemId}
      handleOnValueChange={handleOnValueChange}
    />
  ), [soundSystemId]);

  const renderTheme = () => (
    <RadioElement
      data={themes}
      fieldName={'theme'}
      selectedId={themeId}
      handleOnValueChange={handleOnValueChange}
    />
  );


  const renderLogSetting = useCallback(() => {
    return (
      <View style={[settingScreenStyle.settingElement, settingScreenStyle.logSetting]}>
        <Text style={settingScreenStyle.title}>{i18n.t(`setting.attributes.log`)}</Text>
        <SwitchElement
          onValueChange={() => setIsLog(prev => !prev)}
          value={isLog}
          barWidth={Metrics.small * 5}
          barHeight={Metrics.icon}
          innerCircleSize={Metrics.regular}
        />
      </View>
    )
  }, [isLog]);

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
            <SettingHeader closeSystem={handleCloseSystem} settingName={'system'} setDefaulValue={handleSetDefaulValue} />
            <ScrollView>
              <View style={[
                settingScreenStyle.settingContent,
                { paddingHorizontal: (!isPortrait && Platform.OS === 'ios') ? insets.left : Metrics.medium }
              ]}>
                {renderVolume('volume', volume, 0, 10, 1)}
                <View style={settingScreenStyle.line}></View>
                {/*{renderSoundSystem()}
        <View style={settingScreenStyle.line}></View> */}
                {renderTheme()}
                {/* <View style={settingScreenStyle.line}></View> */}
                {/* {renderLogSetting()} */}
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