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
            <View style={styles.expenseContainer}>
                <Text style={[styles.subHeading]}>{subHeadingText}</Text>
                <Text style={[styles.expense]} numberOfLines={1} adjustsFontSizeToFit>
                    {spending}
                </Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        borderRadius: 15,
        margin: 10,
        height: '12%',
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingHorizontal: 5,
        paddingVertical: 3,
    },
    subHeading: {
        color: Colors.SUBHEADINGCOLOR,
        fontSize: Sizes.SUBTEXT,
        marginHorizontal: 5,
        marginVertical: 3,
    },
    expenseContainer: {
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        height: 'auto',
        width: '100%',
    },
    expense: {
        fontSize: Sizes.LARGETEXT,
        textAlign: 'center',
        width: '100%',
        alignSelf: 'center',
    },
});

export default TodaySpendingComponent;
