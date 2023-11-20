import { FontAwesome, MaterialIcons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import React, { useState } from 'react';
import { View, TouchableOpacity, Platform, Modal, StyleSheet, Text } from 'react-native';

import { secondaryColor } from '../constants/Colors';

const MyDateTimePicker = ({ onDateChange }) => {
    const [date, setDate] = useState(new Date());
    const [isModalVisible, setModalVisibility] = useState(false);

    const showDatePicker = () => {
        setModalVisibility(true);
    };

    const hideDatePicker = () => {
        // console.log("Hiding modal");
        setModalVisibility(false);
    };

    const handleDateChange = (event, selectedDate) => {
        setModalVisibility(Platform.OS === 'ios');
        if (selectedDate) {
            setDate(selectedDate);
            // Extract year, month, and day
            const year = selectedDate.getFullYear();
            const month = selectedDate.getMonth() + 1; // Months are zero-based, so add 1
            let day = selectedDate.getDate();
            if (day < 10) {
                day = '0' + day;
            }
            const formattedDate = `${year}-${month}-${day}`;
            // console.log("date selected ", formattedDate);

            onDateChange(formattedDate); // this notify's parent component about date change
            hideDatePicker();
        }
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
                        <TouchableOpacity style={styles.cancelButtonContainer} onPress={hideDatePicker}>
                            <MaterialIcons name="cancel" color="red" size={20} />
                        </TouchableOpacity>
                        <DateTimePicker
                            value={date}
                            mode="date"
                            display={Platform.OS === 'ios' ? 'spinner' : 'calendar'}
                            onChange={handleDateChange}
                        />
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: 'rgba(0, 0, 0, 1)',
        borderRadius: 10,
        alignItems: 'center',
    },
    cancelButtonContainer: {
        height: 'auto',
        width: 'auto',
        position: 'absolute',
        right: 0,
        top: 0,
        // marginLeft: 'auto',
    },
});

export default MyDateTimePicker;
