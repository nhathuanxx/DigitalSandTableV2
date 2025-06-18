import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Project from '@app/modules/screens/Project/Project';
import ProjectDetail from '@app/modules/screens/Project/ProjectDetail';
import Map from "@app/modules/screens/Map/Map"


const Stack = createNativeStackNavigator();

export default function MainNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {/* <Stack.Screen name="Map" component={Map} /> */}

      <Stack.Screen name="Project" component={Project} />
      <Stack.Screen name="ProjectDetail" component={ProjectDetail} />
    </Stack.Navigator>
  );
}
