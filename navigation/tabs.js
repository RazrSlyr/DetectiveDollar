import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/AntDesign';
import { AntDesign } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons'; 


import HomePage from "../screens/HomePage";
import AddExpense from "../screens/AddExpense";
import GraphPage from "../screens/GraphPage";


const screenOptions = (route, color) => {
    let iconName;
  
    switch (route.name) {
      case 'Home':
        return <AntDesign name={'home'} color={color} size={34} />;
        break;
      case 'Add': 
        return <AntDesign name={'pluscircleo'} color={color} size={34} />;
        break;
      case 'Graph': 
        return <FontAwesome name={'bar-chart'} color={color} size={34} />;
        break;
      default:
        break;
    }
 
    return <Icon name={iconName} color={color} size={24} />;
  };


const Tab = createBottomTabNavigator();

const Tabs = () => {
    return (
        <Tab.Navigator 
            initialRouteName={"HomePage"} 
            screenOptions={({route}) => ({
                tabBarIcon: ({color}) => screenOptions(route, color),
                headerShown: false,
            })}
            tabBarOptions={{
                activeTintColor: '#37c871',
                inactiveTintColor: '#b7c8be',
                showLabel: false,
                style: {
                    borderTopColor: '#66666666',
                    backgroundColor: 'transparent',
                    elevation: 0,
                },
            }}
        >
            <Tab.Screen name="Home" component={HomePage} />
            <Tab.Screen name="Add" component={AddExpense} />
            <Tab.Screen name="Graph" component={GraphPage} />
        </Tab.Navigator>
    );
  }

export default Tabs;

