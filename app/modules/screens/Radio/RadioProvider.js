import React, { createContext, useState, useRef, useEffect } from 'react';
import { Platform } from 'react-native';
import { VLCPlayer } from 'react-native-vlc-media-player';
import Video from 'react-native-video';
import storage from '@app/libs/storage';

export const RadioContext = createContext();

export const RadioProvider = ({ children }) => {
  const playerRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoad, setIsLoad] = useState(false);
  const [url, setUrl] = useState(null);
  const [nameChannel, setNameChannel] = useState(undefined);
  const [volume, setVolume] = useState(1.0);

  useEffect(() => {
    const fetchChannelName = async () => {
      if (url) {
        let chan = await storage.get('radioChannel');
        if (chan) {
          setNameChannel(chan.nameChannel);
        }
      }
    };
    fetchChannelName();
  }, [url]);

  const playRadio = (url) => {
    setUrl(url);
    setIsPlaying(true);
  };

  const stopRadio = () => {
    setUrl(null);
    setIsPlaying(false);
    setIsLoad(false);
  };

  const pauseRadio = () => {
    if (isPlaying && url) {
      // console.log('pause radio ------------------');
      setIsPlaying(false);
      setIsLoad(false);
    }
  };

  const resumeRadio = () => {
    if (url) {
      setIsPlaying(true);
    }
  };

  const handleLoadStart = () => {
    setIsLoad(true);
  };

  const handleLoad = () => {
    setIsLoad(false);
  };

  // Hàm điều chỉnh âm lượng
  const setVolumeRadio = (newVolume) => {
    if (newVolume < 0) newVolume = 0; // Giới hạn âm lượng từ 0.0
    if (newVolume > 1) newVolume = 1; // Giới hạn âm lượng đến 1.0
    setVolume(newVolume);

    if (playerRef.current) {
      if (Platform.OS === 'ios' || Platform.OS === 'default') {
        // Dành cho VLCPlayer
        playerRef.current.setVolume(newVolume * 200); // VLCPlayer: volume từ 0-200
      } else if (Platform.OS === 'android') {
        // Dành cho Video
        playerRef.current.setNativeProps({ volume: newVolume });
      }
    }
  };

  // Chọn Player dựa trên Platform
  const PlayerComponent = Platform.select({
    ios: VLCPlayer,
    android: Video,
    default: VLCPlayer
  });

  // Thuộc tính player dành riêng cho từng platform
  const playerProps = Platform.select({
    ios: {
      source: { uri: url },
      style: { height: 0, width: 0 },
      paused: !isPlaying,
      autoplay: isPlaying,
      onLoadStart: handleLoadStart,
      onPlaying: handleLoad,
      onError: (error) => console.log('Audio error:', error)
    },
    android: {
      source: { uri: url },
      style: { height: 0, width: 0 },
      paused: !isPlaying,
      onLoadStart: handleLoadStart,
      onLoad: handleLoad,
      onError: (error) => console.log('Audio error:', error),
      playInBackground: true,
      playWhenInactive: true,
      audioOnly: true,
      repeat: false,
      volume: volume
    },
    default: {
      source: { uri: url },
      style: { height: 0, width: 0 }
    }
  });

  return (
    <RadioContext.Provider value={{ playRadio, stopRadio, pauseRadio, resumeRadio, isPlaying, isLoad, nameChannel, setVolumeRadio }}>
      {children}
      {url && (
        <PlayerComponent
          ref={playerRef}
          {...playerProps}
        />
      )}
    </RadioContext.Provider>
  );
};