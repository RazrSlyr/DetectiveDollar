/**
 * @file Code for the user's Home screen.
 * User's home page. Shows today's expenses with a datepicker component
 * to look through different days
 */

import { FontAwesome } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useMemo, useState } from 'react';
import { TouchableOpacity, StyleSheet, View, Text, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import DatePickerComponent from '../components/DatePickerComponent';
import ExpenseInfoComponent from '../components/ExpenseInfoComponent';
import TodaySpendingComponent from '../components/TodaysExpenseComponent';
import * as Colors from '../constants/Colors';
import * as Sizes from '../constants/Sizes';
import { getCategoryColorById, getCategoryNameFromId } from '../util/CategoryTableUtils';
import {
    getCurrentDateString,
    getDateFromUTCDatetimeString,
    getDatetimeString,
} from '../util/DatetimeUtils';
import {
    deleteRowFromExpenseTable,
    getExpensesFromDay,
    getRowFromExpenseTable,
} from '../util/ExpenseTableUtils';
import { deleteImage } from '../util/ImageUtils';
import { applyRecurringExpenses, deleteRowFromReacurringTable } from '../util/RecurringTableUtils';
import { createExampleData } from '../util/TestUtils';

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
                    expenses[i]['categoryId'] = expenses[i]['category'];
                    expenses[i]['categoryColor'] = await getCategoryColorById(
                        expenses[i]['category']
                    );
                    expenses[i]['category'] = await getCategoryNameFromId(expenses[i]['category']);
                }
                // Change expense categoryId to name
                setTodayExpenses(expenses);
                //console.log('expenses set!', expenses);
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
                expenses[i]['categoryId'] = expenses[i]['category'];
                expenses[i]['categoryColor'] = await getCategoryColorById(expenses[i]['category']);
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
            expenses[i]['categoryId'] = expenses[i]['category'];
            expenses[i]['categoryColor'] = await getCategoryColorById(expenses[i]['category']);
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
            expenses[i]['categoryId'] = expenses[i]['category'];
            expenses[i]['categoryColor'] = await getCategoryColorById(expenses[i]['category']);
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

    const openInfo = async () => {
        setShowExpenseInfo(true);
    };
    const closeInfo = () => {
        setSelectedExpense(null);
        setShowExpenseInfo(false);
    };

    const handleExpenseEdit = async () => {
        // Trigger a refresh of expenses when the expense is edited
        try {
            // Apply recurring expenses
            await applyRecurringExpenses();
            // Fetch expenses for today and set to state
            const expenses = await getExpensesFromDay(targetDate);
            // Change expense categoryId to name
            for (let i = 0; i < expenses.length; i++) {
                expenses[i]['categoryId'] = expenses[i]['category'];
                expenses[i]['categoryColor'] = await getCategoryColorById(expenses[i]['category']);
                expenses[i]['category'] = await getCategoryNameFromId(expenses[i]['category']);
            }
            // Change expense categoryId to name
            setTodayExpenses(expenses);
            const updateCurrentExpense = expenses.find((item) => item.id === selectedExpense?.id);
            setSelectedExpense(updateCurrentExpense);
        } catch (error) {
            console.error('Error fetching expenses:', error);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar style="auto" />
            <TouchableOpacity style={styles.debug} onPress={handleAddFakeData}>
                <FontAwesome name="wrench" size={15} color="black" />
            </TouchableOpacity>
            <TodaySpendingComponent
                todayExpenses={todayExpenses}
                subHeadingText="Total Spendings"
                containerWidth="70%"
            />
            <View style={styles.calendarContainer} activeOpacity={0.7}>
                <Text style={styles.calendarDate}>{formattedDate}</Text>
                <View style={{ position: 'absolute', right: 10 }}>
                    <DatePickerComponent onDateChange={handleDateChange} />
                </View>
            </View>
            <View style={styles.expensesContainer}>
                <Text style={styles.subHeading2}>Transactions</Text>
                <ScrollView>
                    <View style={styles.scrollableContent}>
                        {/* Place your scrollable content here */}
                        {todayExpenses.map((expense) => {
                            const date = getDateFromUTCDatetimeString(expense['timestamp']);
                            const datetime = getDatetimeString(date);
                            return (
                                <TouchableOpacity
                                    key={expense.id}
                                    onPress={async () => {
                                        setSelectedExpense(expense);
                                        openInfo();
                                    }}>
                                    <View key={expense['id']} style={styles.expenseBoxes}>
                                        <View style={styles.colorAndCategoryBox}>
                                            <View
                                                style={{
                                                    ...styles.colorCircle,
                                                    backgroundColor: expense['categoryColor'],
                                                }}
                                            />
                                            <Text
                                                numberOfLines={1}
                                                ellipsizeMode="tail"
                                                style={{
                                                    ...styles.categoryName,
                                                    color: expense['categoryColor'],
                                                }}>
                                                {expense['category']}
                                            </Text>
                                        </View>
                                        <View style={styles.expenseNameBox}>
                                            <Text
                                                numberOfLines={1}
                                                ellipsizeMode="tail"
                                                style={styles.expenseName}>
                                                {expense['name']}
                                            </Text>
                                            <Text style={styles.expenseData}>
                                                {datetime.replace(' ', '\n')}
                                            </Text>
                                        </View>
                                        <View style={{ alignItems: 'center', width: '30%' }}>
                                            <Text
                                                numberOfLines={1}
                                                ellipsizeMode="tail"
                                                style={styles.expenseValue}>
                                                {'$' + parseFloat(expense['amount']).toFixed(2)}
                                            </Text>
                                        </View>
                                        <View
                                            style={{
                                                width: '15%',
                                                alignItems: 'center',
                                                right: 5,
                                            }}>
                                            {expense['reacurring_id'] && (
                                                <FontAwesome
                                                    name="repeat"
                                                    size={24}
                                                    color={Colors.SECONDARYCOLOR}
                                                />
                                            )}
                                        </View>
                                        <TouchableOpacity
                                            onPress={async () => {
                                                Alert.alert(
                                                    'Deleting Expense',
                                                    'Are you sure you want to delete this expense? This cannot be undone.',
                                                    [
                                                        { text: 'NO' },
                                                        {
                                                            text: 'YES',
                                                            onPress: async () =>
                                                                handleDelete(expense),
                                                        },
                                                    ]
                                                );
                                            }}>
                                            <FontAwesome name="remove" size={20} color="red" />
                                        </TouchableOpacity>
                                    </View>
                                </TouchableOpacity>
                            );
                        })}
                        {/* Add more content as needed */}
                    </View>
                </ScrollView>
            </View>
            <ExpenseInfoComponent
                isVisible={showExpenseInfo}
                onClose={() => {
                    closeInfo();
                }}
                onHome
                expense={selectedExpense}
                onUpdateExpenses={() => {
                    handleExpenseEdit();
                }}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: Colors.SECONDARYCOLOR,
        // figure out fontStyles
    },
    secondaryContainer: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: Colors.TEXTCOLOR,
    },
    button: {
        color: 'white',
        fontSize: 20,
        width: 250,
        height: 40,
        outlineColor: Colors.SECONDARYCOLOR,
        borderColor: Colors.SECONDARYCOLOR,
        borderRadius: 10,
        textAlign: 'center',
    },
    buttonContainer: {
        backgroundColor: Colors.SECONDARYCOLOR,
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
        fontSize: Sizes.TITLESIZE,
        color: Colors.SECONDARYCOLOR,
        marginRight: 15,
    },
    subHeading2: {
        color: Colors.TEXTCOLOR,
        fontSize: Sizes.TEXTSIZE,
        margin: 'auto',
        paddingLeft: 10,
        padding: 5,
        textAlign: 'left',
    },
    expensesContainer: {
        backgroundColor: Colors.PRIMARYCOLOR,
        width: '100%',
        height: '70%',
        padding: 10,
        margin: 10,
        borderRadius: 32,
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
        alignItems: 'center',
        borderRadius: 10,
        borderWidth: 2,
        borderColor: 'white',
        marginVertical: 5,
        paddingHorizontal: 5,
        paddingVertical: 5,
    },
    expenseNameBox: {
        width: '30%',
        height: 55,
        margin: 5,
    },
    expenseName: {
        fontSize: Sizes.TEXTSIZE,
        color: Colors.TEXTCOLOR,
    },
    expenseData: {
        fontSize: Sizes.SUBTEXT,
        color: Colors.SUBHEADINGCOLOR,
    },
    expenseValue: {
        fontSize: 20,
        color: 'red',
    },
    colorAndCategoryBox: {
        width: 'auto',
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 5,
    },
    colorCircle: {
        width: 30,
        height: 30,
        borderRadius: 15,
    },
    categoryName: {
        fontSize: 10,
        overflow: 'hidden',
        width: 60,
        justifyContent: 'center',
        alignContent: 'center',
        textAlign: 'center',
    },
    calendarContainer: {
        flex: 0,
        borderRadius: 10,
        height: '5%',
        backgroundColor: 'white',
        padding: 2,
        width: '50%',
        justifyContent: 'center',
    },
    calendarDate: {
        color: Colors.TEXTCOLOR,
        fontSize: Sizes.TEXTSIZE,
        textAlign: 'left',
    },
    arrowsAndTotalExpenseContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    arrows: {
        color: Colors.SECONDARYCOLOR,
    },
    debug: {
        backgroundColor: Colors.SECONDARYCOLOR,
        borderWidth: 2,
        borderColor: 'black',
        width: 20,
        height: 20,
        right: 180,
        top: 50,
    },
});
