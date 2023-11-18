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
    const [lineGraphDataValues, setlineGraphDataValues] = useState([]);
    const [lineGraphDataLabels, setlineGraphDataLabels] = useState([]);
    console.log(lineGraphDataValues);
    console.log(lineGraphDataLabels);
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
                setlineGraphData(lineGraphData);
/* 
                const lineGraphDataValues = getDatesInRange(startDate, endDate).map(
                    (date) => updatedData[date] || 0
                );
                const lineGraphDataLabels = getDatesInRange(startDate, endDate).map((date) => date);
                setlineGraphDataValues(lineGraphDataValues);
                setlineGraphDataLabels(lineGraphDataLabels);
                 */
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

    const axesSvg = { fontSize: 10, fill: 'grey' };
    const verticalContentInset = { top: 10, bottom: 10 }
    const xAxisHeight = 30

    return (
        <View style={{ height: 300, padding: 20, flexDirection: 'row' }}>
            <YAxis
                data={lineGraphData}
                yAccessor={({ item }) => item.value}
                style={{ marginBottom: xAxisHeight }}
                contentInset={verticalContentInset}
                svg={axesSvg}
            />
            <View style={{ flex: 1, marginLeft: 10 }}>
                <LineChart
                    style={{ flex: 1 }}
                    data={lineGraphData}
                    //xAccessor={({ item }) => item.key}
                    yAccessor={({ item }) => item.value}
                    contentInset={verticalContentInset}
                    svg={{ stroke: 'rgb(134, 65, 244)' }}>
                    <Grid />
                </LineChart>
                <XAxis
                    style={{ marginHorizontal: -10, height: xAxisHeight }}
                    data={lineGraphData}
                    //xAccessor={({ item }) => item.key}
                    formatLabel={(value, index) => index}
                    contentInset={{ left: 10, right: 10 }}
                    svg={axesSvg}
                />
            </View>
        </View>
    );
};

export default LineGraphComponent;
