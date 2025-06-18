
import React from 'react';
import { View, Image, StyleSheet, Text, ImageBackground } from 'react-native';
import { Images, Metrics } from "@app/theme";
import { useTheme } from "@app/modules/components/context/ThemeContext";
import createStyles from "./styles";

const Marker = ({ type, index }) => {
  const { isDarkTheme } = useTheme();
  const styles = createStyles(isDarkTheme);

  const renderMyLocationMarker = () => {
    return (
      <View style={styles.myLocation}>
        <View style={styles.myLocationContainer}>
          {/* <Image source={}/> */}
        </View>
      </View>
    )
  }
  const renderStepMarker = () => {
    return (
      <View style={styles.stepContainer}>
      </View>
    )
  }
  const renderStartMarker = () => {
    return (
      <View style={styles.startContainer}>
      </View>
    )
  }

  const renderLocationTo = () => {
    return (
      <View style={styles.locationToContainer}>
        <Text style={styles.text}>{index}</Text>
      </View>
    )
  }
  return (
    <>
      {type == 'myLocation' ? renderMyLocationMarker() : null}
      {type == 'step' ? renderStepMarker() : null}
      {type == 'start' ? renderStartMarker() : null}
      {type == 'to' ? renderLocationTo() : null}
    </>
  );
};

export default Marker;
