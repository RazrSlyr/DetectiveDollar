import { StatusBar } from 'expo-status-bar';
import { useEffect, useMemo, useState } from 'react';
import { StyleSheet, View, Text, TextInput, ScrollView, VirtualizedList } from 'react-native';

import { backgroundColor, primaryColor, secondaryColor, subHeadingColor } from '../../Colors';
// import AddButton from '../../components/AddButton';
import { csvToJsonList } from '../util/CsvUtils';
import { getCurrentDateString } from '../util/DatetimeUtils';
import { getExpenseSheet } from '../util/FileSystemUtils';

export default function HomePage({ navigation }) {
    const [expenses, setExpense] = useState([]);
    const spending = useMemo(() => {
        let newSpending = 0;
        expenses
            // eslint-disable-next-line eqeqeq
            .filter((expense) => expense['date'] == getCurrentDateString())
            .forEach((expense) => {
                newSpending += parseInt(expense['amount'], 10);
            });
        return newSpending;
    }, [expenses]);

    const goToAddPage = () => {
        navigation.navigate('AddExpense'); // change TEMPORARY to actual page
    };

    useEffect(() => {
        const querySheet = async () => {
            setExpense(csvToJsonList(await getExpenseSheet()));
        };
        querySheet();
        navigation.addListener('focus', () => {
            querySheet();
        });
    }, []);
    return (
        <View style={styles.container}>
            <Text style={[styles.title, styles.topTitle]}>Daily</Text>
            <Text style={styles.title}>Summary</Text>
            <View style={styles.totalExpensesContainer}>
                <Text style={styles.subHeading}>Today's Expenses</Text>
                <Text style={styles.textInput}>{`$${spending}`}</Text>
            </View>
            <View style={styles.expensesContainer}>
                <Text style={styles.subHeading}>History</Text>
                <ScrollView>
                    <View style={styles.scrollableContent}>
                        {/* Place your scrollable content here */}
                        {expenses.reverse().map((expense) => {
                            return (
                                <View key={expense['id']} style={styles.expenseBoxes}>
                                    <Text style={styles.expenseData}>{expense['category']}</Text>
                                    <Text style={styles.expenseData}>{expense['name']}</Text>
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
        flex: 1 / 4,
        margin: 20,
        width: '70%',
        alignItems: 'right',
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
        height: 70,
        backgroundColor: 'white',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 15,
        borderWidth: 2,
        borderColor: secondaryColor,
    },
    expenseData: {
        width: '30%',
        textAlign: 'center',
    },
});
