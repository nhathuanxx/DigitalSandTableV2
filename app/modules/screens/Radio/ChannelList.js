import React, { Fragment, useState, useRef, useEffect, useContext, memo, useMemo } from "react";
import {
  BackHandler,
  Dimensions,
  Image,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { Images, Metrics } from "@app/theme";
import i18n from "@app/i18n/i18n";
import Header from "./Header";
import { CHANNELS } from "@app/config/channels";
import storage from "@app/libs/storage";
import Animated, { Easing, FadeIn, FadeOut, SlideInUp, SlideOutUp } from "react-native-reanimated";
import { RadioContext } from "./RadioProvider";
import { useTheme } from "@app/modules/components/context/ThemeContext";
import createStyles from "./styles";
import { SafeAreaInsetsContext, SafeAreaView } from "react-native-safe-area-context";
import { useOrientation } from "@app/modules/components/context/OrientationContext";

const ChannelList = ({ handleShowChannelList }) => {

  const { isDarkTheme } = useTheme();

  const { playRadio, stopRadio, isPlaying, isLoading } = useContext(RadioContext);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [widthItem, setWidthItem] = useState(0);
  const { isPortrait, dimensions } = useOrientation();
  const styles = createStyles(isDarkTheme, dimensions.width, dimensions.height);

  const getChannel = async () => {
    let chan = await storage.get('radioChannel');
    if (chan) {
      setSelectedIndex(getChannelIndex(chan));
    }
  }

  useEffect(() => {
    getChannel();
    const backAction = () => {
      handleShowChannelList(false);
      return true;
    };

    // Đăng ký sự kiện back
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => {
      backHandler.remove();
    };

  }, [])

  const getChannelIndex = (chan) => {
    const index = CHANNELS.findIndex(channel =>
      channel.nameChannel === chan.nameChannel &&
      channel.url === chan.url
    );
    return index;
  }

  const handleOnClose = () => {
    handleShowChannelList(false);
  }

  const handleSelectChannel = (index, channel) => {
    setSelectedIndex(index);
    storage.set('radioChannel', channel);
    playRadio(channel.url);
    handleShowChannelList(false);
  }

  const onLayout = (event) => {
    const { width } = event.nativeEvent.layout;
    setWidthItem(width);
  }

  const renderChannel = (channel, index) => {
    const isSelected = index === selectedIndex;
    return (
      <TouchableOpacity
        style={styles.channelItem}
        key={index}
        onPress={() => handleSelectChannel(index, channel)}
        onLayout={index === 1 ? onLayout : () => { }}
      >
        <View
          style={[
            styles.channelImageBox,
            isSelected ? styles.selectedChannelImage : {}]}
        >
          <Image style={styles.channelImage}
            source={Images[channel.nameChannel]}
            resizeMode='contain'
          />
        </View>
        <Text
          style={[
            styles.channelName,
            isSelected ? styles.selectedChannelName : {}]}
        >
          {i18n.t(`radio.attributes.${channel.nameChannel}`)}
        </Text>
      </TouchableOpacity>
    )
  };

  const getRemainingItems = () => {
    const itemsPerRow = Math.floor((dimensions.width - Metrics.large) / widthItem);
    return itemsPerRow - (CHANNELS.length % itemsPerRow);
  }

  return (

    <SafeAreaInsetsContext.Consumer>
      {(insets) => (
        <>
          <Animated.View
            style={[styles.container, styles.containerList,
            {
              paddingTop: (!isPortrait && Platform.OS === 'ios') ? Metrics.normal : insets.top,
              paddingHorizontal: (!isPortrait && Platform.OS === 'ios') ? insets.left : Metrics.regular
            }
            ]}
            entering={SlideInUp.duration(300).springify().damping(20)}
            exiting={FadeOut.duration(300)}
          >

            <Header typeComponent={false}
              handleClickRightHeader={handleOnClose}
            />
            <ScrollView>
              <View style={[styles.contentList]}>
                {CHANNELS.map((channel, index) => (
                  renderChannel(channel, index)
                )
                )}
                {widthItem > 0 && Array.from({ length: getRemainingItems() }).map((_, index) => (
                  <View key={`filler-${index}`} style={{ width: widthItem, height: 0, opacity: 0 }} />
                ))}
              </View>
            </ScrollView>
          </Animated.View>
        </>
      )}
    </SafeAreaInsetsContext.Consumer >
  )
}

export default ChannelList