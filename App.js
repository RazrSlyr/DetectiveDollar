import { NavigationContainer } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { StatusBar } from 'expo-status-bar';
import * as React from 'react';
import { ButtonStyleSheet, Text, TextInput, View, Image } from 'react-native';
import Tabs from './components/navigation/tabs';

export default function App() {
    const [fontsLoaded] = useFonts({
        'Roboto-Bold': require('./assets/fonts/Roboto-Bold.ttf'),
    });
    return (
        <NavigationContainer>
            <Tabs />
        </NavigationContainer>
    );
}
