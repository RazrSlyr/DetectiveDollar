import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import {
    TouchableOpacity,
    StyleSheet,
    Text,
    TextInput,
    View,
    Image,
    SafeAreaView,
} from 'react-native';

import { csvToJsonList } from '../util/CsvUtils';
import { getCurrentDateString } from '../util/DatetimeUtils';
import { addRowToExpenseSheet, getExpenseSheet } from '../util/FileSystemUtils';

export default function App({ navigation }) {
    const [name, setName] = useState('');
    const [amount, setAmount] = useState('');
    const [category, setCategory] = useState('');

    const handleButtonPress = async () => {
        // Add your button click logic here
        if (name === '' || amount === '' || category === '') {
            alert('Please Input a Name, Amount, and Category');
            return;
        }
        const dateString = getCurrentDateString();
        let expenseData = csvToJsonList(await getExpenseSheet());
        let max_id = -1;
        expenseData.forEach((entry) => {
            const entry_id = parseInt(entry['id'], 10);
            if (entry_id > max_id) {
                max_id = entry_id;
            }
        });
        await addRowToExpenseSheet(dateString, category, name, amount, max_id + 1);
        expenseData = csvToJsonList(await getExpenseSheet());
        navigation.navigate('Home');
    };

    const formattedAmount = amount.toLocaleString('en-US', {
        style: 'currency',
        currency: 'USD',
    });

    return (
        <View style={styles.container}>
            <Text style={[styles.title, styles.topTitle]}>Add{'\n'}Expense</Text>
            <StatusBar style="auto" />
            <View style={styles.box}>
                <Text
                    style={{
                        position: 'absolute',
                        fontFamily: 'Roboto-Bold',
                        color: '#d6dfda',
                        top: 5,
                        left: 5,
                    }}>
                    Today's Remaining Budget
                </Text>
                <Text style={{ ...styles.title, fontSize: 40, top: 10 }}>${formattedAmount}</Text>
            </View>
            <View style={styles.box2}>
                <TextInput
                    style={{ ...styles.input, position: 'absolute', top: 100 }}
                    placeholder="Name"
                    onChangeText={(value) => setName(value)}
                />
                <TextInput
                    style={{ ...styles.input, position: 'absolute', top: 150 }}
                    placeholder="Amount"
                    keyboardType="phone-pad"
                    maxLength={10}
                    onChangeText={(value) => setAmount(value)}
                />
                <TextInput
                    style={{ ...styles.input, position: 'absolute', top: 200 }}
                    placeholder="Category"
                    onChangeText={(value) => setCategory(value)}
                />
            </View>
            <TouchableOpacity style={styles.button} onPress={handleButtonPress}>
                <View style={styles.buttonContainer}>
                    <Text
                        style={{
                            fontFamily: 'Roboto-Bold',
                            color: '#ffffff',
                            textAlign: 'center',
                            fontSize: 30,
                        }}>
                        Add
                    </Text>
                </View>
            </TouchableOpacity>
            {/* <View style={{...styles.box, position: 'absolute', height: 60, bottom: 10, left: 10}}>
                <Text>Stored Name: {name}</Text>
                <Text>Stored Amount: {amount}</Text>
                <Text>Stored Category: {category}</Text>
            </View> */}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f9f9f9',
        alignItems: 'center',
        justifyContent: 'top',
    },
    topTitle: {
        paddingTop: 50,
        margin: 'auto',
    },
    title: {
        color: '#37c871',
        fontFamily: 'Roboto-Bold',
        fontSize: 30,
        textAlign: 'center',
        marginTop: 20,
    },
    box: {
        width: 300,
        height: 100,
        backgroundColor: '#ffffff',
        borderRadius: 10,
        margin: 10,
    },
    box2: {
        width: 300,
        height: 400,
        backgroundColor: '#ffffff',
        borderRadius: 10,
        margin: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    input: {
        color: '#1a1a1a',
        fontFamily: 'Roboto-Bold',
        fontSize: 20,
        width: 250,
        height: 40,
        borderColor: '#37c871',
        borderRadius: 10,
        padding: 10,
        textAlign: 'center',
    },
    button: {
        color: '#ffffff',
        fontFamily: 'Roboto-Bold',
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
});
