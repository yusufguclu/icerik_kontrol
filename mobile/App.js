/**
 * EtiketKontrol - Ana Uygulama
 * SDK 54 uyumlu versiyon
 */

import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// Ekranlar
import HomeScreen from './screens/HomeScreen';

export default function App() {
    return (
        <SafeAreaProvider>
            <StatusBar style="light" />
            <HomeScreen />
        </SafeAreaProvider>
    );
}
