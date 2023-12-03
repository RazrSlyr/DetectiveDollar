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

const GraphPage = ({ navigation }) => {
    return (
        <View>
            <Text>History</Text>
        </View>
    );
};

export default GraphPage;
