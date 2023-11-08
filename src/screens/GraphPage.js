import * as React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import ChartWithInteractivity from '../../components/ChartWithInteractivity';
import PieChartComponent from '../../components/PieChartComponent';
import { primaryColor, secondaryColor, subHeadingColor } from '../constants/Colors';

const GraphPage = ({ navigation }) => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Stats</Text>
            <View style={styles.chartContainer}>
                {/* put line chart here later */}
                <ChartWithInteractivity />
            </View>
            <View style={styles.chartContainer}>
                <PieChartComponent />
            </View>
        </View>
    );
};

export default GraphPage;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: primaryColor,
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
        width: 260,
        alignContent: 'center',
        justifyContent: 'center',
        backgroundColor: 'white',
        borderRadius: 20,
    },
});
