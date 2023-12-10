/**
 * @namespace Components
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

/**
 * Component for an Add Button
 * @param {object} props Props object. Props are onPress,
 * a function that is called when the button is pressed, 
 * the name of the button i.e what will be displayed and the button
 * color
 * @returns {object} The component object for the Button component
 * @memberof Components
 */

//Add, Edit, Cancel, Save buttons- Take in onPress, name, bg color
const ButtonComponent = ({ onPress, name, buttonColor, buttonStyle, buttonTextStyle }) => {
    return (
        <TouchableOpacity onPress={onPress}>
            <View style={[styles.button, { backgroundColor: buttonColor }, buttonStyle]}>
                <Text style={[styles.buttonText, buttonTextStyle]}>{name}</Text>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        padding: 10,
        width: 'auto',
        height: 'auto',
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonText: {
        fontFamily: 'Roboto-Bold',
        color: 'white',
        fontSize: 20,
        textAlign: 'center',
    },
});

export default ButtonComponent;
