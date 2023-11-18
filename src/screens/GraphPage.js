import * as React from 'react';
import { StyleSheet, Text, View, ScrollView, StatusBar} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';

import ChartWithInteractivity from '../../components/ChartWithInteractivity';
import LineGraphComponent from '../../components/LineGraphComponent';
import PieChartComponent from '../../components/PieChartComponent';
import { primaryColor, secondaryColor, subHeadingColor } from '../constants/Colors';




const GraphPage = ({ navigation }) => {
    return (
        <SafeAreaView style={styles.container}>
            <ScrollView >
                <Text style={styles.title}>Stats</Text>
                <View style={styles.scrollableContent}>
                    <View style={styles.chartContainer}>
                        {/* put line chart here later */}
                        <LineGraphComponent />
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
});

