import { AntDesign } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import * as React from 'react';
import { useState, useRef, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, StatusBar, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Swiper from 'react-native-swiper';

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

    const [activeSlide, setActiveSlide] = useState(0);

    useEffect(() => {
        const unsubscribe = navigation.addListener('state', () => {
            // When the page comes into focus, set the active slide to 0 (the first slide)
            setActiveSlide(0);
            setSelectedTimeframe(WEEKLY);
            setSelectedTimeframeDates(getWeekStartEndDate(getCurrentDateString()));
        });
        return unsubscribe;
    }, []);

    return (
        <SafeAreaView style={styles.container}>
            <View>
                <Text style={styles.title}>Statistics</Text>
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
                    <Swiper
                        style={styles.wrapper}
                        dotStyle={styles.customDot}
                        activeDotStyle={styles.customActiveDot}
                        paginationStyle={{
                            top: -500,
                            left: 300,
                        }}
                        loop={false}
                        index={activeSlide}
                        onIndexChanged={(index) => {
                            setActiveSlide(index);
                        }}>
                        <View style={styles.pieChartSlide}>
                            <View style={styles.chartContainer}>
                                <NewPieChartComponent
                                    startDate={selectedTimeframeDates[0]}
                                    endDate={selectedTimeframeDates[1]}
                                    timeFrame={selectedTimeframe}
                                />
                            </View>
                        </View>
                        <View style={styles.lineChartSlide}>
                            <View style={styles.chartContainer} paddingTop={20}>
                                <LineGraphComponent
                                    startDate={selectedTimeframeDates[0]}
                                    endDate={selectedTimeframeDates[1]}
                                    timeFrame={selectedTimeframe}
                                />
                            </View>
                        </View>
                    </Swiper>
                </View>
            </View>
        </SafeAreaView>
    );
};

export default GraphPage;

const styles = StyleSheet.create({
    // Need to figure out why there is a big gab at the top of the screen
    container: {
        //paddingTop: StatusBar.currentHeight,
        flex: 1,
        alignItems: 'center',
    },
    scrollableContent: {
        flex: 1,
        width: '100%', // Adjust the width as needed
        height: 'auto',
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
    dateContainer: {
        //flex: 1,
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
        borderColor: Colors.secondaryColor,
        backgroundColor: Colors.primaryColor,
        borderRadius: 15,
        marginTop: 20,
        marginHorizontal: 2,
        overflow: 'hidden',
    },
    wrapper: {
        //showsPagination: true,
    },
    lineChartSlide: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingBottom: 60,
    },
    pieChartSlide: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingBottom: 60,
    },
    customDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: 'gray', // Color for non-active dots
    },
    customActiveDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: Colors.secondaryColor, // Color for the active dot
    },
    scrollContentContainer: {
        paddingBottom: 60,
    },
    chartContainer: {
        margin: 5,
        height: '100%',
        width: '90%',
        alignContent: 'center',
        justifyContent: 'center',
        backgroundColor: 'white',
        borderRadius: 20,
        //flex: 1,
    },
});
