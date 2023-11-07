import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { TouchableOpacity, StyleSheet, Text, TextInput, View, Dimensions } from 'react-native';

import DropdownSelector from '../components/Dropdown';
import { textColor } from '../constants/Colors';
import { DAILY, MONTHLY, NO_REPETION, WEEKLY } from '../constants/FrequencyConstants';
import { getCurrentDateString } from '../util/DatetimeUtils';
import { addRowToExpenseTable } from '../util/FileSystemUtils';

export default function App({ navigation }) {
    const [name, setName] = useState('');
    const [amount, setAmount] = useState('');
    const [category, setCategory] = useState('');
    const [frequency, setFrequency] = useState(NO_REPETION);

    const handleButtonPress = async () => {
        // Add your button click logic here
        if (name === '' || amount === '' || category === '') {
            alert('Please Input a Name, Amount, and Category');
            return;
        }
        const dateString = getCurrentDateString();
        await addRowToExpenseTable(name, category, parseFloat(amount), dateString, frequency);
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
                    style={styles.input}
                    placeholder="Name"
                    onChangeText={(value) => setName(value)}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Amount"
                    keyboardType="numeric"
                    maxLength={10}
                    onChangeText={(value) => setAmount(value)}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Category"
                    onChangeText={(value) => setCategory(value)}
                />
                <DropdownSelector
                    data={[
                        { label: "Don't Repeat", value: NO_REPETION },
                        { label: 'Daily', value: DAILY },
                        { label: 'Weekly', value: WEEKLY },
                        { label: 'Monthly', value: MONTHLY },
                    ]}
                    onChange={(item) => {
                        setFrequency(item.value);
                    }}
                    dropdownLabel="Expense Frequency"
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
        height: Dimensions.get('window').height * 0.4,
        backgroundColor: '#ffffff',
        borderRadius: 10,
        margin: 10,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
    },
    input: {
        color: textColor,
        fontFamily: 'Roboto-Bold',
        fontSize: 20,
        width: 250,
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
