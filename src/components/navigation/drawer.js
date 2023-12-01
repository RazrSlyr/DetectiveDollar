import { createDrawerNavigator } from '@react-navigation/drawer';

import { CategoryPage } from '../../screens';
const Drawer = createDrawerNavigator();

export const NavDrawer = () => {
    return (
        <Drawer.Navigator>
            <Drawer.Screen name="Category" component={CategoryPage} />
        </Drawer.Navigator>
    );
};
