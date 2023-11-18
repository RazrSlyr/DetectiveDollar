import * as React from 'react';
import { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, StatusBar, Alert} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import ChartWithInteractivity from '../../components/ChartWithInteractivity';
import LineGraphComponent from '../../components/LineGraphComponent';
import PieChartComponent from '../../components/PieChartComponent';
import WeekMonthYearButtons from '../../components/weekMonthYearComponent';
import { primaryColor, secondaryColor, subHeadingColor } from '../constants/Colors';
import {
    YEARLY,
    MONTHLY,
    WEEKLY,
} from '../constants/FrequencyConstants';
import { getCurrentDateString} from '../util/DatetimeUtils';

// Need a varaible that is connected to the button group

const GraphPage = ({ navigation }) => {
    // const [selectedTimeframeDates, setSelectedTimeframeDates] = useState(getWeekStartEndDate(getCurrentDateString()));

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

    const getMonthStartEndDate = (currentDateString) => {
        const currentDate = new Date(currentDateString);

        // Get the first day of the month
        const monthStartDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        const monthStartDateYear = monthStartDate.getFullYear();
        const monthStartDateMonth = String(monthStartDate.getMonth() + 1).padStart(2, '0');
        const monthStartDateDay = String(monthStartDate.getDate()).padStart(2, '0');

        // Get the last day of the month
        const lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
        const monthEndDateYear = lastDay.getFullYear();
        const monthEndDateMonth = String(lastDay.getMonth() + 1).padStart(2, '0');
        const monthEndDateDay = String(lastDay.getDate()).padStart(2, '0');

        return [
            `${monthStartDateYear}-${monthStartDateMonth}-${monthStartDateDay}`,
            `${monthEndDateYear}-${monthEndDateMonth}-${monthEndDateDay}`,
        ];
    };
    const getYearStartEndDate = (currentDateString) => {
        const currentDate = new Date(currentDateString);
        return [`${currentDate.getUTCFullYear()}-01-01`, `${currentDate.getUTCFullYear()}-12-31`];
    };

    const [selectedTimeframe, setSelectedTimeframe] = useState(WEEKLY);
    const [selectedTimeframeDates, setSelectedTimeframeDates] = useState(getWeekStartEndDate(getCurrentDateString()));


    const handleTimeframeSelect = (value) => {
        setSelectedTimeframe(value);
        // Perform any other actions based on the selected timeframe
        if (value === WEEKLY) {
            setSelectedTimeframeDates(getWeekStartEndDate(getCurrentDateString()));
        } else if (value === MONTHLY) {
            setSelectedTimeframeDates(getMonthStartEndDate(getCurrentDateString()));
        } else if (value === YEARLY) {
            setSelectedTimeframeDates(getYearStartEndDate(getCurrentDateString()));
        }
    };
 
    return (
        <SafeAreaView style={styles.container}>
            <ScrollView >
                <Text style={styles.title}>Stats</Text>
{/*                 <View style={ styles.dateRange}>
                    <Text >{`${startDate}`}</Text>
                    <Text> Date 2 </Text>
                </View> */}
                <Text>Selected Timeframe Dates: {selectedTimeframeDates}</Text>
                <Text>Selected Timeframe: {selectedTimeframe}</Text>
                <WeekMonthYearButtons onSelect={handleTimeframeSelect}/>
                <View style={styles.scrollableContent}>
                    <View style={styles.chartContainer}>
                        {/* put line chart here later */}
                        <LineGraphComponent
                            startDate={selectedTimeframeDates[0]}
                            endDate={selectedTimeframeDates[1]}
                            step={selectedTimeframe}
                        />
                    </View>
                    <View style={styles.chartContainer}>
                        {/* put line chart here later */}
                        <ChartWithInteractivity />
                    </View>
                    <View style={styles.chartContainer}>
                        <PieChartComponent />
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default GraphPage;

const styles = StyleSheet.create({
    // Need to figure out why there is a big gab at the top of the screen
    container: {
        addingTop: StatusBar.currentHeight,
        flex: .94,
    },
    scrollView: {
        backgroundColor: primaryColor,
    },
    scrollableContent: {
        flex: 1,
        width: '100%', // Adjust the width as needed
        alignItems: 'center',
    },
    title: {
        fontWeight: 'bold',
        fontSize: 36,
        textAlign: 'center',
        color: secondaryColor,
        marginTop: 95,
    },
    chartContainer: {
        margin: 5,
        height: 280,
        width: 290,
        alignContent: 'center',
        justifyContent: 'center',
        backgroundColor: 'white',
        borderRadius: 20,
    },
    dateRange: {
        flexDirection: 'row',
        alignItems: 'center',
    },
});

