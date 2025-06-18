import React, { useEffect, useMemo, useState } from 'react';
import { Image, View, Text } from 'react-native';
import createStyles from "./styles";
import { useTheme } from "@app/modules/components/context/ThemeContext";

const ImageWithFallback = ({ ImageSource, fallbackSource, style, onLoad }) => {
  const { isDarkTheme } = useTheme();
  const styles = createStyles(isDarkTheme);

  // console.log('re render ---------- ', ImageSource);
  const [source, setSource] = useState(ImageSource);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    // if (ImageSource.uri.toString() !== source.uri.toString()) {
    // console.log(JSON.stringify(ImageSource) + '  -  ' + JSON.stringify(source));
    setSource(ImageSource);
    // }
  }, [ImageSource])

  return (
    <Image
      source={typeof source === 'number' ? source : { uri: source }}
      style={isError ? styles.iconDefaulImage : style}
      onError={() => {
        setSource(fallbackSource);
        setIsError(true);
      }}
      onLoadStart={() => onLoad && onLoad(true)}
      onLoadEnd={() => onLoad && onLoad(false)}
      resizeMode='contain'
    />
  );
};

export default React.memo(ImageWithFallback);