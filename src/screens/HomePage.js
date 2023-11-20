import { FontAwesome, Entypo } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useMemo, useState } from 'react';
import { TouchableOpacity, StyleSheet, View, Text, ScrollView, Alert } from 'react-native';

import MyDateTimePicker from '../components/DatePickerComponent';
import { primaryColor, secondaryColor, subHeadingColor } from '../constants/Colors';
import { getCurrentDateString } from '../util/DatetimeUtils';
import { deleteRowFromExpenseTable, getExpensesFromDay } from '../util/FileSystemUtils';

export default function HomePage({ navigation }) {
    const [todayExpenses, setTodayExpenses] = useState([]);
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

    return (
        <View style={styles.container}>
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
                                                color={secondaryColor}
                                            />
                                        )}
                                    </View>
                                    <Text style={styles.expenseData}>{expense['amount']}</Text>
                                    {/* This code handles the expense deletion */}
                                    <TouchableOpacity
                                        onPress={async () => {
                                            Alert.alert(
                                                'Deleting Expense',
                                                'Are you sure you want to delete this expense? This cannot be undone.',
                                                [
                                                    { text: 'NO' },
                                                    {
                                                        text: 'YES',
                                                        onPress: async () => {
                                                            await deleteRowFromExpenseTable(
                                                                expense['id']
                                                            );
                                                            setTodayExpenses(
                                                                await getExpensesFromDay(
                                                                    getCurrentDateString()
                                                                )
                                                            );
                                                        },
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
    },
    totalExpensesContainer: {
        backgroundColor: 'white',
        borderRadius: 15,
        marginTop: 20,
        marginBottom: 20,
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
    arrowsAndTotalExpenseContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    arrows: {
        color: secondaryColor,
    },
});
