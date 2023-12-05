import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

import { YEARLY } from '../constants/FrequencyConstants';

const LineGraphStats = ({ totalSpending, averageExpense, timeFrame }) => {
    /* // - Total Expenses:Display the sum of all expenses for the specified time frame.
const totalExpenses = (lineGraphData) => {

};
// - Average Expense: Calculate and display the average expense per day, week, or month. 
const averageExpenses = (lineGraphData, timeFrame) => {

};
//- Number of Transactions: Display the total number of transactions made during the specified time frame.
const numberOfExpenses = (lineGraphData) => {

}; */

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
        borderColor: '#b7c8be',
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
