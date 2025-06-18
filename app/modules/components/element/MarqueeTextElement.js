import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Image,
  Modal,
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { Metrics, Images, Colors as Themes } from "@app/theme";
import i18n from "@app/i18n/i18n";
import storage from "@app/libs/storage";
import { useTheme } from "@app/modules/components/context/ThemeContext";
import createStyles from "./styles";
import { useOrientation } from "@app/modules/components/context/OrientationContext";
import Animated, {
  useAnimatedStyle,
  withTiming,
  withRepeat,
  useSharedValue
} from "react-native-reanimated";

const MarqueeTextElement = ({ children, width }) => {

  const { isDarkTheme } = useTheme();
  const { isPortrait, dimensions } = useOrientation();
  const styles = createStyles(isDarkTheme, dimensions.width, dimensions.height);
  const Colors = Themes[isDarkTheme ? 'darkMode' : 'lightMode'];


  const translateX = useSharedValue(width); // Bắt đầu từ bên trái

  useEffect(() => {
    translateX.value = withRepeat(
      withTiming(-String(children).length * 8, {
        duration: 4000,
      }),
      -1, // Lặp vô hạn
      false // Không đảo ngược
    );
    // }

  }, [String(children).length]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }]
    };
  });

  return (
    <View
      style={{ width: width, overflow: 'hidden' }}
    >
      <Animated.Text
        style={[styles.marqueeText, animatedStyle]}
      >
        {children}
      </Animated.Text>
    </View>
  );

}

export default React.memo(MarqueeTextElement);