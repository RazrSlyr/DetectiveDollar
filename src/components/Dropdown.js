import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';

import { SECONDARYCOLOR, TEXTCOLOR } from '../constants/Colors';
import * as Sizes from '../constants/Sizes';

/**
 * Component for the selecting an element from a dropdown
 * @param {object} props. Props object. The props are data (object),
 * onChange (callback), dropdownLabel (string), and placeholderLabel (string)
 * @returns {object} The component object for the Date Picker
 * @memberof Components
 */
function DropdownSelector({ data, onChange, dropdownLabel, placeholderLabel }) {
    const [value, setValue] = useState(null);
    const [isFocus, setIsFocus] = useState(false);

    const renderLabel = () => {
        if (value || isFocus) {
            return (
                <Text style={[styles.label, isFocus && { color: SECONDARYCOLOR }]}>
                    {dropdownLabel}
                </Text>
            );
        }
        return null;
    };

    return (
        <View style={styles.container}>
            <Dropdown
                style={[styles.dropdown, isFocus && { borderColor: SECONDARYCOLOR }]}
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
                inputSearchStyle={styles.inputSearchStyle}
                iconStyle={styles.iconStyle}
                data={data}
                //search
                maxHeight={300}
                labelField="label"
                valueField="value"
                placeholder={!isFocus ? placeholderLabel : '...'}
                searchPlaceholder="Search..."
                value={value}
                onFocus={() => setIsFocus(true)}
                onBlur={() => setIsFocus(false)}
                onChange={(item) => {
                    onChange(item);
                    setValue(item.value);
                    setIsFocus(false);
                }}
                mode="default"
            />
        </View>
    );
}

export default DropdownSelector;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '84%',
    },
    dropdown: {
        width: '100%',
        height: 'auto',
    },
    icon: {
        marginRight: 5,
    },
    label: {
        position: 'absolute',
        left: 22,
        top: 8,
        zIndex: 999,
        paddingHorizontal: 8,
        fontSize: 14,
        color: TEXTCOLOR,
    },
    placeholderStyle: {
        fontSize: Sizes.TEXTSIZE,
        fontWeight: 'bold',
        color: '#ccc',
    },
    selectedTextStyle: {
        fontSize: Sizes.TEXTSIZE,
        fontWeight: 'bold',
        color: TEXTCOLOR,
    },
    iconStyle: {
        width: 20,
        height: 20,
    },
    inputSearchStyle: {
        height: 40,
        fontSize: Sizes.TEXTSIZE,
        fontWeight: 'bold',
        color: TEXTCOLOR,
    },
});
