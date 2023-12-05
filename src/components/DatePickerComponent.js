import { FontAwesome, MaterialIcons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import React, { useState } from 'react';
import { View, TouchableOpacity, Platform, Modal, StyleSheet, Text } from 'react-native';

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
            // Extract year, month, and day
            const year = newSelectedDate.getFullYear();
            const month = newSelectedDate.getMonth() + 1; // Months are zero-based, so add 1
            let day = newSelectedDate.getDate();
            if (day < 10) {
                day = '0' + day;
            }
            // const formattedDate = `${year}-${month}-${day}`;
            // console.log("date selected ", formattedDate);

            onDateChange(getDateStringFromDate(newSelectedDate)); // this notify's parent component about date change
        }
        hideDatePicker();
    };

    return (
        <View>
            <TouchableOpacity onPress={showDatePicker} style={{ alignItems: 'center' }}>
                <FontAwesome name="calendar" size={30} color={secondaryColor} />
            </TouchableOpacity>

            <Modal
                transparent
                animationType="slide"
                visible={isModalVisible}
                onRequestClose={hideDatePicker}>
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
                        {isIOS && (
                            <TouchableOpacity
                                style={styles.cancelButtonContainer}
                                onPress={hideDatePicker}>
                                <Text style={styles.cancelButtonText}>Cancel</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                </View>
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
