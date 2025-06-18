import React, { createContext, useState, useContext, useEffect } from 'react';
import { Dimensions } from 'react-native';

const OrientationContext = createContext();

export const OrientationProvider = ({ children }) => {

  const [isPortrait, setIsPortrait] = useState(true);
  const [dimensions, setDimensions] = useState(Dimensions.get("window"));

  useEffect(() => {

    const handleOrientationChange = () => {
      const { width, height } = Dimensions.get('window');
      setIsPortrait(height >= width);
      setDimensions(Dimensions.get("window"));
    };

    handleOrientationChange(); // Xử lý khi mount lần đầu
    const subscription = Dimensions.addEventListener('change', handleOrientationChange);

    return () => subscription?.remove();
  }, []);

  return (
    <OrientationContext.Provider value={{ isPortrait, dimensions }}>
      {children}
    </OrientationContext.Provider>
  );
};

export const useOrientation = () => useContext(OrientationContext);
