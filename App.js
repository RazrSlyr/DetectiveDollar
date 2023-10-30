import { NavigationContainer } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import * as React from 'react';

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
