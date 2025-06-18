import React, { useState, useCallback } from "react";
import RadioBox from "./RadioBox";
import ChannelList from "./ChannelList";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import { Pressable, View } from "react-native";
import { useTheme } from "@app/modules/components/context/ThemeContext";
import createStyles from "./styles";
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const Radio = ({ handleCloseRadio, handleSetStatusRadio }) => {

  const { isDarkTheme } = useTheme();
  const styles = createStyles(isDarkTheme);

  const [isChannelList, setIsChannelList] = useState(false);

  const handleClose = useCallback((isPlay) => {
    handleCloseRadio(isPlay);
  }, []);

  const handleShowChannelList = useCallback((status) => {
    setIsChannelList(status);
  }, [])

  const renderRadioBox = () => (
    <RadioBox
      handleCloseRadio={handleClose}
      handleShowChannelList={handleShowChannelList}
    />
  )
  const renderChannelList = () => (
    <ChannelList
      handleShowChannelList={handleShowChannelList}
    />
  )

  return (
    <View style={styles.containerRadio}>
      <AnimatedPressable
        style={styles.background}
        onPress={() => handleClose()}
        entering={FadeIn}
        exiting={FadeOut}
      />
      {isChannelList ? renderChannelList() : renderRadioBox()}
    </View>
  );

}

export default React.memo(Radio);