import { FontAwesome, Entypo } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useMemo, useState } from 'react';
import {
    TouchableOpacity,
    StyleSheet,
    View,
    Text,
    ScrollView,
    Alert,
    SafeAreaView,
} from 'react-native';

import DatePickerComponent from '../components/DatePickerComponent';
import ExpenseInfoComponent from '../components/ExpenseInfoComponent';
import * as Colors from '../constants/Colors';
import { getCurrentDateString } from '../util/DatetimeUtils';
import {
    deleteRowFromExpenseTable,
    deleteRowFromReacurringTable,
    getExpensesFromDay,
    getRowFromExpenseTable,
    deleteImage,
    getCategoryNameFromId,
    applyRecurringExpenses,
    createExampleData,
} from '../util/FileSystemUtils';

export default function HomePage({ navigation }) {
    const [todayExpenses, setTodayExpenses] = useState([]);
    const [targetDate, setTargetDate] = useState(getCurrentDateString());
    const [showExpenseInfo, setShowExpenseInfo] = useState(false);
    const [selectedExpense, setSelectedExpense] = useState();

    useEffect(() => {
        const getExpenses = async () => {
            try {
                // Apply recurring expenses
                await applyRecurringExpenses();
                // Fetch expenses for today and set to state
                const expenses = await getExpensesFromDay(targetDate);
                // Change expense categoryId to name
                for (let i = 0; i < expenses.length; i++) {
                    expenses[i]['category'] = await getCategoryNameFromId(expenses[i]['category']);
                }
                // Change expense categoryId to name
                setTodayExpenses(expenses);
                // console.log('expenses set!');
            } catch (error) {
                console.error('Error fetching expenses:', error);
            }
        };

        // Add an event listener for focus to re-fetch expenses when the component comes into focus
        const unsubscribe = navigation.addListener('focus', getExpenses);

        // Clean up the event listener when the component unmounts
        return () => unsubscribe();
    }, [targetDate, navigation]);

    const handleDateChange = async (newDate) => {
        try {
            // Fetch expenses for new date and set to new state
            const expenses = await getExpensesFromDay(newDate);
            // Change expense categoryId to name
            for (let i = 0; i < expenses.length; i++) {
                expenses[i]['category'] = await getCategoryNameFromId(expenses[i]['category']);
            }
            setTodayExpenses(expenses);
            setTargetDate(newDate);
        } catch (error) {
            console.error('Error fetching expenses for new date:', error);
        }
    };

    const spending = useMemo(() => {
        if (todayExpenses?.length === 0) {
            return 0;
        }
        let newSpending = 0;
        todayExpenses.forEach(async (expense) => {
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

    const handleDelete = async (expense) => {
        deleteImage(expense['picture']);

        const rowData = await getRowFromExpenseTable(expense['id']);
        const promises = [deleteRowFromExpenseTable(expense['id'])];
        if (rowData['reacurring_id'] != null) {
            promises.push(deleteRowFromReacurringTable(rowData['reacurring_id']));
        }
        await Promise.all(promises);
        // Fetch expenses for today and set to state
        const expenses = await getExpensesFromDay(targetDate);
        // Change expense categoryId to name
        for (let i = 0; i < expenses.length; i++) {
            expenses[i]['category'] = await getCategoryNameFromId(expenses[i]['category']);
        }
        setTodayExpenses(expenses);
    };

    const handleAddFakeData = async () => {
        alert('Adding example data...');
        // Add expenses
        await createExampleData();

        // Fetch expenses for today and set to state
        const expenses = await getExpensesFromDay(targetDate);
        // Change expense categoryId to name
        for (let i = 0; i < expenses.length; i++) {
            expenses[i]['category'] = await getCategoryNameFromId(expenses[i]['category']);
        }
        setTodayExpenses(expenses);
        alert('Data has been added and set');
    };

    // make date more readable
    const parts = targetDate.split('-');
    const year = parts[0];
    const month = parts[1];
    const day = parts[2];

    // Format the date as "month/day/year"
    const formattedDate = `${month}/${day}/${year}`;

    // error says too many re-renders
    // // for arrow buttons
    // const dayPlusOne = Number(day) + 1;
    // const datePlusOne = `${year}-${month}-${dayPlusOne}`;
    // const dayMinusOne = Number(day) - 1;
    // const dateMinusOne = `${year}-${month}-${dayMinusOne}`;

    const openInfo = async () => {
        setShowExpenseInfo(true);
    };
    const closeInfo = () => {
        setSelectedExpense(null);
        setShowExpenseInfo(false);
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar style="auto" />
            <Text style={[styles.title, styles.topTitle]}>Daily Spending</Text>
            <TouchableOpacity style={styles.calendarContainer} activeOpacity={0.7}>
                <DatePickerComponent onDateChange={handleDateChange} />
            </TouchableOpacity>
            <View style={styles.totalExpensesContainer}>
                <Text style={styles.subHeading}>Expenses for {formattedDate}</Text>
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
                                                color={Colors.secondaryColor}
                                            />
                                        )}
                                    </View>
                                    <Text style={styles.expenseData}>
                                        {parseFloat(expense['amount']).toFixed(2)}
                                    </Text>
                                    {/* This code handles the expense deletion */}
                                    <TouchableOpacity
                                        onPress={async () => {
                                            setSelectedExpense(expense);
                                            openInfo();
                                        }}>
                                        <Entypo name="info-with-circle" size={40} color="black" />
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        onPress={async () => {
                                            Alert.alert(
                                                'Deleting Expense',
                                                'Are you sure you want to delete this expense? This cannot be undone.',
                                                [
                                                    { text: 'NO' },
                                                    {
                                                        text: 'YES',
                                                        onPress: async () => handleDelete(expense),
                                                    },
                                                ]
                                            );
                                        }}>
                                        <View>
                                            <Text style={{ color: 'red' }}> X </Text>
                                        </View>
                                    </TouchableOpacity>
                                    {/* End expense deletion code */}
                                </View>
                            );
                        })}
                        {/* Add more content as needed */}
                    </View>
                </ScrollView>
            </View>
            <TouchableOpacity style={styles.button} onPress={handleAddFakeData}>
                <View style={styles.buttonContainer}>
                    <Text
                        style={{
                            color: '#ffffff',
                            textAlign: 'center',
                            fontSize: 25,
                        }}>
                        Add Example Data
                    </Text>
                </View>
            </TouchableOpacity>
            <ExpenseInfoComponent
                isVisable={showExpenseInfo}
                onClose={closeInfo}
                expense={selectedExpense}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: Colors.primaryColor,
        // figure out fontStyles
    },
    button: {
        color: '#ffffff',
        fontSize: 20,
        width: 250,
        height: 40,
        outlineColor: '#37c871',
        borderColor: '#37c871',
        borderRadius: 10,
        textAlign: 'center',
    },
    buttonContainer: {
        backgroundColor: '#37c871',
        padding: 10,
        borderRadius: 10,
        height: 60,
    },
    topTitle: {
        paddingTop: 20,
        margin: 'auto',
    },
    titleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 60,
        width: 270,
        height: 80,
        backgroundColor: 'white',
        borderRadius: 15,
    },
    title: {
        fontWeight: 'bold',
        fontSize: 36,
        color: Colors.secondaryColor,
        marginRight: 15,
    },
    totalExpensesContainer: {
        backgroundColor: 'white',
        borderRadius: 15,
        marginTop: 20,
        marginBottom: 20,
        height: 'auto',
        width: 270,
        alignItems: 'center',
        justifyContent: 'center',
        margin: 30,
    },
    subHeading: {
        color: Colors.subHeadingColor,
        fontSize: 13,
        margin: 'auto',
        paddingLeft: 10,
        paddingTop: 10,
    },
    textInput: {
        fontSize: 50,
        margin: 'auto',
    },
    expensesContainer: {
        // backgroundColor: 'green',
        flex: 1 / 2,
        width: '70%',
        borderRadius: 10,
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
        borderRadius: 10,
        borderWidth: 2,
        borderColor: Colors.secondaryColor,
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
    calendarContainer: {
        borderRadius: 35,
        backgroundColor: 'white',
        padding: 15,
    },
    arrowsAndTotalExpenseContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    arrows: {
        color: Colors.secondaryColor,
    },
});
