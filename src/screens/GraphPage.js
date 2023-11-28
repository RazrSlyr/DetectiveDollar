import { AntDesign } from '@expo/vector-icons';
import * as React from 'react';
import { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, StatusBar, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import LineGraphComponent from '../components/LineGraphComponent';
import NewPieChartComponent from '../components/NewPieChartComponent';
import WeekMonthYearButtons from '../components/weekMonthYearComponent';
import * as Colors from '../constants/Colors';
import { YEARLY, MONTHLY, WEEKLY } from '../constants/FrequencyConstants';
import {
    getCurrentDateString,
    getWeekStartEndDate,
    getNextWeekStartEndDate,
    getPreviousWeekStartEndDate,
    getMonthStartEndDate,
    getNextMonthStartEndDate,
    getPreviousMonthStartEndDate,
    getYearStartEndDate,
    getPreviousYearStartEndDate,
    getNextYearStartEndDate,
} from '../util/DatetimeUtils';

const GraphPage = ({ navigation }) => {
    const [selectedTimeframe, setSelectedTimeframe] = useState(WEEKLY);
    const [selectedTimeframeDates, setSelectedTimeframeDates] = useState(
        getWeekStartEndDate(getCurrentDateString())
    );

    const handleTimeframeSelect = (value) => {
        setSelectedTimeframe(value);

        if (value === WEEKLY) {
            const selectedTimeframeDates = getWeekStartEndDate(getCurrentDateString());
            setSelectedTimeframeDates(selectedTimeframeDates);
        } else if (value === MONTHLY) {
            const selectedTimeframeDates = getMonthStartEndDate(getCurrentDateString());
            setSelectedTimeframeDates(selectedTimeframeDates);
        } else if (value === YEARLY) {
            const selectedTimeframeDates = getYearStartEndDate(getCurrentDateString());
            setSelectedTimeframeDates(selectedTimeframeDates);
        }
    };

    const handleIncrementTimeFrame = () => {
        if (selectedTimeframe === WEEKLY) {
            if (new Date(getCurrentDateString()) > new Date(selectedTimeframeDates[1])) {
                setSelectedTimeframeDates(getNextWeekStartEndDate(selectedTimeframeDates[1]));
            }
        } else if (selectedTimeframe === MONTHLY) {
            if (new Date(getCurrentDateString()) > new Date(selectedTimeframeDates[1])) {
                setSelectedTimeframeDates(getNextMonthStartEndDate(selectedTimeframeDates[1]));
            }
        } else if (selectedTimeframe === YEARLY) {
            if (new Date(getCurrentDateString()) > new Date(selectedTimeframeDates[1])) {
                setSelectedTimeframeDates(getNextYearStartEndDate(selectedTimeframeDates[1]));
            }
        }
    };

    const handleDecrementTimeFrame = () => {
        if (selectedTimeframe === WEEKLY) {
            setSelectedTimeframeDates(getPreviousWeekStartEndDate(selectedTimeframeDates[1]));
        } else if (selectedTimeframe === MONTHLY) {
            setSelectedTimeframeDates(getPreviousMonthStartEndDate(selectedTimeframeDates[1]));
        } else if (selectedTimeframe === YEARLY) {
            setSelectedTimeframeDates(getPreviousYearStartEndDate(selectedTimeframeDates[1]));
        }
    };

    const formatDateforDisplay = (dateString) => {
        const date = new Date(dateString + 'T00:00:00Z'); // Set the time zone to UTC
        const year = date.getUTCFullYear();
        const month = String(date.getUTCMonth() + 1).padStart(2, '0');
        const day = String(date.getUTCDate()).padStart(2, '0');
        return `${month}/${day}/${year}`;
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false}>
                <Text style={styles.title}>Reports</Text>
                <View style={styles.dateContainer}>
                    <View style={styles.dateRange}>
                        <TouchableOpacity onPress={handleDecrementTimeFrame}>
                            <View style={styles.arrow}>
                                <AntDesign
                                    name="leftcircle"
                                    color="#37c871"
                                    backgroundColor="#f2f2f2"
                                    size={30}
                                />
                            </View>
                        </TouchableOpacity>
                        <Text style={styles.date}>
                            {`${formatDateforDisplay(selectedTimeframeDates[0])}`}
                        </Text>
                        <Text> _ </Text>
                        <Text style={styles.date}>
                            {`${formatDateforDisplay(selectedTimeframeDates[1])}`}
                        </Text>
                        <TouchableOpacity onPress={handleIncrementTimeFrame}>
                            <View style={styles.arrow}>
                                <AntDesign
                                    name="rightcircle"
                                    color="#37c871"
                                    backgroundColor="#f2f2f2"
                                    size={30}
                                />
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
                <WeekMonthYearButtons onSelect={handleTimeframeSelect} />
                <View style={styles.scrollableContent}>
                    <View style={styles.lineChartContainer}>
                        <LineGraphComponent
                            startDate={selectedTimeframeDates[0]}
                            endDate={selectedTimeframeDates[1]}
                            timeFrame={selectedTimeframe}
                        />
                    </View>
                    <View style={styles.chartContainer}>
                        <NewPieChartComponent
                            startDate={selectedTimeframeDates[0]}
                            endDate={selectedTimeframeDates[1]}
                            timeFrame={selectedTimeframe}
                        />
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
        paddingTop: StatusBar.currentHeight,
        flex: 1,
        alignItems: 'center',
    },
    scrollableContent: {
        flex: 1,
        width: '100%', // Adjust the width as needed
        height: '100%',
        alignItems: 'center',
        marginTop: -20,
    },
    title: {
        fontWeight: 'bold',
        fontSize: 36,
        textAlign: 'center',
        color: Colors.secondaryColor,
        marginTop: 20,
    },
    chartContainer: {
        margin: 5,
        height: 320,
        width: 290,
        alignContent: 'center',
        justifyContent: 'center',
        backgroundColor: 'white',
        borderRadius: 20,
        flex: 1,
    },
    lineChartContainer: {
        margin: 5,
        height: 300,
        width: 360,
        alignContent: 'center',
        justifyContent: 'center',
        backgroundColor: 'white',
        borderRadius: 20,
        paddingTop: 40,
    },
    dateContainer: {
        flex: 1,
        alignItems: 'center',
    },
    arrow: {
        alignSelf: 'center',
        alignItem: 'center',
        margin: 5,
        paddingTop: 15,
    },
    dateRange: {
        flexDirection: 'row',
        alignItems: 'center',
        width: 310,
    },
    date: {
        textAlign: 'center',
        paddingVertical: 10,
        fontSize: 14,
        flex: 1,
        borderWidth: 1,
        borderColor: '#37c871',
        backgroundColor: '#f9f9f9',
        borderRadius: 15,
        marginTop: 20,
        marginHorizontal: 2,
        //marginBottom: 10,
        overflow: 'hidden',
    },
});
