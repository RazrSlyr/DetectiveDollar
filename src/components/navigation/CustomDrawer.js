import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import React from 'react';
import { View, Text } from 'react-native-web';

const CustomDrawer = (props) => {
    return (
        <View>
            <DrawerContentScrollView>
                <DrawerItemList {...props} />
            </DrawerContentScrollView>
        </View>
    );
};

export default CustomDrawer;
