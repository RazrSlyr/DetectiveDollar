import { useFocusEffect } from '@react-navigation/native';
import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { PieChart } from 'react-native-gifted-charts';

import PieChartLegend from './PieChartLegend';
import { YEARLY, MONTHLY, WEEKLY } from '../constants/FrequencyConstants';
import {
    getCurrentDateString,
    getWeekStartEndDate,
    getMonthStartEndDate,
    getYearStartEndDate,
} from '../util/DatetimeUtils';
import { getExpensesbyCategory } from '../util/FileSystemUtils';

const NewPieChartComponent = ({ startDate, endDate, timeFrame }) => {
    const [pieChartData, setPieChartData] = useState([]);

    // Call the function to fetch and update data
    const updatePieChartData = async () => {
        try {
            timeFrame = timeFrame || WEEKLY;

            if (timeFrame === WEEKLY) {
                const week = getWeekStartEndDate(getCurrentDateString());
                startDate = startDate || week[0];
                endDate = endDate || week[1];
            } else if (timeFrame === MONTHLY) {
                const month = getMonthStartEndDate(getCurrentDateString());
                startDate = startDate || month[0];
                endDate = endDate || month[1];
            } else if (timeFrame === YEARLY) {
                const year = getYearStartEndDate(getCurrentDateString());
                startDate = startDate || year[0];
                endDate = endDate || year[1];
            } else {
                // else return day
                startDate = getCurrentDateString();
                endDate = getCurrentDateString();
            }
            
            const categoryDict = await getExpensesbyCategory(startDate, endDate);
            // console.log("categoryDict: ", categoryDict);
            let totalSpending = 0;

            // Process the data
            const pieChartData = Object.keys(categoryDict).map((category) => {
                const total = categoryDict[category].reduce(
                    (sum, expense) => sum + expense.amount,
                    0
                );

                // add to the totalOfEverything
                totalSpending += total;
                const randColor = getRandomColor();
                return {
                    key: category,
                    value: total,
                    svg: { fill: randColor },
                    color: randColor,
                    label: category,
                };
            });
            // console.log("Total spending is", totalSpending);
            // console.log(pieChartData);

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
    const formattedTotal = `$${parseFloat(totalSpending).toFixed(2)}`;

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

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
            <PieChart
                style={{ height: 200, width: 200 }}
                data={pieChartData}
                donut
                radius={90}
                innerRadius={60}
                centerLabelComponent={() => {
                    return (
                        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={{ fontSize: 22, color: 'black', fontWeight: 'bold' }}>
                                {formattedTotal}
                            </Text>
                        </View>
                    );
                }}
            />
            <PieChartLegend chartData={pieChartData} />
        </View>
    );
};

export default NewPieChartComponent;
