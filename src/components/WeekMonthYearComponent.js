import { useFocusEffect } from '@react-navigation/native';
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';

import * as Colors from '../constants/Colors';
import { YEARLY, MONTHLY, WEEKLY } from '../constants/FrequencyConstants';
/**
 * Component for displaying a the W M Y buttons for changing the graph timeframe
 * @param {object} props Props object. Only prop is onSelect (callback)
 * @returns {object} The component object for graph frequency buttons
 * @memberof Components
 */
const WeekMonthYearButtons = ({ onSelect }) => {
    const [selection, setSelection] = useState(0);

    const handlePress = (value) => {
        const dateStep = [WEEKLY, MONTHLY, YEARLY];
        setSelection(value);
        if (onSelect) {
            onSelect(dateStep[value]);
        }
    };
    useFocusEffect(
        React.useCallback(() => {
            setSelection(0);
        }, [])
    );
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.btnGroup}>
                <TouchableOpacity
                    style={[
                        styles.btn,
                        selection === 0 ? { backgroundColor: Colors.SECONDARYCOLOR } : null,
                    ]}
                    onPress={() => handlePress(0)}>
                    <Text style={[styles.btnText, selection === 0 ? { color: 'white' } : null]}>
                        W
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[
                        styles.btn,
                        selection === 1 ? { backgroundColor: Colors.SECONDARYCOLOR } : null,
                    ]}
                    onPress={() => handlePress(1)}>
                    <Text style={[styles.btnText, selection === 1 ? { color: 'white' } : null]}>
                        M
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[
                        styles.btn,
                        selection === 2 ? { backgroundColor: Colors.SECONDARYCOLOR } : null,
                    ]}
                    onPress={() => handlePress(2)}>
                    <Text style={[styles.btnText, selection === 2 ? { color: 'white' } : null]}>
                        Y
                    </Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        //flex: 1,
        alignItems: 'center',
        margin: 'auto',
        height: 100,
    },
    btnGroup: {
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 0,
        width: 130,
    },
    btn: {
        flex: 1,
        borderWidth: 1,
        borderColor: Colors.SECONDARYCOLOR,
        backgroundColor: Colors.PRIMARYCOLOR,
        borderRadius: 10,
        marginTop: 20,
        marginHorizontal: 2,
        marginBottom: 10,
    },
    btnText: {
        textAlign: 'center',
        paddingVertical: 10,
        fontSize: 14,
    },
});

export default WeekMonthYearButtons;
