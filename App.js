import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { CartProvider } from './foldersrc/cartcontext';

import SplashScreen from './foldersrc/splash';
import OnboardingScreen from './foldersrc/onboard';
import LoginScreen from './foldersrc/login';
import SignUpScreen from './foldersrc/signup';
import OrderAcceptedScreen from './foldersrc/ordercomplete';

// Import file Bottom Tab vừa tạo
import BottomTab from './foldersrc/bottomtab';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <CartProvider>
      <NavigationContainer>
        <Stack.Navigator 
          initialRouteName="Splash" 
          screenOptions={{ headerShown: false }}
        >
          <Stack.Screen name="Splash" component={SplashScreen} />
          <Stack.Screen name="Onboarding" component={OnboardingScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="SignUp" component={SignUpScreen} />

          {/* Gộp 4 màn hình chính vào đây */}
          <Stack.Screen name="MainTabs" component={BottomTab} />
          <Stack.Screen name="OrderAccepted" component={OrderAcceptedScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </CartProvider>
  );
}