import { useFocusEffect } from '@react-navigation/native';
import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { LineChart } from 'react-native-gifted-charts';

import { YEARLY, MONTHLY, WEEKLY } from '../src/constants/FrequencyConstants';
import {
    getCurrentDateString,
    getWeekStartEndDate,
    getMonthStartEndDate,
    getYearStartEndDate,
} from '../src/util/DatetimeUtils';
import { getExpensesFromTimeframe } from '../src/util/FileSystemUtils';

const LineGraphComponent = ({ startDate, endDate, timeFrame }) => {
    const [lineGraphData, setlineGraphData] = useState([]);

    const getDaysInMonth = (currentDateString) => {
        const currentDate = new Date(currentDateString);
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth() + 1; // Month is zero-based, so add 1
        const daysInMonth = new Date(year, month, 0).getDate();
        const days = [];
        for (let day = 1; day <= daysInMonth; day++) {
            days.push(day);
        }
        return days;
    };

    const updateLineGraphData = async () => {
        try {
            timeFrame = timeFrame || WEEKLY;

            if (timeFrame === WEEKLY) {
                const week = getWeekStartEndDate(getCurrentDateString());
                startDate = startDate || week[0];
                endDate = endDate || week[1];

                const transactions = await getExpensesFromTimeframe(
                    startDate,
                    `${endDate} 23:59:59`
                );

                const weekLabel = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
                const updatedData = transactions.reduce((accumulator, expense) => {
                    const date = new Date(expense.day);
                    let dayOfWeekIndex = date.getDay() + 1;
                    if (dayOfWeekIndex === 7) {
                        dayOfWeekIndex = 0;
                    }
                    const dayOfWeek = weekLabel[dayOfWeekIndex];

                    const amount = expense.amount;

                    accumulator[dayOfWeek] = (accumulator[dayOfWeek] || 0) + amount;
                    return accumulator;
                }, {});
                const lineGraphData = weekLabel.map((dayOfWeek) => ({
                    label: dayOfWeek,
                    value: updatedData[dayOfWeek] || 0, // Use an empty value if no data for the day
                }));
                setlineGraphData(lineGraphData);
            } else if (timeFrame === MONTHLY) {
                const month = getMonthStartEndDate(getCurrentDateString());
                startDate = startDate || month[0];
                endDate = endDate || month[1];
                const transactions = await getExpensesFromTimeframe(
                    startDate,
                    `${endDate} 23:59:59`
                );

                const monthLabel = getDaysInMonth(getCurrentDateString());
                const updatedData = transactions.reduce((accumulator, expense) => {
                    const date = new Date(expense.day);
                    const dayOfMonthIndex = date.getDate();
                    const dayOfMonth = monthLabel[dayOfMonthIndex];

                    const amount = expense.amount;

                    accumulator[dayOfMonth] = (accumulator[dayOfMonth] || 0) + amount;
                    return accumulator;
                }, {});
                const lineGraphData = monthLabel.map((dayOfMonth) => ({
                    label: dayOfMonth,
                    value: updatedData[dayOfMonth] || 0, // Use an empty value if no data for the day
                }));
                setlineGraphData(lineGraphData);
            } else if (timeFrame === YEARLY) {
                const year = getYearStartEndDate(getCurrentDateString());
                startDate = startDate || year[0];
                endDate = endDate || year[1];
                const transactions = await getExpensesFromTimeframe(
                    startDate,
                    `${endDate} 23:59:59`
                );

                const yearLabel = [
                    'Jan',
                    'Feb',
                    'Mar',
                    'Apr',
                    'May',
                    'June',
                    'July',
                    'Aug',
                    'Sept',
                    'Oct',
                    'Nov',
                    'Dec',
                ];
                const updatedData = transactions.reduce((accumulator, expense) => {
                    const date = new Date(expense.day);
                    const monthOfYearIndex = date.getMonth();
                    const monthOfYear = yearLabel[monthOfYearIndex];

                    const amount = expense.amount;

                    accumulator[monthOfYear] = (accumulator[monthOfYear] || 0) + amount;
                    return accumulator;
                }, {});
                const lineGraphData = yearLabel.map((monthOfYear) => ({
                    label: monthOfYear,
                    value: updatedData[monthOfYear] || 0, // Use an empty value if no data for the day
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
        }, [timeFrame, startDate, endDate])
    );

    return (
        <View>
            {lineGraphData.length > 0 ? (
                <LineChart
                    data={lineGraphData}
                    color="#37c871"
                    thickness={4}
                    spacing={35}
                    noOfSections={5}
                    yAxisLabelPrefix="$ "
                    width={230}
                    height={220}
                    focusEnabled
                    showTextOnFocus
                    focusedDataPointShape
                    focusedDataPointColor="#FFE081"
                    yAxisThickness={0}
                    scrollToIndex={-1}
                    showScrollIndicator
                />
            ) : (
                <Text>Loading...</Text>
            )}
        </View>
    );
};

export default LineGraphComponent;
