// Helpful source: https://github.com/bizzara/rncomponents/blob/main/react-native-bottom-tab-navigation/App.js

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StyleSheet, Text, Button, Image, View, TouchableOpacity } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons'; 



import {HomePage, AddExpense, GraphPage} from "../screens";


const Tab = createBottomTabNavigator();

const Tabs = () => {
    return (
        <Tab.Navigator 
            initialRouteName={"HomePage"} 
            screenOptions={({route}) => ({
                initialRouteName: "HomePage",
                tabBarShowLabel:false,
                headerShown:false,
                showLabel: false,
                tabBarStyle: {
                    position: "absolute",
                    bottom: 0,
                    right: 0,
                    left: 0,
                    elevation: 0,
                    height: 80,
                    background: "#fff"
                }
            })}
        >
            <Tab.Screen name="Home" component={HomePage} 
                options={{
                    tabBarIcon: ({focused})=>{
                        return (
                        <View style={{alignItems: "center", justifyContent: "center"}}> 
                            <AntDesign name="home" size={30} color={focused ? "#37c871": "#b7c8be"} />
                        </View>
                        )
                    }
                }}
            />
            <Tab.Screen 
                name="Add" 
                component={AddExpense} 
                options={{
                    tabBarIcon: ({focused})=>{
                    return (
                        <View
                            style={{
                                alignItems: "center",
                                justifyContent: "center",
                                backgroundColor: "#37c871",
                                width: Platform.OS == "ios" ? 60 : 70,
                                height: Platform.OS == "ios" ? 60 : 70,
                                top: Platform.OS == "ios" ? -10 : -20,
                                borderRadius: Platform.OS == "ios" ? 30 : 35
                            }}
                            >
                                <AntDesign name="pluscircleo" size={30} color="#fff" />
                        </View>
                    )
                    }
                }}
                />
            <Tab.Screen name="Graph" component={GraphPage}
                options={{
                    tabBarIcon: ({focused})=>{
                        return (
                        <View style={{alignItems: "center", justifyContent: "center"}}> 
                            <FontAwesome name="bar-chart" size={30} color={focused ? "#37c871": "#b7c8be"} />
                        </View>
                        )
                    }
                }}
                />
        </Tab.Navigator>
    );
  }

export default Tabs;

