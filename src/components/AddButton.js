/**
 * @namespace Components
 */

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

import { secondaryColor } from '../Colors';

/**
 * Component for an Add Button
 * @param {object} props Props object. Only prop is onPress,
 * a function that is called when the button is pressed
 * @returns {object} The component object for the Add Button
 * @memberof Components
 */
const AddButton = ({ onPress }) => {
    return (
        <TouchableOpacity onPress={onPress}>
            <View style={styles.button}>
                <Text style={styles.buttonText}>Add</Text>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        backgroundColor: secondaryColor,
        padding: 10,
        borderRadius: 10,
        marginTop: 20,
        width: 180,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 30,
    },
});

export default AddButton;
