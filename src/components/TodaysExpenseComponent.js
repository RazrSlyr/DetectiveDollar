import React, { useMemo } from 'react';
import { Text, StyleSheet, View } from 'react-native';

import * as Colors from '../constants/Colors';
import * as Sizes from '../constants/Sizes';

const TodaySpendingComponent = ({ todayExpenses, subHeadingText, containerWidth }) => {
    const spending = useMemo(() => {
        if (!todayExpenses || todayExpenses.length === 0) {
            return '$0.00';
        }

        let newSpending = 0;

        todayExpenses.forEach(async (expense) => {
            newSpending += parseFloat(expense['amount']);
        });

        const TwoDecimalSpending = newSpending.toFixed(2);

        const todaySpending = parseFloat(TwoDecimalSpending).toLocaleString('en-US', {
            style: 'currency',
            currency: 'USD',
        });

        return todaySpending;
    }, [todayExpenses]);

    return (
        <View style={[styles.container, { width: containerWidth }]}>
            <Text style={styles.subHeading}>{subHeadingText}</Text>
            <View style={styles.expenseContainer}>
                <Text style={styles.expense}>{spending}</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        borderRadius: 15,
        margin: 15,
        height: '11%',
    },
    subHeading: {
        color: Colors.SUBHEADINGCOLOR,
        fontSize: Sizes.SUBTEXT,
        margin: 'auto',
        paddingLeft: 10,
        paddingTop: 5,
    },
    expenseContainer: {
        alignItems: 'center',
        justifyContent: 'center',

    },
    expense: {
        fontSize: Sizes.LARGETEXT,
        margin: 'auto',
        textAlign: 'center',
        height: 'auto',
        width: '70%',
    },
});

export default TodaySpendingComponent;
