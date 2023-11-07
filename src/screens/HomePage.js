import { FontAwesome } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useMemo, useState } from 'react';
import { StyleSheet, View, Text, ScrollView } from 'react-native';

import { primaryColor, secondaryColor, subHeadingColor } from '../constants/Colors';
import { getCurrentDateString } from '../util/DatetimeUtils';
import { getExpensesFromDay } from '../util/FileSystemUtils';

export default function HomePage({ navigation }) {
    const [todayExpenses, setTodayExpenses] = useState([]);
    const spending = useMemo(() => {
        if (todayExpenses?.length === 0) {
            return 0;
        }
        let newSpending = 0;
        todayExpenses.forEach((expense) => {
            newSpending += parseFloat(expense['amount']);
        });
        const todaySpending = newSpending.toLocaleString('en-US', {
            style: 'currency',
            currency: 'USD',
        });
        return todaySpending;
    }, [todayExpenses]);

    const goToAddPage = () => {
        navigation.navigate('AddExpense'); // change TEMPORARY to actual page
    };

    useEffect(() => {
        const getExpenses = async () => {
            setTodayExpenses(await getExpensesFromDay(getCurrentDateString()));
        };
        navigation.addListener('focus', () => {
            getExpenses();
        });
    }, []);
    return (
        <View style={styles.container}>
            <Text style={[styles.title, styles.topTitle]}>Daily</Text>
            <Text style={styles.title}>Summary</Text>
            <View style={styles.totalExpensesContainer}>
                <Text style={styles.subHeading}>Today's Expenses</Text>
                <Text style={styles.textInput}>{`${spending}`}</Text>
            </View>
            <View style={styles.expensesContainer}>
                <Text style={styles.subHeading}>History</Text>
                <ScrollView>
                    <View style={styles.scrollableContent}>
                        {/* Place your scrollable content here */}
                        {todayExpenses.reverse().map((expense) => {
                            return (
                                <View key={expense['id']} style={styles.expenseBoxes}>
                                    <Text style={styles.expenseData}>{expense['category']}</Text>
                                    <View style={styles.expenseNameBox}>
                                        <Text style={styles.expenseData}>{expense['name']}</Text>
                                        {expense['reacurring_id'] && (
                                            <FontAwesome
                                                name="repeat"
                                                size={24}
                                                color={secondaryColor}
                                            />
                                        )}
                                    </View>
                                    <Text style={styles.expenseData}>{expense['amount']}</Text>
                                </View>
                            );
                        })}
                        {/* Add more content as needed */}
                    </View>
                </ScrollView>
            </View>
            {/* This will add the add button to the home page. I have not set up the naviagtion for it 
            so when it is added back it will produce an error  */}
            {/* <AddButton onPress={goToAddPage} /> */}

            <StatusBar style="auto" />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: primaryColor,
        // figure out fontStyles
    },
    topTitle: {
        paddingTop: 50,
        margin: 'auto',
    },
    title: {
        fontWeight: 'bold',
        fontSize: 36,
        color: secondaryColor,
    },
    totalExpensesContainer: {
        backgroundColor: 'white',
        borderRadius: 15,
        margin: 20,
        height: 100,
        width: 270,
        alignItems: 'center',
        justifyContent: 'center',
    },
    subHeading: {
        color: subHeadingColor,
        fontSize: 24,
        margin: 'auto',
        paddingLeft: 10,
        paddingTop: 10,
    },
    textInput: {
        fontSize: 50,
        margin: 'auto',
        paddingLeft: 10,
        paddingBottom: 5,
    },
    expensesContainer: {
        backgroundColor: 'green',
        flex: 1 / 2,
        width: '70%',
        borderRadius: 15,
        borderWidth: 2,
    },
    scrollableContent: {
        flex: 1,
        width: '100%', // Adjust the width as needed
        alignItems: 'center',
    },
    expenseBoxes: {
        width: '100%',
        height: 60,
        backgroundColor: 'white',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        borderRadius: 15,
        borderWidth: 2,
        borderColor: secondaryColor,
    },
    expenseData: {
        textAlign: 'center',
    },
    expenseNameBox: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 8,
    },
});
