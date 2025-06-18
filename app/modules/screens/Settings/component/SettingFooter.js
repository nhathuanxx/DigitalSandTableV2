import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Platform,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import i18n from "@app/i18n/i18n";
import { useTheme } from "@app/modules/components/context/ThemeContext";
import createStyles from './styles';
import { SafeAreaInsetsContext, SafeAreaView } from "react-native-safe-area-context";
import { Images, Metrics } from "@app/theme";
import { useOrientation } from "@app/modules/components/context/OrientationContext";

const SettingFooter = ({ handleSave, handleCancel }) => {

  const { isDarkTheme } = useTheme();
  const { isPortrait } = useOrientation();
  const styles = createStyles(isDarkTheme);

  return (
    <SafeAreaInsetsContext.Consumer>
      {(insets) => (
        <View
          style={[
            styles.footerSetting,
            {
              paddingBottom: Platform.OS === 'ios' ? insets.bottom : Metrics.medium,
              paddingHorizontal: (!isPortrait && Platform.OS === 'ios') ? insets.left : Metrics.medium
            }
          ]}
        >
          <TouchableOpacity
            style={[styles.btnAction, styles.btnCancel]}
            onPress={handleCancel}
          >
            <Text style={styles.btnCancelText}>{i18n.t(`setting.attributes.cancel`)}</Text>
          </TouchableOpacity>
          <View style={styles.distanceView}></View>
          <TouchableOpacity
            onPress={handleSave}
            style={styles.btnAction}
          >
            <Text style={styles.btnSaveText}>{i18n.t(`setting.attributes.save`)}</Text>
          </TouchableOpacity>
        </View>
      )
      }
    </SafeAreaInsetsContext.Consumer >
  );
}

export default SettingFooter;