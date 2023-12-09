import { useFocusEffect } from '@react-navigation/native';
import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { PieChart } from 'react-native-gifted-charts';

import PieChartLegend from './PieChartLegend';
import * as Colors from '../constants/Colors';
import { YEARLY, MONTHLY, WEEKLY } from '../constants/FrequencyConstants';
import {
    getCurrentDateString,
    getWeekStartEndDate,
    getMonthStartEndDate,
    getYearStartEndDate,
} from '../util/DatetimeUtils';
import { getExpensesbyCategory, getCategoryColorByName } from '../util/FileSystemUtils';

/**
 * Component for displaying a pie graph of expenses separated by category
 * @param {object} props Props object. Props are startDate (string), endDate (string), 
 * and timeFrame (use FrequencyConstants)
 * @returns {object} The component object for the Pie Graph
 * @memberof Components
 */
const NewPieChartComponent = ({ startDate, endDate, timeFrame }) => {
    const [pieChartData, setPieChartData] = useState([]);
    const [categoryColors, setCategoryColors] = useState({});

    // Call the function to fetch and update data
    const updatePieChartData = async () => {
        try {
            const allExpenses = await getExpensesbyCategory(startDate, endDate);
            let totalSpending = 0;
            const categoryColors = {};
            //query category table instead
            //and create dict {id: category}
            for (const key in allExpenses) {
                if (allExpenses.hasOwnProperty(key)) {
                    const newColor = allExpenses[key][0]['color'];
                    categoryColors[key] = newColor;
                }
            }
            // Process the data
            const pieChartData = Object.keys(allExpenses).map((category) => {
                const total = allExpenses[category].reduce(
                    (sum, expense) => sum + expense.amount,
                    0
                );

                // add to the totalOfEverything
                totalSpending += total;
                return {
                    key: category,
                    value: total,
                    svg: { fill: categoryColors[category] },
                    color: categoryColors[category],
                    label: category,
                };
            });
            setCategoryColors(categoryColors);
            setPieChartData(pieChartData);
            setTotalSpending(totalSpending);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    useFocusEffect(
        React.useCallback(() => {
            updatePieChartData();
        }, [timeFrame, startDate, endDate])
    );

    const [totalSpending, setTotalSpending] = useState(0);
    const formattedTotal = `$${parseFloat(totalSpending).toFixed(2)}`;

    const noExpenseData = [{ label: 'No Data Available', value: 1, color: Colors.secondaryColor }];

    // Check if there's data in the pieChartData object
    const hasData = Object.keys(pieChartData).length > 0;

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <View
                style={{
                    flex: 1,
                    alignItems: 'center',
                    paddingTop: 20,
                    paddingBottom: 10,
                }}>
                <View style={{ paddingBottom: 20 }}>
                    <PieChart
                        style={{ height: 200, width: 200 }}
                        data={hasData ? pieChartData : noExpenseData}
                        donut
                        radius={110}
                        innerRadius={75}
                        centerLabelComponent={() => {
                            return (
                                <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                                    <Text
                                        style={{
                                            fontSize: 22,
                                            color: 'black',
                                            fontWeight: 'bold',
                                        }}>
                                        {formattedTotal}
                                    </Text>
                                </View>
                            );
                        }}
                    />
                </View>
                <PieChartLegend chartData={hasData ? pieChartData : noExpenseData} />
            </View>
        </View>
    );
};

export default NewPieChartComponent;
