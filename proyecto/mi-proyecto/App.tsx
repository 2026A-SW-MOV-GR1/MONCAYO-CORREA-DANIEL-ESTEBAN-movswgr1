import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import RestScreen from './src/screens/RestScreen';
import StorageScreen from './src/screens/StorageScreen';
import { Ionicons } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName = 'home';
            if (route.name === 'REST API') {
              iconName = focused ? 'cloud-download' : 'cloud-download-outline';
            } else if (route.name === 'Almacenamiento') {
              iconName = focused ? 'save' : 'save-outline';
            }
            return <Ionicons name={iconName as any} size={size} color={color} />;
          },
          tabBarActiveTintColor: 'tomato',
          tabBarInactiveTintColor: 'gray',
        })}
      >
        <Tab.Screen name="REST API" component={RestScreen} />
        <Tab.Screen name="Almacenamiento" component={StorageScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}