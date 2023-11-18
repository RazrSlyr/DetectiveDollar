import { useFocusEffect } from '@react-navigation/native';
import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { PieChart } from 'react-native-svg-charts';

import { getExpensesbyCategory } from '../util/FileSystemUtils';

const PieChartComponent = () => {
    const [pieChartData, setPieChartData] = useState([]);

    // Call the function to fetch and update data
    const updatePieChartData = async () => {
        try {
            const categoryDict = await getExpensesbyCategory();
            let totalSpending = 0;

            // Process the data
            const pieChartData = Object.keys(categoryDict).map((category) => {
                const total = categoryDict[category].reduce(
                    (sum, expense) => sum + expense.amount,
                    0
                );

                // add to the totalOfEverything
                totalSpending += total;
                return {
                    key: category,
                    value: total,
                    svg: { fill: getRandomColor() },
                };
            });

            setPieChartData(pieChartData);
            setTotalSpending(totalSpending);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    useFocusEffect(
        React.useCallback(() => {
            updatePieChartData();
        }, [])
    );

    const [totalSpending, setTotalSpending] = useState(0);

    // Helper function to generate random colors
    const getRandomColor = () => {
        const red = Math.floor(Math.random() * 256);
        const green = Math.floor(Math.random() * 256);
        const blue = Math.floor(Math.random() * 256);

        // padStart used incase number generated is not 3 digits
        // toString(16) change to hexadecimal values
        const randomColor = `#${red.toString(16).padStart(2, '0')}${green
            .toString(16)
            .padStart(2, '0')}${blue.toString(16).padStart(2, '0')}`;

        return randomColor;
    };

    // Function to generate labels for the pie chart
    const generateLabels = ({ slices }) => {
        return slices.map((slice, index) => {
            const { pieCentroid, data } = slice;
            const category = data.key; // Extract the category name from the data object
            const percentage = ((data.value / totalSpending) * 100).toFixed(2); // calculates percentage of the graph
            const num = data.value; // total amount of the category

            return (
                <Text
                    key={index}
                    x={pieCentroid[0]}
                    y={pieCentroid[1]}
                    fill="black"
                    textAnchor="middle"
                    alignmentBaseline="middle"
                    label={`${category}: $${num}, ${percentage}`}
                    fontSize={16}
                />
            );
        });
    };

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <PieChart
                style={{ height: 200, width: 200 }}
                data={pieChartData}
                innerRadius={0}
                outerRadius="100%"
                padAngle={0}
                labelRadius="85%"
                // label={generateLabels} // not working
            />
            <Text style={{ marginTop: 10 }}>Total Spending: ${totalSpending}</Text>
        </View>
    );
};

export default PieChartComponent;
