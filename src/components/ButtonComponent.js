import React from 'react';
import { Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';

import * as Colors from '../constants/Colors';
import * as Sizes from '../constants/Sizes';
/**
 * Component for a Button
 * @param {object} props Props object. Props are onPress,
 * a function that is called when the button is pressed,
 * the name of the button (string) i.e what will be displayed and the button,
 * the background color of the button (color string),
 * the style for the button (object),
 * and the style for the button text (object)
 * @returns {object} The component object for the Button component
 * @memberof Components
 */

//Add, Edit, Cancel, Save buttons- Take in onPress, name, bg color
const ButtonComponent = ({
    onPress,
    name,
    buttonColor,
    buttonStyle = {},
    buttonTextStyle = {},
}) => {
    return (
        <TouchableOpacity
            onPress={onPress}
            style={[styles.button, { backgroundColor: buttonColor }, buttonStyle]}>
            <Text style={[styles.buttonText, buttonTextStyle]} numberOfLines={1}>
                {name}
            </Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        height: 'auto',
        borderRadius: Dimensions.get('window').height / 2,
        paddingVertical: 5,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.SECONDARYCOLOR,
    },
    buttonText: {
        color: 'white',
        fontFamily: 'Roboto-Bold',
        fontSize: Sizes.BUTTONTEXT,
        fontWeight: 'bold',
        textAlign: 'center',
    },
});

export default ButtonComponent;
