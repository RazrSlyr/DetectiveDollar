import React from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
import DateTimePicker from 'react-native-ui-datepicker';

import { secondaryColor } from '../constants/Colors';
import { getDateFromDatetimeString } from '../util/DatetimeUtils';

const AndroidDatePicker = ({ selectedDate, handleDateChange, hideDatePicker, styles }) => {
    return (
        <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
                <DateTimePicker
                    value={selectedDate}
                    onValueChange={(value) =>
                        handleDateChange(null, getDateFromDatetimeString(value + ':00'))
                    }
                    displayFullDays
                    locale="en"
                    mode="datetime"
                    selectedItemColor={secondaryColor}
                />
                <TouchableOpacity style={styles.cancelButtonContainer} onPress={hideDatePicker}>
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default AndroidDatePicker;
