/**
 * @file Code for the user's History screen.
 * Allows the user to look and search through all of their expenses
 */

import { FontAwesome, AntDesign } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useMemo, useState } from 'react';
import {
    TouchableOpacity,
    StyleSheet,
    View,
    Text,
    Alert,
    FlatList,
    TextInput,
    ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import ExpenseInfoComponent from '../components/ExpenseInfoComponent';
import * as Colors from '../constants/Colors';
import * as Sizes from '../constants/Sizes';
import {
    getExpenseUpdatesInSession,
    isFirstCheck,
    resetExpenseUpdatesInSession,
} from '../util/DatabaseUtils';
import { getDateFromUTCDatetimeString, getDatetimeString } from '../util/DatetimeUtils';
import { deleteRowFromExpenseTable, getExpensesTableCategoryJoin, getRowFromExpenseTable } from '../util/ExpenseTableUtils';
import { deleteImage } from '../util/ImageUtils';
import { applyRecurringExpenses, deleteRowFromReacurringTable } from '../util/RecurringTableUtils';

export default function HistoryPage({ navigation }) {
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [allExpenses, setAllExpeneses] = useState([]);
    const [showExpenseInfo, setShowExpenseInfo] = useState(false);
    const [selectedExpense, setSelectedExpense] = useState();

    const expensesToDisplay = useMemo(() => {
        return searchQuery.length === 0
            ? allExpenses
            : allExpenses.filter((expense) =>
                  expense['name'].toLocaleLowerCase().includes(searchQuery.toLocaleLowerCase())
              );
    }, [allExpenses, searchQuery]);

    useEffect(() => {
        const getExpenses = async () => {
            try {
                if (!isFirstCheck() & (getExpenseUpdatesInSession() === 0)) {
                    return;
                }
                setLoading(true);
                // Apply recurring expenses
                await applyRecurringExpenses();
                // Fetch expenses and set to state
                const expenses = await getExpensesTableCategoryJoin();
                setAllExpeneses(expenses);
                setLoading(false);
                console.log('expenses set!');
                resetExpenseUpdatesInSession();
            } catch (error) {
                console.error('Error fetching expenses:', error);
            }
        };

        // Add an event listener for focus to re-fetch expenses when the component comes into focus
        const unsubscribe = navigation.addListener('focus', getExpenses);

        // Clean up the event listener when the component unmounts
        return () => unsubscribe();
    }, [navigation]);

    const handleDelete = async (expense) => {
        deleteImage(expense['picture']);
        const expenseId = expense['id'];

        const rowData = await getRowFromExpenseTable(expense['id']);
        const promises = [deleteRowFromExpenseTable(expense['id'])];
        if (rowData['reacurring_id'] != null) {
            promises.push(deleteRowFromReacurringTable(rowData['reacurring_id']));
        }
        await Promise.all(promises);
        const expenses = allExpenses.filter((expense) => expense['id'] !== expenseId);
        setAllExpeneses(expenses);
    };

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
            <Text style={styles.titleText}>All Expenses</Text>
            {!loading && (
                <View style={styles.searchBar}>
                    <AntDesign name="search1" size={20} color={Colors.TEXTCOLOR} />
                    <TextInput
                        style={styles.input}
                        placeholder="Search Expenses..."
                        onChangeText={(text) => setSearchQuery(text)}
                    />
                </View>
            )}
            <View style={styles.expensesContainer}>
                {loading && <ActivityIndicator size={200} color={Colors.SECONDARYCOLOR} />}
                {!loading && (
                    <FlatList
                        contentContainerStyle={styles.scrollableContent}
                        data={[...expensesToDisplay].reverse()}
                        renderItem={(row) => {
                            const expense = row['item'];
                            const date = getDateFromUTCDatetimeString(expense['timestamp']);
                            const datetime = getDatetimeString(date);
                            return (
                                <TouchableOpacity
                                    onPress={async () => {
                                        setSelectedExpense(expense);
                                        openInfo();
                                    }}>
                                    <View key={expense['id']} style={styles.expenseBoxes}>
                                        <View style={styles.colorAndCategoryBox}>
                                            <View
                                                style={{
                                                    ...styles.colorCircle,
                                                    backgroundColor: expense['color'],
                                                }}
                                            />
                                            <Text
                                                style={{
                                                    ...styles.categoryName,
                                                    color: expense['color'],
                                                }}>
                                                {expense['category']}
                                            </Text>
                                        </View>
                                        <View style={styles.expenseNameBox}>
                                            <Text style={styles.expenseName}>
                                                {expense['name']}
                                            </Text>
                                            <Text style={styles.expenseData}>
                                                {datetime.replace(/ /g, '\n')}
                                            </Text>
                                        </View>
                                        <View style={{ alignItems: 'center', width: '25%' }}>
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
                        }}
                        keyExtractor={(expense) => expense['id']}
                        scrollEnabled
                    />
                )}
            </View>
            <ExpenseInfoComponent
                isVisible={showExpenseInfo}
                onClose={closeInfo}
                expense={selectedExpense}
                onHome={false}
                onUpdateExpenses={() => {}}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: Colors.SECONDARYCOLOR,
    },
    expensesContainer: {
        backgroundColor: Colors.PRIMARYCOLOR,
        width: '100%',
        height: '80%',
        padding: 10,
        margin: 10,
        borderRadius: 32,
    },
    scrollableContent: {
        display: 'flex',
        flexDirection: 'column',
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
        margin: 5,
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
        width: '20%',
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
    },
    colorCircle: {
        width: 30,
        height: 30,
        borderRadius: 15,
    },
    categoryName: {
        fontSize: 10,
    },
    titleText: {
        fontWeight: 'bold',
        fontSize: 35,
        color: Colors.PRIMARYCOLOR,
    },
    input: {
        width: '84%',
        color: Colors.TEXTCOLOR,
        fontSize: Sizes.TEXTSIZE,
        textAlign: 'left',
    },
    searchBar: {
        display: 'flex',
        flexDirection: 'row',
        gap: 10,
        alignItems: 'center',
        backgroundColor: 'white',
        paddingVertical: 2,
        paddingHorizontal: 10,
        borderRadius: 25,
    },
});
