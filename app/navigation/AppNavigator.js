// AppNavigator.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AuthNavigator from '@app/navigation/AuthNavigator';
import MainNavigator from '@app/navigation/MainNavigator';
import { ActivityIndicator, View } from "react-native";
import { useAuth } from '@app/modules/context/AuthContext';
import CustomAlert from '@app/modules/components/alert/CustomAlert';
import FlashMessage from "react-native-flash-message";

const AppNavigator = () => {
  const { isLoggedIn, loading } = useAuth();

  if (loading) {
    return <View style={{
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    }}>
      <ActivityIndicator size="large" color="#3B82F6" />
    </View>;
  }

  return (
    <NavigationContainer>
      {isLoggedIn ? <MainNavigator /> : <AuthNavigator />}
      <CustomAlert />
      <FlashMessage position="top" style={{ marginTop: 16 }} />
    </NavigationContainer>
  );
};

export default AppNavigator;
