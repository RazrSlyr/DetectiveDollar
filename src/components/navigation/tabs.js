// Helpful source: https://github.com/bizzara/rncomponents/blob/main/react-native-bottom-tab-navigation/App.js
// Link for icons: https://icons.expo.fyi/Index

import { FontAwesome, AntDesign, MaterialIcons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Platform, StyleSheet, Text } from 'react-native';

import * as Colors from '../../constants/Colors';
import { HomePage, AddExpense, GraphPage, HistoryPage, CategoryPage } from '../../screens';

const Tab = createBottomTabNavigator();

/**
 * Component for the navigation tabs at the bottom
 * @returns {object} The component object for navigation tabs
 * @memberof Components
 */
const Tabs = () => {
    return (
        <Tab.Navigator
            initialRouteName="Home"
            screenOptions={({ route }) => ({
                tabBarHideOnKeyboard: true,
                initialRouteName: 'Home',
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
                    background: 'black',
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
                                    color={focused ? Colors.SECONDARYCOLOR : Colors.SUBHEADINGCOLOR}
                                />
                                <Text style={styles.text}>Home</Text>
                            </View>
                        );
                    },
                }}
            />
            <Tab.Screen
                name="Categories"
                component={CategoryPage}
                options={{
                    tabBarIcon: ({ focused }) => {
                        return (
                            <View style={styles.elementContainer}>
                                <MaterialIcons
                                    name="category"
                                    size={30}
                                    color={focused ? Colors.SECONDARYCOLOR : Colors.SUBHEADINGCOLOR}
                                />
                                <Text style={styles.text}>Categories</Text>
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
                                <AntDesign
                                    name="pluscircleo"
                                    size={40}
                                    color={focused ? '#00792A' : 'white'}
                                />
                                {/* <Text style={styles.text}>Add</Text> */}
                            </View>
                        );
                    },
                }}
            />
            <Tab.Screen
                name="History"
                component={HistoryPage}
                options={{
                    tabBarIcon: ({ focused }) => {
                        return (
                            <View style={styles.elementContainer}>
                                <FontAwesome
                                    name="history"
                                    size={30}
                                    color={focused ? Colors.SECONDARYCOLOR : Colors.SUBHEADINGCOLOR}
                                />
                                <Text style={styles.text}>History</Text>
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
                                    color={focused ? Colors.SECONDARYCOLOR : Colors.SUBHEADINGCOLOR}
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
        height: 55,
        width: 55,
        backgroundColor: Colors.SECONDARYCOLOR,
        borderRadius: 30,
        top: 5,
    },
    text: {
        fontSize: 11,
        margin: 2,
        color: Colors.TEXTCOLOR,
    },
});

export default Tabs;
