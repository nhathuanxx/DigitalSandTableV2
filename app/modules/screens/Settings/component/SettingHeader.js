import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Image,
  Text,
  TouchableOpacity,
  View,
  Pressable,
  FlatList,
  Platform
} from "react-native";
import { Images, Metrics } from "@app/theme";
import i18n from "@app/i18n/i18n";
import Animated, { SlideInUp, SlideInDown, SlideOutDown, FadeIn, FadeOut, SlideInLeft } from "react-native-reanimated";
import storage from "@app/libs/storage";
import { useNavigation } from "@react-navigation/native";
import { useTheme } from "@app/modules/components/context/ThemeContext";
import createStyles from "./styles";
import { SafeAreaInsetsContext, SafeAreaView } from "react-native-safe-area-context";
import { useOrientation } from "@app/modules/components/context/OrientationContext";

const SettingHeader = ({ settingName, setDefaulValue, closeSystem }) => {

  const { isDarkTheme } = useTheme();
  const styles = createStyles(isDarkTheme);
  const { isPortrait } = useOrientation();
  const navigation = useNavigation();

  const handleClose = () => {
    switch (settingName) {
      case 'mapDisplay':
        navigation.navigate('Overview');
        break;
      case 'warning':
        navigation.navigate('Overview');
        break;
      case 'system':
        // closeSystem();
        navigation.navigate('Overview');
        break;
    }
  }

  const handlSetDefaulValue = () => {
    setDefaulValue();
  }

  return (
    <SafeAreaInsetsContext.Consumer>
      {(insets) => (
        <View style={[
          styles.headerSetting,
          {
            paddingTop: (!isPortrait && Platform.OS === 'ios') ? Metrics.small : insets.top,
            paddingHorizontal: (!isPortrait && Platform.OS === 'ios') ? (insets.left - Metrics.medium) : 0
          }
        ]}>
          <TouchableOpacity
            style={styles.btnClose}
            onPress={handleClose}
          >
            <Image source={Images.blackClose} style={styles.icClose} />
          </TouchableOpacity>
          <Text style={styles.settingName}>{i18n.t(`setting.attributes.${settingName}`)}</Text>
          <TouchableOpacity
            onPress={handlSetDefaulValue}
            style={styles.btnDefault}
          >
            <Text style={styles.btnDefaultText}>{i18n.t(`setting.attributes.default`).toUpperCase()}</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaInsetsContext.Consumer >
  );
}

export default SettingHeader;