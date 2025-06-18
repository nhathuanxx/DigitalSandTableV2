import React, { createContext, useState, useContext, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import storage from '@app/libs/storage';
import AsyncStorage from '@react-native-community/async-storage';
import SystemNavigationBar from 'react-native-system-navigation-bar';
import { Platform } from 'react-native';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const deviceTheme = useColorScheme(); // Lấy theme từ hệ điều hành
  const [theme, setTheme] = useState('light'); // Giá trị theme: 'auto', 'dark', 'light'
  const [isDarkTheme, setIsDarkTheme] = useState(deviceTheme === 'dark');
  // const [isFirstActive, setIsFirstActive] = useState(true);

  useEffect(() => {

    const setStyleMap = async (isDark) => {
      const isSelectedStyleMap = await storage.get('isSelectedStyleMap');
      console.log('isSelectedStyleMap ============ ', isSelectedStyleMap);
      if (!isSelectedStyleMap) {
        await AsyncStorage.setItem('styleMap', isDark ? 'dark' : 'normal');
      }
    }

    const loadStoredTheme = async () => {
      const storedTheme = await storage.get('appTheme');
      if (storedTheme) {
        setTheme(storedTheme);
        let isDark = storedTheme === 'dark';
        if (storedTheme === 'auto') {
          setIsDarkTheme(deviceTheme === 'dark');
          setStyleMap(deviceTheme === 'dark');
          if (Platform.OS === 'android') {
            SystemNavigationBar.setBarMode(deviceTheme === 'dark' ? 'dark' : 'light')
          }
        } else {
          if (Platform.OS === 'android') {
            SystemNavigationBar.setBarMode(isDark ? 'dark' : 'light')
          }
          setIsDarkTheme(isDark);
          setStyleMap(isDark);
        }
      } else {
        setIsDarkTheme(theme === 'dark');
      }
    };
    loadStoredTheme();
    // setIsFirstActive(false);
  }, [deviceTheme]);


  const applyTheme = async (selectedTheme) => {
    setTheme(selectedTheme);
    storage.set('appTheme', selectedTheme);
    let isDark = selectedTheme === 'dark';
    if (selectedTheme === 'auto') {
      if (Platform.OS === 'android') {
        SystemNavigationBar.setBarMode(deviceTheme === 'dark' ? 'dark' : 'light')
      }
      setIsDarkTheme(deviceTheme === 'dark');
      await AsyncStorage.setItem('styleMap', deviceTheme === 'dark' ? 'dark' : 'normal');
    } else {
      setIsDarkTheme(isDark);
      await AsyncStorage.setItem('styleMap', isDark ? 'dark' : 'normal');
      if (Platform.OS === 'android') {
        SystemNavigationBar.setBarMode(isDark ? 'dark' : 'light')
      }
    }
    storage.remove('isSelectedStyleMap');
  };

  return (
    <ThemeContext.Provider value={{ isDarkTheme, applyTheme, theme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
