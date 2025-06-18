import React, { useCallback, useEffect, useState } from "react";
import {
  Alert,
  Platform,
  ScrollView,
  View,
} from "react-native";
import storage from "@app/libs/storage";
import SettingHeader from "../component/SettingHeader";
import { useNavigation } from "@react-navigation/native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import i18n from "@app/i18n/i18n";
import SettingFooter from "../component/SettingFooter";
import createSettingScreenStyle from "../SettingScreenStyles";
import { useTheme } from "@app/modules/components/context/ThemeContext";
import AlertError from "@app/modules/components/alert/AlertError/AlertError";
import { SafeAreaInsetsContext, SafeAreaView } from "react-native-safe-area-context";
import { useOrientation } from "@app/modules/components/context/OrientationContext";
import SmoothSliderElement from "@app/modules/components/element/SmoothSliderElement";

const MapDisplaySetting = () => {

  const { isDarkTheme, applyTheme } = useTheme();
  const { isPortrait } = useOrientation();
  const settingScreenStyle = createSettingScreenStyle(isDarkTheme);

  const navigation = useNavigation();

  const [gpsSpeed, setGpsSpeed] = useState(7);
  const [zoomLevel, setZoomLevel] = useState(2100);
  const [mapTilt, setMapTilt] = useState(45);
  const [backPosTime, setBackPosTime] = useState(30);
  const [isAlert, setIsAlert] = useState(false);

  useEffect(async () => {
    let gpsSpeedValue = await storage.get('gpsSpeed');
    let zoomLevelValue = await storage.get('zoomLevel');
    let mapTiltValue = await storage.get('mapTilt');
    let backPosTimeValue = await storage.get('backPosTime');
    if (gpsSpeedValue) { setGpsSpeed(gpsSpeedValue) };

    if (zoomLevelValue) { setZoomLevel(zoomLevelValue) };

    if (mapTiltValue) { setMapTilt(mapTiltValue) };

    if (backPosTimeValue) { setBackPosTime(backPosTimeValue) };
  }, [])


  const handleSetDefaulValue = useCallback(() => {
    setGpsSpeed(7);
    setZoomLevel(2100);
    setMapTilt(45);
    setBackPosTime(30);
    storage.set('gpsSpeed', 7);
    storage.set('zoomLevel', 2100);
    storage.set('mapTilt', 45);
    storage.set('backPosTime', 30);
    Alert.alert('', i18n.t(`setting.attributes.success`));
  }, [])


  const handleSave = useCallback(() => {
    storage.set('gpsSpeed', gpsSpeed);
    storage.set('zoomLevel', zoomLevel);
    storage.set('mapTilt', mapTilt);
    storage.set('backPosTime', backPosTime);
    Alert.alert('', i18n.t(`setting.attributes.success`), [
      { text: 'OK', onPress: () => navigation.navigate('Overview') },
    ]);
  }, [gpsSpeed, zoomLevel, mapTilt, backPosTime]);

  const handleCancel = useCallback(async () => {
    navigation.navigate('Overview');

  }, []);

  const handleOnValueChange = useCallback((field, value) => {
    switch (field) {
      case 'gpsSpeed':
        setGpsSpeed(value);
        break;
      case 'zoomLevel':
        setZoomLevel(value);
        break;
      case 'mapTilt':
        setMapTilt(value);
        break;
      case 'backPosTime':
        setBackPosTime(value);
        break;
    }
  }, []);

  const closeAlert = useCallback(() => {
    setIsAlert(false);
  }, []);

  const renderSettingElement = useCallback((field, value, min, max, step, unit) => (
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
            <SettingHeader settingName={'mapDisplay'} setDefaulValue={handleSetDefaulValue} />
            <ScrollView>
              <View style={[
                settingScreenStyle.settingContent,
                { paddingHorizontal: (!isPortrait && Platform.OS === 'ios') ? insets.left : Metrics.medium }
              ]}>
                {renderSettingElement('gpsSpeed', gpsSpeed, 0, 10, 1, 'kilomet')}
                <View style={settingScreenStyle.line}></View>
                {renderSettingElement('zoomLevel', zoomLevel, 500, 5000, 500, 'met')}
                <View style={settingScreenStyle.line}></View>
                {renderSettingElement('mapTilt', mapTilt, 40, 80, 5, 'degree')}
                <View style={settingScreenStyle.line}></View>
                {renderSettingElement('backPosTime', backPosTime, 3, 30, 3, 'second')}
                <View style={settingScreenStyle.line}></View>
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

export default MapDisplaySetting;