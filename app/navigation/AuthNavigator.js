import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from "@app/modules/screens/Auth/Login"


const Stack = createNativeStackNavigator();

const AuthNavigator = () => (
  <Stack.Navigator>
    <Stack.Screen options={{ headerShown: false }} name="Login" component={Login} />
  </Stack.Navigator>
);

export default AuthNavigator;
