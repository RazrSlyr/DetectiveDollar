import { useFocusEffect } from '@react-navigation/native';
import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { LineChart } from 'react-native-gifted-charts';

import { YEARLY, MONTHLY, WEEKLY } from '../constants/FrequencyConstants';
import {
    getCurrentDateString,
    getWeekStartEndDate,
    getMonthStartEndDate,
    getYearStartEndDate,
} from '../util/DatetimeUtils';
import { getExpensesFromDayframe } from '../util/FileSystemUtils';

const LineGraphComponent = ({ startDate, endDate, timeFrame }) => {
    const [lineGraphData, setlineGraphData] = useState([]);
    const [maxDataValue, setMaxDataValue] = useState(0);

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

    const formatDateforDisplay = (dateString) => {
        const date = new Date(dateString + 'T00:00:00Z');
        const year = date.getUTCFullYear();
        const month = String(date.getUTCMonth() + 1).padStart(2, '0');
        const day = String(date.getUTCDate()).padStart(2, '0');
        return `${month}/${day}/${year}`;
    };

    const getDateFromDayOfWeek = (startDate, endDate, weekLabel) => {
        const [startYear, startMonth, startDay] = startDate.split('-');
        const [endYear, endMonth, endDay] = endDate.split('-');
        const start = new Date(startYear, startMonth - 1, startDay);
        const end = new Date(endYear, endMonth - 1, endDay);

        // Iterate through the days in the range
        for (let current = start; current <= end; current.setDate(current.getDate() + 1)) {
            const currentDayOfWeek = current.toLocaleDateString('en-US', { weekday: 'short' });

            // Check if the current day matches the desired day of the week
            if (currentDayOfWeek.includes(weekLabel)) {
                return current.toISOString().split('T')[0];
            }
        }
    };

    const updateLineGraphData = async () => {
        try {
            timeFrame = timeFrame || WEEKLY;
            const [startYear, startMonth, startDay] = startDate.split('-');

            if (timeFrame === WEEKLY) {
                const week = getWeekStartEndDate(getCurrentDateString());
                startDate = startDate || week[0];
                endDate = endDate || week[1];

                const transactions = await getExpensesFromDayframe(startDate, endDate);
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
                    date: formatDateforDisplay(getDateFromDayOfWeek(startDate, endDate, dayOfWeek)),
                }));
                const maxDataValue = lineGraphData.reduce(
                    (max, current) => (current.value > max ? current.value : max),
                    0
                );
                setlineGraphData(lineGraphData);
                setMaxDataValue(maxDataValue);
            } else if (timeFrame === MONTHLY) {
                const month = getMonthStartEndDate(getCurrentDateString());
                startDate = startDate || month[0];
                endDate = endDate || month[1];
                const transactions = await getExpensesFromDayframe(startDate, endDate);

                const monthLabel = getDaysInMonth(endDate);
                const totalDays = monthLabel.length;
                const step = Math.floor(totalDays / 4);
                const updatedData = transactions.reduce((accumulator, expense) => {
                    const date = new Date(expense.day);
                    const dayOfMonthIndex = date.getDate();
                    const dayOfMonth = monthLabel[dayOfMonthIndex];

                    const amount = expense.amount;

                    accumulator[dayOfMonth] = (accumulator[dayOfMonth] || 0) + amount;
                    return accumulator;
                }, {});

                const labelMapping = {
                    [totalDays]: totalDays,
                    [totalDays - step]: totalDays - step + 1,
                    [totalDays - 2 * step]: totalDays - 2 * step + 1,
                    [totalDays - 3 * step]: totalDays - 3 * step + 1,

                    [totalDays - 4 * step]: totalDays - 4 * step + 1,
                };

                const lineGraphData = monthLabel.map((dayOfMonth) => ({
                    label: labelMapping[dayOfMonth],
                    value: updatedData[dayOfMonth] || 0, // Use an empty value if no data for the day
                    date: `${startMonth}/${dayOfMonth}/${startYear}`,
                }));
                const maxDataValue = lineGraphData.reduce(
                    (max, current) => (current.value > max ? current.value : max),
                    0
                );
                setlineGraphData(lineGraphData);
                setMaxDataValue(maxDataValue);
            } else if (timeFrame === YEARLY) {
                const year = getYearStartEndDate(getCurrentDateString());
                startDate = startDate || year[0];
                endDate = endDate || year[1];
                const transactions = await getExpensesFromDayframe(startDate, endDate);

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
                    label: monthOfYear[0],
                    value: updatedData[monthOfYear] || 0, // Use an empty value if no data for the day
                    date: `${monthOfYear} ${startYear}`,
                }));
                const maxDataValue = lineGraphData.reduce(
                    (max, current) => (current.value > max ? current.value : max),
                    0
                );
                setlineGraphData(lineGraphData);
                setMaxDataValue(maxDataValue);
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

    let spacing;
    let initialSpacing;
    let fontSize;

    // Conditionally set the spacing based on the selected timeframe
    if (timeFrame === WEEKLY) {
        spacing = 38;
        initialSpacing = 40;
        fontSize = 14;
    } else if (timeFrame === MONTHLY) {
        spacing = 8.5;
        initialSpacing = 35;
        fontSize = 12;
    } else if (timeFrame === YEARLY) {
        spacing = 22;
        initialSpacing = 30;
        fontSize = 14;
    } else {
        // Default value for other cases
        spacing = 38;
        initialSpacing = 40;
        fontSize = 14;
    }

    return (
        <View>
            {lineGraphData.length > 0 ? (
                <LineChart
                    hideDataPoints
                    areaChart
                    data={lineGraphData}
                    startFillColor="#37C871"
                    startOpacity={0.8}
                    endFillColor="#D5FADD"
                    endOpacity={0.3}
                    color="#37c871"
                    thickness={4}
                    width={310}
                    height={220}
                    scrollToIndex={-1}
                    spacing={spacing}
                    initialSpacing={initialSpacing}
                    endSpacing={0}
                    label={['0', '30']}
                    xAxisLabelTextStyle={{
                        color: '#545454',
                        fontSize: fontSize,
                        textAlign: 'left',
                        marginRight: -9,
                    }}
                    yAxisTextStyle={{
                        color: '#545454',
                        fontSize: 12,
                        textAlign: 'left',
                    }}
                    noOfSections={5}
                    yAxisLabelPrefix="$"
                    yAxisThickness={0}
                    yAxisLabelWidth={45}
                    maxValue={Math.ceil(maxDataValue * 2)}
                    formatYLabel={(label) => {
                        const labelVal = Number(label);
                        if (labelVal >= 1000000) return (labelVal / 1000000).toFixed(1) + 'M';
                        if (labelVal >= 1000) return (labelVal / 1000).toFixed(1) + 'K';
                        if (labelVal < 1000 && labelVal > 10) return Math.floor(labelVal / 10) * 10;
                        return label;
                    }}
                    pointerConfig={{
                        pointerStripHeight: 160,
                        pointerStripColor: 'lightgray',
                        pointerStripWidth: 2,
                        pointerColor: 'lightgray',
                        radius: 6,
                        pointerLabelWidth: 100,
                        pointerLabelHeight: 90,
                        activatePointersOnLongPress: false,
                        autoAdjustPointerLabelPosition: false,
                        activatePointersDelay: 2,
                        hidePointer: true,
                        pointerLabelComponent: (items) => {
                            return (
                                <View
                                    style={{
                                        height: 90,
                                        width: 100,
                                        justifyContent: 'center',
                                        marginTop: -30,
                                        marginLeft: -40,
                                    }}>
                                    <Text
                                        style={{
                                            color: 'black',
                                            fontSize: 14,
                                            marginBottom: 6,
                                            textAlign: 'center',
                                        }}>
                                        {items[0].date}
                                    </Text>
                                    <View
                                        style={{
                                            paddingHorizontal: 14,
                                            paddingVertical: 6,
                                            borderRadius: 16,
                                            backgroundColor: 'white',
                                            borderColor: '#37C871',
                                            borderWidth: 2,
                                        }}>
                                        <Text style={{ fontWeight: 'bold', textAlign: 'center' }}>
                                            {'$' + items[0].value}
                                        </Text>
                                    </View>
                                </View>
                            );
                        },
                    }}
                />
            ) : (
                <Text>Loading...</Text>
            )}
        </View>
    );
};

export default LineGraphComponent;
