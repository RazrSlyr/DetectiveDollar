import { FontAwesome, Entypo } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useMemo, useState } from 'react';
import { TouchableOpacity, StyleSheet, View, Text, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import DatePickerComponent from '../components/DatePickerComponent';
import EditExpenseComponent from '../components/EditExpenseComponent';
import ExpenseInfoComponent from '../components/ExpenseInfoComponent';
import * as Colors from '../constants/Colors';
import * as Sizes from '../constants/Sizes';
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
    getCategoryColorById,
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
            <TouchableOpacity style={styles.debug} onPress={handleAddFakeData}>
                <FontAwesome name="wrench" size={15} color="black" />
            </TouchableOpacity>
            <View style={styles.totalExpensesContainer}>
                <Text style={styles.subHeading}>Total Spendings</Text>
                <Text style={styles.textInput}>{`${spending}`}</Text>
            </View>
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
                                                style={{
                                                    ...styles.categoryName,
                                                    color: expense['categoryColor'],
                                                }}>
                                                {expense['category']}
                                            </Text>
                                        </View>
                                        <View style={styles.expenseNameBox}>
                                            <Text style={styles.expenseName}>
                                                {expense['name']}
                                            </Text>
                                            <Text style={styles.expenseData}>
                                                {expense['timestamp'].replace(/ /g, '\n')}
                                            </Text>
                                            {expense['reacurring_id'] && (
                                                <FontAwesome
                                                    name="repeat"
                                                    size={24}
                                                    color={Colors.secondaryColor}
                                                />
                                            )}
                                        </View>
                                        <View style={{ width: '30%' }}>
                                            <Text style={styles.expenseValue}>
                                                {'$' + parseFloat(expense['amount']).toFixed(2)}
                                            </Text>
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
        backgroundColor: Colors.secondaryColor,
        // figure out fontStyles
    },
    secondaryContainer: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: Colors.textColor,
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
        fontSize: Sizes.titleSize,
        color: Colors.secondaryColor,
        marginRight: 15,
    },
    totalExpensesContainer: {
        backgroundColor: 'white',
        borderRadius: 15,
        marginTop: 0,
        marginBottom: 20,
        height: 'auto',
        width: '70%',
        margin: 30,
        top: 10,
    },
    subHeading: {
        color: Colors.subHeadingColor,
        fontSize: Sizes.subText,
        margin: 'auto',
        paddingLeft: 10,
        paddingTop: 5,
    },
    subHeading2: {
        color: Colors.textColor,
        fontSize: Sizes.textSize,
        margin: 'auto',
        paddingLeft: 10,
        padding: 5,
        textAlign: 'left',
    },
    textInput: {
        fontSize: Sizes.largeText,
        margin: 'auto',
        textAlign: 'center',
    },
    expensesContainer: {
        backgroundColor: Colors.primaryColor,
        width: '100%',
        height: '70%',
        padding: 10,
        margin: 10,
        borderRadius: 32,
        //borderTopLeftRadius: 32, // Radius for the top-left corner
        //borderTopRightRadius: 32, // Radius for the top-right corner
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
        width: '40%',
        height: 55,
        margin: 5,
    },
    expenseName: {
        fontSize: Sizes.textSize,
        color: Colors.textColor,
    },
    expenseData: {
        fontSize: Sizes.subText,
        color: Colors.subHeadingColor,
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
        color: Colors.textColor,
        fontSize: Sizes.textSize,
        textAlign: 'left',
    },
    arrowsAndTotalExpenseContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    arrows: {
        color: Colors.secondaryColor,
    },
    debug: {
        backgroundColor: Colors.secondaryColor,
        borderWidth: 2,
        borderColor: 'black',
        width: 20,
        height: 20,
        right: 180,
        top: 50,
    },
});
