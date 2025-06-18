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
import { Images, Metrics } from "@app/theme";
import { useTheme } from "@app/modules/components/context/ThemeContext";
import createStyles from "./styles";
import { useOrientation } from "@app/modules/components/context/OrientationContext";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  withDelay,
  withSequence,
} from 'react-native-reanimated';


const AnimatedVoice = ({ }) => {
  const { isDarkTheme } = useTheme();
  const { isPortrait, dimensions } = useOrientation();
  const styles = isPortrait ? createStyles(isDarkTheme, dimensions.width, dimensions.height) : createHorizontalStyles(isDarkTheme, dimensions.width, dimensions.height);

  const wave1Size = useSharedValue(Metrics.regular * 3);
  const wave2Size = useSharedValue(Metrics.regular * 3);

  const wave1Opacity = useSharedValue(1);
  const wave2Opacity = useSharedValue(1);

  useEffect(() => {
    const animatedSize = withRepeat(
      withSequence(
        withTiming(Metrics.regular * 5, { duration: 1400 }),
        withTiming(Metrics.regular * 3, { duration: 200 })
      ),
      -1,
      false
    );

    const animatedOpacity = withRepeat(
      withSequence(
        withTiming(0, { duration: 1400 }),
        withTiming(0, { duration: 200 })
      ),
      -1,
      false
    );

    wave2Size.value = withDelay(600, animatedSize);
    wave2Opacity.value = withDelay(600, animatedOpacity);
    wave1Size.value = animatedSize;
    wave1Opacity.value = animatedOpacity;
  }, []);

  const animatedVoiceStyle = (size, opacity) => useAnimatedStyle(() => ({
    width: size.value,
    height: size.value,
    opacity: size.value === Metrics.regular * 5 ? 0 : opacity.value
  }));

  return (
    <View style={styles.viewVoice}>
      <Animated.View style={[styles.animatedVoiceStyle, animatedVoiceStyle(wave1Size, wave1Opacity)]} />
      <Animated.View style={[styles.animatedVoiceStyle, animatedVoiceStyle(wave2Size, wave2Opacity)]} />
      <View style={[styles.animatedVoiceStyle, styles.viewOrigin]} />
      <Image source={Images.voice} style={styles.voiceIcon} />
    </View>
  )

};


export default React.memo(AnimatedVoice);