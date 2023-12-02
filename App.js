import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useFonts } from 'expo-font';
import * as React from 'react';

import DrawerNavigator from './src/components/navigation/DrawerNavigation';
import Tabs from './src/components/navigation/tabs';
const Stack = createStackNavigator();

export default function App() {
    const [fontsLoaded] = useFonts({
        'Roboto-Bold': require('./assets/fonts/Roboto-Bold.ttf'),
    });
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="DrawerNavigator">
                <Stack.Screen
                    name="DrawerNavigator"
                    component={DrawerNavigator}
                    options={{ headerShown: false }}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
