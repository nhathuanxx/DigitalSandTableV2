import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Metrics, Colors as Themes, } from "@app/theme";
import { useTheme } from "@app/modules/components/context/ThemeContext";
import createStyles from "./styles";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';

const SwitchElement = ({ value, onValueChange, barWidth, barHeight, innerCircleSize }) => {

  const { isDarkTheme } = useTheme();
  const styles = createStyles(isDarkTheme);
  const Colors = Themes[isDarkTheme ? 'darkMode' : 'lightMode'];

  const [isToggled, setIsToggled] = useState(value);

  useEffect(() => {
    translationX.value = withTiming(value ? (barWidth - innerCircleSize - 3) : 1, { duration: 300 });
    setIsToggled(value);
  }, [value]);

  // Shared Value để điều khiển vị trí của innerCircle
  const translationX = useSharedValue(value ? (barWidth - innerCircleSize - 3) : 1);

  // Animated Style cho innerCircle
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateX: translationX.value,
      },
    ],
  }));

  const toggleSwitch = () => {
    setIsToggled((prev) => !prev);
    translationX.value = withTiming(isToggled ? 1 : (barWidth - innerCircleSize - 3), { duration: 200 });
    onValueChange((prev) => !prev);
  };


  return (
    <TouchableOpacity
      onPress={toggleSwitch}
      style={[
        styles.switchContainer,
        {
          backgroundColor: isToggled ? Colors.blueText : Colors.background,
          borderColor: isToggled ? Colors.blueText : Colors.border,
          width: barWidth,
          height: barHeight
        }
      ]}>
      <Animated.View style={[
        styles.innerCirle, animatedStyle,
        { backgroundColor: isToggled ? Colors.white : Colors.blueText }
      ]} />
    </TouchableOpacity>
  )

}

export default React.memo(SwitchElement);