import { AntDesign, Feather } from '@expo/vector-icons';
import { Image } from 'expo-image';
import * as MediaLibrary from 'expo-media-library';
import React, { useState, useEffect } from 'react';
import {
    TouchableOpacity,
    StyleSheet,
    Text,
    View,
    SafeAreaView,
    Dimensions,
} from 'react-native';
import Modal from "react-native-modal";

import * as Colors from '../constants/Colors';
import { getDateFromUTCDatetimeString, getDatetimeString } from '../util/DatetimeUtils';
const EditExpenseComponent = ({ isVisable, onClose, expense = null }) => {
    const [hasMediaLibraryPermission, setMediaLibraryPermission] = useState();

    useEffect(() => {
        (async () => {
            const mediaLibaryPermission = await MediaLibrary.requestPermissionsAsync();
            setMediaLibraryPermission(mediaLibaryPermission.status === 'granted');
        })();
    }, []);
    {
        /* <Modal animationType="slide" transparent visible={isVisable} onRequestClose={() => onClose}> */}
    return (
        <Modal isVisible={isVisable} onBackdropPress={onClose}>
            {expense ? (
                <SafeAreaView style={styles.container}>
                    <View style={styles.textContainer}>
                        <Text style={styles.title}>Edit</Text>
                    </View>
                    <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.saveButton} onPress={onClose}>
                            <Text style={styles.buttonText}>Save</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
                            <Text style={styles.buttonText}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </SafeAreaView>
            ) : (
                <View style={styles.container}>
                    <Text>Expense is null</Text>
                </View>
            )}
        </Modal>
    );
};
export default EditExpenseComponent;

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 30,
        maxHeight: '90%',
        padding: 20,
    },
    circleContainer: {
        width: Dimensions.get('window').width / 2, // Set the desired width of the circle
        height: Dimensions.get('window').width / 2, // Set the desired height of the circle
        borderRadius: Dimensions.get('window').width / 4, // Half of the width and height to create a circle
        overflow: 'hidden', // Clip the content to the circle shape
        backgroundColor: Colors.subHeadingColor,
        justifyContent: 'center',
        alignItems: 'center',
    },
    circleImage: {
        width: '100%',
        height: '100%',
    },
    buttonContainer: {
        justifyContent: 'center',
        alignItems: 'flex-end',
        flexDirection: 'row',
    },
    cancelButton: {
        backgroundColor: 'red',
        padding: 10,
        borderRadius: 20,
        height: 40,
        width: 80,
        margin:10,
    },
    saveButton: {
        backgroundColor: 'green',
        padding: 10,
        borderRadius: 20,
        height: 40,
        width: 80,
        margin:10,
    },
    buttonText: {
        textAlign: 'center',
        fontSize: 20,
        color: '#ffffff',
    },
    memoContainer: {
        height: 200,
    },
    textContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: 5,
    },
    titleText: {
        fontSize: 15,
    },
    valueText: {
        fontSize: 20,
    },
    title: {
        fontWeight: 'bold',
        fontSize: 33,
        color: Colors.secondaryColor,
        paddingBottom: 10,
        paddingTop: 20,
    },
});
