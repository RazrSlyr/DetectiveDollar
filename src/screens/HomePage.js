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

import MyDateTimePicker from '../components/DatePickerComponent';
import { primaryColor, secondaryColor, subHeadingColor } from '../constants/Colors';
import ExpenseInfoComponent from '../components/ExpenseInfoComponent';
import * as Colors from '../constants/Colors';
import { getCurrentDateString } from '../util/DatetimeUtils';
import {
    applyRecurringExpenses,
    deleteRowFromExpenseTable,
    deleteRowFromReacurringTable,
    getCategoryTable,
    getExpensesFromDay,
    getRowFromExpenseTable,
    deleteImage,
} from '../util/FileSystemUtils';

export default function HomePage({ navigation }) {
    const [todayExpenses, setTodayExpenses] = useState([]);
    const [showExpenseInfo, setShowExpenseInfo] = useState(false);
    const [selectedExpense, setSelectedExpense] = useState();

    const [date, setCurrentDate] = useState(getCurrentDateString());
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

    const handleDelete = async (expense) => {
        deleteImage(expense['picture']);

        const rowData = await getRowFromExpenseTable(expense['id']);
        const promises = [deleteRowFromExpenseTable(expense['id'])];
        if (rowData['reacurring_id'] != null) {
            promises.push(deleteRowFromReacurringTable(rowData['reacurring_id']));
        }
        await Promise.all(promises);
        setTodayExpenses(await getExpensesFromDay(getCurrentDateString()));
    };
    const getExpenses = async () => {
        // console.log(date);
        setTodayExpenses(await getExpensesFromDay(date));
    };

    // Get new date when date picker is called
    const handleDateChange = (newDate) => {
        setCurrentDate(newDate);
        // fetch expenses for new date
        getExpenses();
    };

    useEffect(() => {
        // initial fetch
        getExpenses();

            await applyRecurringExpenses();
        // Listener to fetch expenses when screen in focus
        if (navigation && navigation.addListener) {
            const focusListener = navigation.addListener('focus', () => {
                getExpenses();
            });

            // error when trying to remove
            // // cleanup listener
            // return () => {
            //     focusListener.remove();
            // };
        }
    }, [navigation]);

    // make date more readable
    const parts = date.split('-');
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
            <View style={styles.titleContainer}>
                <Text style={[styles.title, styles.topTitle]}>{formattedDate}</Text>
                {/* Date Selector */}
                <MyDateTimePicker onDateChange={handleDateChange} />
            </View>
            <View style={styles.arrowsAndTotalExpenseContainer}>
                {/* Need to add onPress={handleDateChange(dateMinusOne)}, 
                but gives error too many re-renders.
                */}
                <TouchableOpacity>
                    <Entypo name="triangle-left" size={52} style={styles.arrows} />
                </TouchableOpacity>
                <View style={styles.totalExpensesContainer}>
                    <Text>Total Spending for {formattedDate}</Text>
                    <Text style={styles.textInput}>{`${spending}`}</Text>
                </View>
                <TouchableOpacity>
                    <Entypo name="triangle-right" size={52} style={styles.arrows} />
                </TouchableOpacity>
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
                                    <Text style={styles.expenseData}>{expense['amount']}</Text>
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
    topTitle: {
        paddingTop: 60,
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
        color: secondaryColor,
        marginRight: 15,
        fontSize: 36,
        color: Colors.secondaryColor,
    },
    totalExpensesContainer: {
        backgroundColor: 'white',
        borderRadius: 15,
        marginTop: 20,
        marginBottom: 20,
        height: 100,
        height: 'auto',
        width: 270,
        alignItems: 'center',
        justifyContent: 'center',
        margin: 30,
        borderRadius: 15,
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
    arrowsAndTotalExpenseContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    arrows: {
        color: Colors.secondaryColor,
    },
});
