import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import * as React from 'react';
import { Text, StyleSheet, View } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { HomePage, AddExpense, GraphPage } from '../../screens';
const Tab = createBottomTabNavigator();

const BottomTabNavigator = () => {
    return (
        <Tab.Navigator initialRouteName="HomeScreen" screenOptions={{}}>
            <Tab.Screen
                name="HomeStackNavigator"
                component={HomePage}
                options={{
                    tabBarLabel: 'Home Screen',
                    headerShown: false,
                    tabBarIcon: ({ color, size }) => (
                        <MaterialCommunityIcons name="home" color={color} size={size} />
                    ),
                }}
            />
            <Tab.Screen
                name="BookStackNavigator"
                component={AddExpense}
                options={{
                    tabBarLabel: 'Book Screen',
                    headerShown: false,
                    tabBarIcon: ({ color, size }) => (
                        <MaterialCommunityIcons
                            name="book-open-blank-variant"
                            color={color}
                            size={size}
                        />
                    ),
                }}
            />
            <Tab.Screen
                name="ContactStackNavigator"
                component={GraphPage}
                options={{
                    tabBarLabel: 'Contact Screen',
                    headerShown: false,
                    tabBarIcon: ({ color, size }) => (
                        <MaterialCommunityIcons name="contacts" color={color} size={size} />
                    ),
                }}
            />
        </Tab.Navigator>
    );
};

const styles = StyleSheet.create({
    tabBarLabel: {
        color: '#292929',
        fontSize: 12,
    },
    tabContainer: {
        height: 60,
    },
});

export default BottomTabNavigator;
