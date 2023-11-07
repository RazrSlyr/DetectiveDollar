import * as React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { backgroundColor, primaryColor, secondaryColor, subHeadingColor } from '../../Colors';
import { PieChartComponent } from '../../components/PieChartComponent';
import ChartWithInteractivity  from '../../components/ChartWithInteractivity';

const GraphPage = ({ navigation }) => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Stats</Text>
            
            <View style={styles.lineChartContainer}>
                {/* put line chart here */}
                <ChartWithInteractivity />
            </View>
            <View style={styles.pieChartContainer}>
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
    lineChartContainer: {
        height: 260,
        width: 260,
        alignContent: 'center',
        backgroundColor: 'white',
        margin: 20,
    },
    pieChartContainer: {
        height: 280,
        width: 260,
        alignContent: 'center',
        justifyContent: 'center',
        backgroundColor: 'white',
    },
});
