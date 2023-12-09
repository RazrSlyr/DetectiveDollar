import { FontAwesome, MaterialIcons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import React, { useState } from 'react';
import { View, TouchableOpacity, Platform, Modal, StyleSheet, Text } from 'react-native';

import { SECONDARYCOLOR } from '../constants/Colors';
import { getDateStringFromDate } from '../util/DatetimeUtils';

const IOSDatePicker = ({ selectedDate, handleDateChange, hideDatePicker, styles }) => {
    return (
        <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
                <DateTimePicker
                    value={selectedDate}
                    mode="date"
                    //display="default"
                    display="inline"
                    onChange={handleDateChange}
                    themeVariant="light"
                />
                <TouchableOpacity style={styles.cancelButtonContainer} onPress={hideDatePicker}>
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default IOSDatePicker;
