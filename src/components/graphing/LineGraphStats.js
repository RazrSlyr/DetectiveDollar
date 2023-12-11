import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

import * as Colors from '../../constants/Colors';
import { YEARLY } from '../../constants/FrequencyConstants';

/**
 * Component for expense statistics relating to a Line Graph
 * @param {object} props Props object. Props are totalSpending (float), averageExpense,
 * and timeFrame (use FrequencyConstants)
 * @returns {object} The component object for the Line Graph Statistics
 * @memberof Components
 */
const LineGraphStats = ({ totalSpending, averageExpense, timeFrame }) => {
    return (
        <View style={styles.statsBox}>
            <View style={styles.statsDataBox}>
                <View style={styles.statsInfo}>
                    <Text style={styles.statsData}>Total Spending:</Text>
                </View>
                <Text style={styles.statsData} marginRight={10}>
                    ${totalSpending}
                </Text>
            </View>
            <View style={styles.statsDataBox}>
                <View style={styles.statsInfo}>
                    {timeFrame === YEARLY ? (
                        <Text style={styles.statsData}>Average Monthly Spending: </Text>
                    ) : (
                        <Text style={styles.statsData}>Average Daily Spending: </Text>
                    )}
                </View>
                <Text style={styles.statsData} marginRight={10}>
                    ${averageExpense}
                </Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    statsBox: {
        justifyContent: 'center',
        marginTop: -30,
    },
    statsDataBox: {
        width: 300,
        height: 40,
        backgroundColor: 'white',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderRadius: 10,
        borderWidth: 1.5,
        borderColor: Colors.SUBHEADINGCOLOR,
        marginTop: 2,
    },
    statsInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 10, // Adjust this to control space between text and dot
    },
    statsData: {
        textAlign: 'center',
        fontSize: 14,
    },
});

export default LineGraphStats;
