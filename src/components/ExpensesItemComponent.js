import { FontAwesome } from '@expo/vector-icons';
import { TouchableOpacity, StyleSheet, View, Text, Alert } from 'react-native';

import * as Colors from '../constants/Colors';
import {
    getCurrentDateString,
    getDateFromUTCDatetimeString,
    getDatetimeString,
} from '../util/DatetimeUtils';
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
const ExpenseItemComponent = (onPress, onDelete, expense) => {
    const date = getDateFromUTCDatetimeString(expense['timestamp']);
    const datetime = getDatetimeString(date);
    return (
        <TouchableOpacity
            onPress={async () => {
                await onPress;
            }}>
            <View style={styles.expenseBoxes}>
                <View style={styles.colorAndCategoryBox}>
                    <View
                        style={[styles.colorCircle, { backgroundColor: expense['categoryColor'] }]}
                    />
                    <Text
                        numberOfLines={1}
                        ellipsizeMode="tail"
                        style={[styles.categoryName, { color: expense['categoryColor'] }]}>
                        {expense['category']}
                    </Text>
                </View>
                <View style={styles.expenseNameBox}>
                    <Text numberOfLines={1} ellipsizeMode="tail" style={styles.expenseName}>
                        {expense['name']}
                    </Text>
                    <Text style={styles.expenseData}>{datetime.replace(' ', '\n')}</Text>
                </View>
                <View style={{ flex: 1, flexDirection: 'row' }}>
                    {expense['reacurring_id'] && (
                        <View style={{ marginRight: 30 }}>
                            <FontAwesome name="repeat" size={24} color={Colors.SECONDARYCOLOR} />
                        </View>
                    )}
                    <Text numberOfLines={1} ellipsizeMode="tail" style={styles.expenseValue}>
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
                                    onPress: async () => {
                                        //delete from table
                                        await onDelete();
                                    },
                                },
                            ]
                        );
                    }}>
                    <FontAwesome name="remove" size={20} color="red" />
                </TouchableOpacity>
            </View>
        </TouchableOpacity>
    );
};
export default ExpenseItemComponent;
const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: Colors.SECONDARYCOLOR,
        // figure out fontStyles
    },
});
