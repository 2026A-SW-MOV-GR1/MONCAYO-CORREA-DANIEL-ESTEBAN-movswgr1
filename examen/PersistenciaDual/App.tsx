import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { StorageProvider } from './src/context/StorageContext';
import HomeScreen from './src/screens/HomeScreen';

export default function App() {
  return (
    <StorageProvider>
      <HomeScreen />
      <StatusBar style="light" />
    </StorageProvider>
  );
}
