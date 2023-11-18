import { useFocusEffect } from '@react-navigation/native';
import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { LineChart, Grid, XAxis, YAxis } from 'react-native-svg-charts';
import {
    DAILY,
    DAY_LENGTH,
    YEARLY,
    MONTHLY,
    WEEKLY,
    WEEK_LENGTH,
} from '../src/constants/FrequencyConstants';
import { getExpensesbyMonth, getExpensesFromTimeframe, getExpenseTable } from '../src/util/FileSystemUtils';
import { getCurrentDateString, incrementDateByFrequency} from '../src/util/DatetimeUtils';


// Next make the graph work with weekly data
// Next make the graph work with monthly data
// Next make the graph work with yearly data
// Next have a variable determine which time range to use


const LineGraphComponent = ({ startDate, endDate, step }) => {
    const [lineGraphData, setlineGraphData] = useState([]);
    console.log(lineGraphData);

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
        console.log(dates);
        return dates;
    };

    const updateLineGraphData = async () => {
        try {
            const week = getWeekStartEndDate(getCurrentDateString());
            console.log(week);
            startDate = startDate || week[0];
            endDate = endDate || week[1];
            step = step || WEEKLY;
            const transactions = await getExpensesFromTimeframe(startDate, endDate);

            if (step === WEEKLY) {
                const updatedData = transactions.reduce((accumulator, expense) => {
                    const day = expense.day;
                    const amount = expense.amount;

                    accumulator[day] = (accumulator[day] || 0) + amount;

                    return accumulator;
                }, {});
                const lineGraphData = getDatesInRange(startDate, endDate).map((date) => ({
                    key: date, //new Date(date).getTime(), // Convert date string to timestamp
                    value: updatedData[date] || 0, // Use the value from the map or default to 0
                }));
                // const lineGraphData = getDatesInRange(startDate, endDate).map((date) => (updatedData[date] || 0));
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
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            {lineGraphData.length > 0 ? (
                <LineChart
                    style={{ height: 200, width: 200 }}
                    data={lineGraphData}
                    svg={{ stroke: 'rgb(134, 65, 244)' }}
                    contentInset={{ top: 20, bottom: 20 }}>
                    <Grid />
                </LineChart>
            ) : (
                <Text>No data available</Text>
            )}
        </View>
    );
};

export default LineGraphComponent;
