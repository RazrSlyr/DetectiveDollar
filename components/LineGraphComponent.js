import { useFocusEffect } from '@react-navigation/native';
import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
//import { LineChart, Grid, XAxis, YAxis } from 'react-native-svg-charts';
import {LineChart} from "react-native-gifted-charts";
import {
    DAILY,
    DAY_LENGTH,
    YEARLY,
    MONTHLY,
    WEEKLY,
    WEEK_LENGTH,
} from '../src/constants/FrequencyConstants';
import { getCurrentDateString} from '../src/util/DatetimeUtils';
import {
    getExpensesbyMonth,
    getExpensesFromTimeframe,
    getExpenseTable,
} from '../src/util/FileSystemUtils';

// Next make the graph work with weekly data
// Next make the graph work with monthly data
// Next make the graph work with yearly data
// Next have a variable determine which time range to use

const LineGraphComponent = ({ startDate, endDate, step }) => {
    const [lineGraphData, setlineGraphData] = useState([]);
/*     const [lineGraphDataValues, setlineGraphDataValues] = useState([]);
    const [lineGraphDataLabels, setlineGraphDataLabels] = useState([]);
    console.log(lineGraphDataValues);
    console.log(lineGraphDataLabels);
    console.log(lineGraphData);*/


    // Will return the date of the beginning of the week (last sunday)
    // and the end of the week (this saturday)
    const getWeekStartEndDate = (currentDateString) => {
        const currentDate = new Date(currentDateString);

        const weekStartDate = new Date(currentDate);
        weekStartDate.setDate(currentDate.getDate() - currentDate.getDay());
        const weekStartDateYear = weekStartDate.getFullYear();
        const weekStartDateMonth = String(weekStartDate.getMonth() + 1).padStart(2, '0');
        const weekStartDateDay = String(weekStartDate.getDate()).padStart(2, '0');

        const weekEndDate = new Date(currentDate);
        weekEndDate.setDate(currentDate.getDate() + (6 - currentDate.getDay()));
        const weekEndDateYear = weekEndDate.getFullYear();
        const weekEndDateMonth = String(weekEndDate.getMonth() + 1).padStart(2, '0');
        const weekEndDateDay = String(weekEndDate.getDate()).padStart(2, '0');

        return [
            `${weekStartDateYear}-${weekStartDateMonth}-${weekStartDateDay}`,
            `${weekEndDateYear}-${weekEndDateMonth}-${weekEndDateDay}`
        ];
    };

    // Gets a list of days inbetween and including startDate and endDate
    const getDatesInRange = (startDate, endDate) => {
        const dates = [];
        const currentDate = new Date(startDate);
        const lastDate = new Date(endDate);
        while (currentDate <= lastDate) {
            dates.push(currentDate.toISOString().split('T')[0]);
            currentDate.setDate(currentDate.getDate() + 1);
        }
        // console.log(dates);
        return dates;
    };

    const updateLineGraphData = async () => {
        try {
            step = step || WEEKLY;

            if (step === WEEKLY) {
                const week = getWeekStartEndDate(getCurrentDateString());
                startDate = startDate || week[0];
                endDate = endDate || week[1];
                const transactions = await getExpensesFromTimeframe(startDate, endDate);
                
                const weekLabel = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
                const updatedData = transactions.reduce((accumulator, expense) => {
                    const date = new Date(expense.day);
                    // console.log(date);
                    const dayOfWeekIndex = date.getDay() + 1;
                    const dayOfWeek = weekLabel[dayOfWeekIndex];

                    const amount = expense.amount;

                    accumulator[dayOfWeek] = (accumulator[dayOfWeek] || 0) + amount;
                    // console.log(accumulator);
                    return accumulator;
                }, {});
                const lineGraphData = weekLabel.map((dayOfWeek) => ({
                    label: dayOfWeek,
                    value: updatedData[dayOfWeek] || 0, // Use an empty array if no data for the day
                }));
                setlineGraphData(lineGraphData);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    useFocusEffect(
        React.useCallback(() => {
            updateLineGraphData();
        }, [])
    );

    return (
        <View >
            {lineGraphData.length > 0 ? (
                <LineChart
                    data={lineGraphData}
                    color={'#37c871'}
                    thickness={3}
                    spacing={35}
                    yAxisLabelPrefix="$ "
                />
            ) : (
                <Text>Loading...</Text>
            )}
        </View>
    );
};

export default LineGraphComponent;
