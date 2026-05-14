import React from 'react';
import { Platform } from 'react-native'; // Thêm Platform để tự động căn chỉnh
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons, Feather } from '@expo/vector-icons';

import HomeScreen from './home';
import SearchScreen from './search';
import CartScreen from './cart';
import AccountScreen from './account';

const Tab = createBottomTabNavigator();

export default function BottomTab() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#704D5B',
        tabBarInactiveTintColor: '#888',
        tabBarStyle: {
          backgroundColor: '#FFF',
          borderTopWidth: 1,
          borderTopColor: '#EEE',
          // Tăng chiều cao và đệm dưới đáy để không bị lẹm màn hình
          height: Platform.OS === 'ios' ? 85 : 70, 
          paddingBottom: Platform.OS === 'ios' ? 25 : 12,
          paddingTop: 10,
        },
        tabBarIcon: ({ color }) => {
          if (route.name === 'Home') return <Ionicons name="storefront-outline" size={24} color={color} />;
          if (route.name === 'Explore') return <Ionicons name="search-outline" size={24} color={color} />;
          if (route.name === 'Cart') return <Feather name="shopping-cart" size={24} color={color} />;
          if (route.name === 'Profile') return <Feather name="user" size={24} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Explore" component={SearchScreen} />
      <Tab.Screen name="Cart" component={CartScreen} />
      <Tab.Screen name="Profile" component={AccountScreen} />
    </Tab.Navigator>
  );
}