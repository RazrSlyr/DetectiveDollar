/**
 * @file Code for the user's History screen.
 * Allows the user to look and search through all of their expenses 
 */

import { FontAwesome, Entypo, AntDesign } from '@expo/vector-icons';
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
    deleteRowFromExpenseTable,
    deleteRowFromReacurringTable,
    getRowFromExpenseTable,
    deleteImage,
    getCategoryNameFromId,
    applyRecurringExpenses,
    getExpenseTable,
    getCategoryColorByName,
    getCategoryColorById,
} from '../util/FileSystemUtils';

export default function HistoryPage({ navigation }) {
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [allExpenses, setAllExpeneses] = useState([]);
    const expensesToDisplay = useMemo(() => {
        return searchQuery.length === 0
            ? allExpenses
            : allExpenses.filter((expense) =>
                  expense['name'].toLocaleLowerCase().includes(searchQuery.toLocaleLowerCase())
              );
    }, [allExpenses, searchQuery]);

    const [showExpenseInfo, setShowExpenseInfo] = useState(false);
    const [selectedExpense, setSelectedExpense] = useState();

    useEffect(() => {
        const getExpenses = async () => {
            try {
                setLoading(true);
                // Apply recurring expenses
                await applyRecurringExpenses();
                // Fetch expenses and set to state
                const expenses = await getExpenseTable();
                // Change expense categoryId to name
                for (let i = 0; i < expenses.length; i++) {
                    expenses[i]['categoryColor'] = await getCategoryColorById(
                        expenses[i]['category']
                    );
                    expenses[i]['category'] = await getCategoryNameFromId(expenses[i]['category']);
                }
                // Change expense categoryId to name
                setAllExpeneses(expenses);
                setLoading(false);
                // console.log('expenses set!');
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
                    <AntDesign name="search1" size={20} color={Colors.textColor} />
                    <TextInput
                        style={styles.input}
                        placeholder="Search Expenses..."
                        onChangeText={(text) => setSearchQuery(text)}
                    />
                </View>
            )}
            <View style={styles.expensesContainer}>
                {loading && <ActivityIndicator size={200} color={Colors.secondaryColor} />}
                {!loading && (
                    <FlatList
                        contentContainerStyle={styles.scrollableContent}
                        data={expensesToDisplay}
                        renderItem={(row) => {
                            const expense = row['item'];
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
                        }}
                        keyExtractor={(expense) => expense['id']}
                        scrollEnabled
                    />
                )}
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
    },
    expensesContainer: {
        backgroundColor: Colors.primaryColor,
        width: '100%',
        height: '70%',
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
        color: Colors.primaryColor,
    },
    input: {
        width: '84%',
        color: Colors.textColor,
        fontSize: Sizes.textSize,
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
