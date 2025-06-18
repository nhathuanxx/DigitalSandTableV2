import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Image,
  Text,
  TouchableOpacity,
  View,
  Pressable,
  FlatList,
  ActivityIndicator
} from "react-native";
import { Images, Colors as Themes } from "@app/theme";
import i18n from "@app/i18n/i18n";
import { useTheme } from "@app/modules/components/context/ThemeContext";
import createStyles from "./styles";


const AlertConfirm = ({ title, body, iconSoucre, handleCofirm, handleCancel }) => {
  const { isDarkTheme } = useTheme();
  const styles = createStyles(isDarkTheme);
  const Colors = Themes[isDarkTheme ? 'darkMode' : 'lightMode'];



  return (
    <Pressable
      style={styles.container}
    >
      <Pressable style={styles.content} onPress={(e) => e.stopPropagation()}>
        <View style={styles.body}>
          <Image source={iconSoucre} style={styles.iconStyle} />
          <Text style={styles.title}>{title.toUpperCase()}</Text>
          <Text style={styles.question}>{body}</Text>
        </View>
        <View style={styles.footer}>
          <TouchableOpacity style={styles.btn} onPress={handleCofirm}>
            <Text style={styles.btnText}>{i18n.t("account.alert.confirm")}</Text>
          </TouchableOpacity>
          <View style={styles.distanceView}></View>
          <TouchableOpacity style={[styles.btn, styles.btnCancel]} onPress={handleCancel}>
            <Text style={styles.btnText}>{i18n.t("account.alert.cancel")}</Text>
          </TouchableOpacity>
        </View>
      </Pressable>
    </Pressable>
  );

};


export default React.memo(AlertConfirm);