import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import React from 'react';
import { View, Text } from 'react-native-web';

import * as Colors from '../../constants/Colors';
import { HomePage, AddExpense, GraphPage, CategoryPage } from '../../screens';
const CustomDrawer = (props) => {
    return (
        <View>
            <DrawerContentScrollView>
                <DrawerItemList {...props} />
            </DrawerContentScrollView>
        </View>
    );
};
const HomeStack = () => {
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
            <Drawer.Screen name="Home Page" component={HomePage} />
            <Drawer.Screen name="Category" component={CategoryPage} />
        </Drawer.Navigator>
    );
};
export default CustomDrawer;
