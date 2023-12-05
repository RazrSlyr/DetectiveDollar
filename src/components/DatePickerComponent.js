import { FontAwesome, MaterialIcons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import React, { useState } from 'react';
import { View, TouchableOpacity, Platform, Modal, StyleSheet, Text } from 'react-native';

import AndroidDatePicker from './AndroidDatePicker';
import IOSDatePicker from './IOSDatePicker';
import { secondaryColor } from '../constants/Colors';
import { getDateStringFromDate } from '../util/DatetimeUtils';

const DatePickerComponent = ({ onDateChange }) => {
    const isIOS = Platform.OS === 'ios';
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [isModalVisible, setModalVisibility] = useState(false);

    const showDatePicker = () => {
        setModalVisibility(true);
    };

    const hideDatePicker = () => {
        // console.log("Hiding modal");
        setModalVisibility(false);
    };

    const handleDateChange = (event, newSelectedDate) => {
        if (newSelectedDate) {
            setSelectedDate(newSelectedDate);
            onDateChange(getDateStringFromDate(newSelectedDate)); // this notify's parent component about date change
        }
        hideDatePicker();
    };

    return (
        <View>
            <TouchableOpacity onPress={showDatePicker} style={{ alignItems: 'center' }}>
                <FontAwesome name="calendar" size={30} color={secondaryColor} />
            </TouchableOpacity>

            <Modal transparent visible={isModalVisible} onRequestClose={hideDatePicker}>
                {isIOS && (
                    <IOSDatePicker
                        selectedDate={selectedDate}
                        handleDateChange={handleDateChange}
                        hideDatePicker={hideDatePicker}
                        styles={styles}
                    />
                )}
                {!isIOS && (
                    <AndroidDatePicker
                        selectedDate={selectedDate}
                        handleDateChange={handleDateChange}
                        hideDatePicker={hideDatePicker}
                        styles={styles}
                    />
                )}
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    modalContainer: {
        height: 'auto',
        width: 'auto',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        height: 'auto',
        width: 'auto',
        backgroundColor: 'white',
        // backgroundColor: 'rgba(0, 0, 0, 1)',
        borderRadius: 10,
        alignItems: 'center',
        zIndex: 100,
    },
    cancelButtonContainer: {
        marginTop: 10,
        marginBottom: 2,
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 20,
        alignItems: 'center',
        top: -15,
        backgroundColor: '#0a84ff',
    },
    cancelButtonText: {
        color: 'white',
        fontSize: 16,
    },
});

export default DatePickerComponent;
