import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useFonts } from 'expo-font';
import { StatusBar } from 'expo-status-bar';
import * as React from 'react';
import { ButtonStyleSheet, Text, TextInput, View, Image } from 'react-native';
import AddExpense from './src/screens/AddExpense';
import HomePage from './src/screens/HomePage';

// used for routing to other pages
const Stack = createNativeStackNavigator()

export default function App() {
    const [fontsLoaded] = useFonts({
        'Roboto-Bold': require('./assets/fonts/Roboto-Bold.ttf'),
    });
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Home" screenOptions={{headerShown: false}}>
                <Stack.Screen name="Home" component={HomePage} />
                <Stack.Screen name="AddExpense" component={AddExpense} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
