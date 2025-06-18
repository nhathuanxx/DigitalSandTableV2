import React, { useEffect, useRef, useState } from 'react';
import { Animated, Text, View, StyleSheet, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

let showAlertExternal = () => {};

const WINDOW_WIDTH = Dimensions.get('window').width;

const CustomAlert = () => {
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState('');
  const [type, setType] = useState('success');
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    let isMounted = true;
    let timeout;

    showAlertExternal = ({ type = 'success', message = '', duration = 2000 }) => {
      if (!isMounted) return;

      setType(type);
      setMessage(message);
      setVisible(true);

      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 250,
        useNativeDriver: true,
      }).start();

      timeout = setTimeout(() => {
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }).start(() => {
          if (isMounted) {
            setVisible(false);
          }
        });
      }, duration);
    };

    return () => {
      isMounted = false;
      if (timeout) clearTimeout(timeout);
    };
  }, []);

  if (!visible) return null;

  let iconName = 'information';
  let bgColor = '#4BB543';

  if (type === 'success') {
    iconName = 'check-circle';
    bgColor = '#4BB543';
  } else if (type === 'error') {
    iconName = 'alert-circle';
    bgColor = '#FF3B30';
  } else if (type === 'warning') {
    iconName = 'alert';
    bgColor = '#FFA500';
  }

  return (
    <Animated.View
      style={[
        styles.container,
        {
          backgroundColor: bgColor,
          opacity: fadeAnim,
        },
      ]}
    >
      <Icon name={iconName} size={22} color="#fff" style={styles.icon} />
      <Text style={styles.message}>{message}</Text>
    </Animated.View>
  );
};

export const showCustomAlert = (params) => {
  if (typeof showAlertExternal === 'function') {
    showAlertExternal(params);
  }
};

export default CustomAlert;

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 50,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    maxWidth: WINDOW_WIDTH * 0.9,
    minWidth: 150,
    zIndex: 9999,
    elevation: 10,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
  icon: {
    marginRight: 8,
  },
  message: {
    color: '#fff',
    fontSize: 15,
    flexShrink: 1,
    flexWrap: 'wrap',
  },
});
