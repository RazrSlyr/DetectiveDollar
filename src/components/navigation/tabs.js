// Helpful source: https://github.com/bizzara/rncomponents/blob/main/react-native-bottom-tab-navigation/App.js
// Link for icons: https://icons.expo.fyi/Index

import { FontAwesome, AntDesign } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Platform, StyleSheet, Text } from 'react-native';

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
                                    color={focused ? '#37c871' : '#b7c8be'}
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
                            <View
                                style={{
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    backgroundColor: '#37c871',
                                    // width: Platform.OS === 'ios' ? 70 : 80,
                                    // height: Platform.OS === 'ios' ? 70 : 80,
                                    // top: Platform.OS === 'ios' ?  : 10,
                                    borderRadius: Platform.OS === 'ios' ? 40 : 50,
                                }}>
                                <AntDesign name="plus" size={30} color="#fff" />
                                <Text style={styles.text}>Add</Text>
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
                                    color={focused ? '#37c871' : '#b7c8be'}
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
        alignItems: 'center',
        justifyContent: 'center',
        top: 5,
        // backgroundColor: 'red',
    },
    text: {
        fontSize: 14,
    },
});

export default Tabs;
