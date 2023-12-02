import {
    createDrawerNavigator,
    DrawerContentScrollView,
    DrawerItemList,
} from '@react-navigation/drawer';
import * as React from 'react';
import { View, StyleSheet, Image, Text, TouchableOpacity, Dimensions } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import BottomTabNavigator from './BottomTabNavigator';
import * as Colors from '../../constants/Colors';
import { HomePage, CategoryPage } from '../../screens';
const Drawer = createDrawerNavigator();
const DrawerNavigator = () => {
    const DrawerHeaderContent = (props) => {
        return (
            <DrawerContentScrollView contentContainerStyle={{ flex: 1 }}>
                <View
                    style={{
                        backgroundColor: '#4f4f4f',
                        height: 100,
                        justifyContent: 'center',
                        alignItems: 'center',
                        top: -5,
                    }}>
                    <Text style={{ color: '#fff' }}>Home</Text>
                </View>
                <DrawerItemList {...props} />
            </DrawerContentScrollView>
        );
    };

    return (
        <Drawer.Navigator
            screenOptions={{
                drawerActiveTintColor: Colors.secondaryColor,
                drawerInactiveTintColor: Colors.secondaryColor,
                drawerStyle: {
                    backgroundColor: 'white',
                    width: Dimensions.get('screen').width / 2,
                },
                drawerLabelStyle: {
                    fontSize: 20, // Set the font size for each item
                },
                headerTitleAlign: 'center',
                headerTintColor: '#fff', // Set the text color of the header
                headerStyle: {
                    backgroundColor: Colors.secondaryColor, // Set the background color of the header
                },
                headerTitleStyle: {
                    fontWeight: 'bold', // Set the font weight of the header title
                    fontSize: 35,
                },
            }}>
            <Drawer.Screen name="Daily Spending" component={BottomTabNavigator} />
            <Drawer.Screen name="Categories" component={CategoryPage} />
        </Drawer.Navigator>
    );
};
function DrawerView() {
    return (
        <View>
            <Text>Drawer View</Text>
        </View>
    );
}
const styles = StyleSheet.create({
    headerLeft: {
        marginLeft: 15,
    },
    headerTitle: {
        color: 'white',
        fontSize: 18,
        fontWeight: '500',
    },
    headerRight: {
        marginRight: 15,
    },
    // drawer content
    drawerLabel: {
        fontSize: 14,
    },
    drawerLabelFocused: {
        fontSize: 14,
        color: '#551E18',
        fontWeight: '500',
    },
    drawerItem: {
        height: 50,
        justifyContent: 'center',
    },
    drawerItemFocused: {
        backgroundColor: '#ba9490',
    },
});

export default DrawerNavigator;
