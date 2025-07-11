import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { LogBox } from 'react-native';

import SplashScreen from './screens/SplashScreen';
import HomeScreen from './screens/HomeScreen';
import FormScreen from './screens/FormScreen';
import StatusScreen from './screens/StatusScreen';
import DetailPeminjamanScreen from './screens/DetailPeminjamanScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  useEffect(() => {
    LogBox.ignoreLogs([
      'VirtualizedLists should never be nested',
    ]);
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Splash"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Dashboard" component={HomeScreen} />
        <Stack.Screen name="Form" component={FormScreen} />
        <Stack.Screen name="Status" component={StatusScreen} />
        <Stack.Screen name="Detail" component={DetailPeminjamanScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
