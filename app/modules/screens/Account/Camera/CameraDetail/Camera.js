import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Pressable, View, ActivityIndicator, TouchableOpacity, Image, Text, AppState, Platform } from 'react-native';
import Video from 'react-native-video';
import ViewShot from 'react-native-view-shot';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import { Images, Colors as Themes, Metrics } from "@app/theme";
import createStyles from "./styles";
import { useTheme } from "@app/modules/components/context/ThemeContext";
import ImageWithFallback from '../ImageWithFallback ';
import { IMAGE_URL, YOUTUBE_URL, STREAM_URL, RTSP_URL } from '@app/config/camera';
import i18n from "@app/i18n/i18n";
import RNFS from 'react-native-fs';
import { VLCPlayer, VlCPlayerView } from 'react-native-vlc-media-player';
import { check, PERMISSIONS, request, RESULTS } from 'react-native-permissions';
import { useOrientation } from "@app/modules/components/context/OrientationContext";
import YouTubePlayer from '@app/modules/screens/Account/Component/YoutubePlayer';

const Camera = (props) => {

  const { isDarkTheme } = useTheme();
  const { isPortrait, dimensions } = useOrientation();
  const styles = createStyles(isDarkTheme, dimensions.width, dimensions.height);
  const Colors = Themes[isDarkTheme ? 'darkMode' : 'lightMode'];

  const [count, setCount] = useState(1);
  const [isLoadCamera, setIsLoadCamera] = useState(true);
  const [isControl, setIsControl] = useState(false);
  const [timestamp, setTimestamp] = useState(Date.now);
  const [isError, setIsError] = useState(false);
  const [logIOS, setLogIOS] = useState(undefined);
  const viewShotRef = useRef(null);

  useEffect(() => {
    // console.log('url type ------------', props.urlType)
    if (props.camera && props.urlType === IMAGE_URL) {
      const intervalCount = setInterval(() => {
        setCount(prevCount => (prevCount === 12 ? 1 : prevCount + 1));
      }, 1000);

      return () => {
        clearInterval(intervalCount);
        setCount(1);
        // clearInterval(interval);
      };
    }
  }, [props.camera, AppState.currentState])

  useEffect(() => {
    if (props.camera && props.urlType === IMAGE_URL && count === 12) {
      console.log('set timestmap -----------------------------');
      setTimestamp(Date.now());
    }
  }, [count])

  useEffect(() => {
    if (isControl) {
      const timer = setTimeout(() => {
        setIsControl(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [isControl]);

  const saveToPhone = useCallback(async (uri) => {
    try {
      let directoryPath;
      if (Platform.OS === 'android') {
        // Android path
        directoryPath = `${RNFS.PicturesDirectoryPath}/Screenshots`;

        if (Platform.Version < 29) {
          const permissionStatus = await check(PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE);

          if (permissionStatus !== RESULTS.GRANTED) {
            // If permission not granted, request permission
            const granted = await request(PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE);
            if (granted !== RESULTS.GRANTED) {
              console.log('Storage permission denied');
              // props.handleAlertCapture();
              return;
            }
          }
        }
      } else {
        // iOS path
        directoryPath = `${RNFS.DocumentDirectoryPath}/Screenshots`;

        // Optional: Ask for photo library access if needed
        const permission = await check(PERMISSIONS.IOS.PHOTO_LIBRARY_ADD_ONLY);
        if (permission !== RESULTS.GRANTED) {
          const requestResult = await request(PERMISSIONS.IOS.PHOTO_LIBRARY_ADD_ONLY);
          if (requestResult !== RESULTS.GRANTED) {
            console.log('Photo library access denied');
            props.handleAlertCapture(i18n.t(`account.camera.errorPermission`));
            return;
          }
        }
      }

      const path = `${directoryPath}/sc${Date.now().toString()}.jpg`;

      const directoryExists = await RNFS.exists(directoryPath);
      if (!directoryExists) {
        await RNFS.mkdir(directoryPath);
      }

      await RNFS.moveFile(uri, path);
      // console.log('Image saved to', path);
      setLogIOS('Image saved');

      props.handleAlertCapture(path.replace(/^.*?\/Pictures/, '/Pictures'));
    } catch (error) {
      setLogIOS(`Error saving image: ${error}`);
    }
  }, []);

  const captureImage = useCallback(() => {
    setLogIOS(`ios capture:  ---`);
    viewShotRef.current.capture().then(uri => {
      console.log('Captured image URI:', uri);
      // setLogIOS(`ios capture:  ${uri}`);
      saveToPhone(uri);
    }).catch(error => {
      console.log('Error capturing image:', error);
    });
  }, [viewShotRef]);

  const renderCounter = () => (
    <AnimatedCircularProgress
      size={Metrics.large}
      width={Metrics.tiny}
      fill={(count / 12) * 100}
      tintColor={Colors.white}
      style={styles.counter}
    >
      {() => <Text style={styles.countText}>{count}</Text>}
    </AnimatedCircularProgress>
  );

  const imageSource = useMemo(() => (`${props.camera.link}?t=${timestamp}`), [props.camera, timestamp]);
  const headers = useMemo(() => props.camera.authorization ? { Authorization: props.camera.authorization } : undefined, [props.camera]);

  return (
    <Pressable style={props.isFullScreen ? styles.videoFullScreen : styles.videoArea} onPress={() => setIsControl(prev => !prev)}>
      <ViewShot ref={viewShotRef} options={{ format: 'jpg', quality: 0.9 }}>
        {props.urlType === IMAGE_URL ? (
          <View style={styles.viewCameraImage}>
            <ImageWithFallback
              ImageSource={imageSource}
              style={styles.video}
              fallbackSource={Images.noCamera}
              onLoad={(status) => setIsLoadCamera(status)}
            />
            {renderCounter()}
          </View>
        ) : props.urlType === STREAM_URL ? (
          <Video
            source={{
              uri: props.camera.link,
              // uri: 'https://cto.mekongsmartcam.vn/edge/stream-signed-1/Ui6WB5lzi64grkh1tCsFg3WkdTxtCh/hls/f8FauwTdAT/PCn45X5hvYT8AaVA6Wpsx4sYyuuT6TJt/s.m3u8',
              headers: headers
            }}
            style={styles.video}
            controls={false}
            onLoadStart={() => {
              setIsError(false);
              setIsLoadCamera(true);
            }}
            onBuffer={() => setIsLoadCamera(true)}
            onLoad={() => setIsLoadCamera(false)}
            resizeMode="contain"
            onError={(error) => {
              console.log('Audio error: ----------------------------', error)
              setIsLoadCamera(false);
              setIsError(true);
            }}
          />
        ) : props.urlType === YOUTUBE_URL ? (
          <YouTubePlayer
            height={200}
            // play={true}
            videoId={props.camera.id}
            // initialPlayerParams={{ autoplay: true }}
            // onChangeState={onChangeYoutubeState}
            onReady={() => setIsLoadCamera(false)}
          />
        ) : (
          <VLCPlayer
            style={[styles.video]}
            videoAspectRatio="16:9"
            source={{ uri: props.camera.link }}
            // source={{ uri: "wss://rec2.thainguyencity.gov.vn:8006/evup/1704167692/E43022602BE6xyzrboanObCq5" }}
            autoplay={true}
            onBuffering={(event) => {
              if (event.isPlaying) {
                setIsError(false);
                setIsLoadCamera(false);
              }
            }}
            onError={(error) => {
              console.log('Audio error: ----------------------------', error)
              setIsLoadCamera(false);
              setIsError(true);
            }}
          />
        )
        }
      </ViewShot>
      {isControl &&
        <View style={styles.viewControlRight} pointerEvents='box-none'>
          <TouchableOpacity style={styles.btnCreenShot}
            onPress={props.handleScreenChange}
            onStartShouldSetResponder={() => true}
          >
            <Image source={props.isFullScreen ? Images.normalScreen : Images.fullScreen} style={styles.iconControlMedium} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.btnCreenShot}
            onPress={captureImage}
            onStartShouldSetResponder={() => true}
          >
            <Image source={Images.screenShot} style={styles.iconControlMedium} />
          </TouchableOpacity>
        </View>
      }
      <View style={styles.viewLoad}>
        {isLoadCamera &&
          <ActivityIndicator size='large' color={Colors.blueText} />
        }
        {isError &&
          <Text style={styles.textError}>{i18n.t(`account.camera.cameraError`)}</Text>
        }
        {logIOS &&
          <Text style={styles.textError}>{logIOS}</Text>
        }
      </View>
    </Pressable>
  );
};

export default React.memo(Camera);
