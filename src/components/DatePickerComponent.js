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
            // onDateChange(selectedDate); // this notify's parent component about date change
            // TODO: pull data from selectedDate

            hideDatePicker();
            console.log(selectedDate);
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
                        <View style={styles.cancelButton}>
                            <TouchableOpacity onPress={hideDatePicker}>
                                <MaterialIcons name="cancel" size={30} color="red" />
                            </TouchableOpacity>
                        </View>
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
    cancelButton: {
        marginLeft: 'auto',
    }
});

export default MyDateTimePicker;
