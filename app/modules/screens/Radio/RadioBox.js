import React, { Fragment, useState, useRef, useEffect, useContext, useCallback } from "react";
import {
  ActivityIndicator,
  BackHandler,
  Image,
  Platform,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { Images, Colors as Themes, Metrics } from "@app/theme";
import i18n from "@app/i18n/i18n";
import Header from "./Header";
import { CHANNELS } from "@app/config/channels";
import storage from "@app/libs/storage";
import Animated, { FadeOut, SlideInUp, SlideOutUp } from "react-native-reanimated";
import { RadioContext } from "./RadioProvider";
import { useTheme } from "@app/modules/components/context/ThemeContext";
import createStyles from "./styles";
import { SafeAreaInsetsContext, SafeAreaView } from "react-native-safe-area-context";
import { useOrientation } from "@app/modules/components/context/OrientationContext";

const RadioBox = ({ handleCloseRadio, handleShowChannelList }) => {
  console.log('render radio box ----------');
  const { isDarkTheme } = useTheme();
  const Colors = Themes[isDarkTheme ? 'darkMode' : 'lightMode'];
  const { isPortrait, dimensions } = useOrientation();
  const styles = createStyles(isDarkTheme, dimensions.width, dimensions.height);

  const { playRadio, stopRadio, isPlaying, isLoad } = useContext(RadioContext);
  const [channel, setChannel] = useState(CHANNELS[0]);

  useEffect(async () => {
    let chan = await storage.get('radioChannel');
    if (chan) {
      setChannel(chan);
    } else {
      storage.set('radioChannel', channel);
    }

    const backAction = () => {
      handleCloseRadio();
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

  const handleClose = () => {
    handleCloseRadio();
  }

  const handlePlayRadio = () => {
    playRadio(channel.url);
  };

  const handlePauseRadio = () => {
    stopRadio();
  }

  const handleShowList = () => {
    handleShowChannelList(true);
  }
  const handleOnNext = useCallback(() => {
    let index = getChannelIndex(channel);
    const chan = CHANNELS[index + 1 === CHANNELS.length ? 0 : index + 1];
    setChannel(chan);
    playRadio(chan.url);
    storage.set('radioChannel', chan);
  }, [channel]);

  const handleOnPrev = useCallback(() => {
    let index = getChannelIndex(channel);
    const chan = CHANNELS[index - 1 < 0 ? CHANNELS.length - 1 : index - 1];
    setChannel(chan);
    playRadio(chan.url);
    storage.set('radioChannel', chan)
  }, [channel])

  const renderPlayer = useCallback(() => {
    return (
      <View style={styles.playerArea}>
        <TouchableOpacity
          onPress={handleOnPrev}
          style={styles.btnSwitch}
        >
          <Image style={styles.iconStyle} source={Images.icPrev} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.btnPlay}
          onPress={isPlaying ? handlePauseRadio : handlePlayRadio}
        >
          {isLoad ? (<ActivityIndicator color={Colors.white} size='large' />) : (
            <Image style={[styles.iconStyle, !isPlaying ? styles.icPlay : {}]}
              source={isPlaying ? Images.icPause : Images.icPlay}
            />
          )}
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleOnNext}
          style={styles.btnSwitch}
        >
          <Image style={styles.iconStyle} source={Images.icNext} />
        </TouchableOpacity>
      </View>
    )
  }, [isLoad, isPlaying])

  const renderRadioArea = useCallback(() => {
    return (
      <View>
        <View style={styles.RadioArea}>
          <Text style={styles.titleChannel}>{i18n.t(`radio.attributes.${channel.nameChannel}`)}</Text>
          <Text style={styles.desc}>{i18n.t("radio.attributes.radioOnline")}</Text>
          {renderPlayer()}
        </View>
        <View style={styles.line}></View>
      </View>
    )
  }, [channel, renderPlayer])

  const renderFooter = useCallback(() => {
    return (
      <View style={styles.footer}>
        <TouchableOpacity style={styles.btnShowList}
          onPress={handleShowList}
        >
          <View style={styles.iconBtnShowList}>
            <Image style={[styles.iconSmall]} source={Images.ic_whiteArrow} />
          </View>
          <Text style={styles.textBtnShowList}>{i18n.t("radio.attributes.channelList")}</Text>
        </TouchableOpacity>
      </View>
    )
  }, [])

  return (
    <SafeAreaInsetsContext.Consumer>
      {(insets) => (
        <>
          <Animated.View
            style={[styles.container,
            {
              paddingTop: (!isPortrait && Platform.OS === 'ios') ? Metrics.normal : insets.top,
              paddingHorizontal: (!isPortrait && Platform.OS === 'ios') ? insets.left : Metrics.regular
            }
            ]}
            entering={SlideInUp.duration(300)
              .springify()
              .damping(20)
            }
            exiting={SlideOutUp}
          >
            <View style={styles.content}>
              <Header typeComponent={true} nameChannel={channel.nameChannel} />
              {renderRadioArea()}
              {renderFooter()}
            </View>

            <TouchableOpacity style={styles.btnClose}
              onPress={handleClose}>
              <View>
                <Image style={styles.iconCloseBox}
                  source={Images.icArrowUp}
                />
              </View>
            </TouchableOpacity>
          </Animated.View>
        </>
      )}
    </SafeAreaInsetsContext.Consumer >
  );

}

export default React.memo(RadioBox);