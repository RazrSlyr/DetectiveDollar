// Helpful source: https://github.com/bizzara/rncomponents/blob/main/react-native-bottom-tab-navigation/App.js
// Link for icons: https://icons.expo.fyi/Index

import { FontAwesome, AntDesign } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useState } from 'react';
import { View, Platform, StyleSheet, Text } from 'react-native';

import * as Colors from '../../constants/Colors';
import { HomePage, AddExpense, GraphPage } from '../../screens';

const Tab = createBottomTabNavigator();

const Tabs = () => {
    return (
        <Tab.Navigator
            initialRouteName="HomePage"
            screenOptions={({ route }) => ({
                initialRouteName: 'HomePage',
                tabBarShowLabel: false,
                headerShown: false,
                showLabel: false,
                tabBarStyle: {
                    position: 'absolute',
                    bottom: 0,
                    right: 0,
                    left: 0,
                    elevation: 0,
                    height: 80,
                    background: '#fff',
                },
            })}>
            <Tab.Screen
                name="Home"
                component={HomePage}
                options={{
                    tabBarIcon: ({ focused }) => {
                        return (
                            <View style={styles.elementContainer}>
                                <AntDesign
                                    name="home"
                                    size={30}
                                    color={focused ? Colors.secondaryColor : Colors.subHeadingColor}
                                />
                                <Text style={styles.text}>Home</Text>
                            </View>
                        );
                    },
                }}
            />
            <Tab.Screen
                name="Add"
                component={AddExpense}
                options={{
                    tabBarIcon: ({ focused }) => {
                        return (
                            <View style={[styles.elementContainer, styles.addBtn]}>
                                <AntDesign name="pluscircleo" size={40} color={focused ? 'green' : 'white'}
                                />
                                {/* <Text style={styles.text}>Add</Text> */}
                            </View>
                        );
                    },
                }}
            />
            <Tab.Screen
                name="Graph"
                component={GraphPage}
                options={{
                    tabBarIcon: ({ focused }) => {
                        return (
                            <View style={styles.elementContainer}>
                                <FontAwesome
                                    name="bar-chart"
                                    size={30}
                                    color={focused ? Colors.secondaryColor : Colors.subHeadingColor}
                                />
                                <Text style={styles.text}>Statistics</Text>
                            </View>
                        );
                    },
                }}
            />
        </Tab.Navigator>
    );
};

const styles = StyleSheet.create({
    elementContainer: {
        height: '100%',
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        top: 10,
    },
    addBtn: {
        height: 70,
        width: 70,
        backgroundColor: Colors.secondaryColor,
        borderRadius: 35,
        top: -5,
    },
    text: {
        fontSize: 14,
        margin: 2,
    },
});

export default Tabs;
