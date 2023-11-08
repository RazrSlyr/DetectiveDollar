import { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { PieChart } from 'react-native-svg-charts';

import { getExpensesbyCategory } from '../src/util/FileSystemUtils';

const YourPieChartComponent = () => {
    const [lastData, setLastData] = useState([]) // store last known data. so no unnecessary reload
    const [pieChartData, setPieChartData] = useState([]);

    useEffect(() => {
        // Call the function to fetch and update data
        const updatePieChartData = async () => {
            try {
                const categoryDict = await getExpensesbyCategory();

                // Process the data
                const pieChartData = Object.keys(categoryDict).map((category) => {
                    const totalAmount = categoryDict[category].reduce((sum, expense) => sum + expense.amount, 0
                    );

                    return {
                        key: category,
                        value: totalAmount,
                        svg: { fill: getRandomColor() },
                    };
                });

                // update the state with data
                // compare data to last known data
                if (JSON.stringify(pieChartData) !== JSON.stringify(lastData)) {
                    setPieChartData(pieChartData);
                    setLastData(pieChartData);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        updatePieChartData();

        // timer to automatically refresh after a minute
        const refreshInterval = setInterval(updatePieChartData, 60000);
        // cleanup the timer
        return () => {
            clearInterval(refreshInterval);
        };
    }, []);

    // Helper function to generate random colors
    const getRandomColor = () => {
        const red = Math.floor(Math.random() * 256);
        const green = Math.floor(Math.random() * 256);
        const blue = Math.floor(Math.random() * 256);

        // padStart used incase number generated is not 3 digits
        // toString(16) change to hexadecimal values
        const randomColor = `#${red.toString(16).padStart(2, '0')}${green.toString(16).padStart(2, '0')}${blue.toString(16).padStart(2, '0')}`;

        return randomColor;
    };

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <PieChart
                style={{ height: 200, width: 200 }}
                data={pieChartData}
                innerRadius={0}
                padAngle={0}
                // Other pie chart properties
            />
        </View>
    );
};

export default YourPieChartComponent;
