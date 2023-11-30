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
    Modal,
    Dimensions,
} from 'react-native';

import * as Colors from '../constants/Colors';
import { getDateFromUTCDatetimeString, getDatetimeString } from '../util/DatetimeUtils';
const ExpenseInfoComponent = ({ isVisable, onClose, expense = null }) => {
    const [hasMediaLibraryPermission, setMediaLibraryPermission] = useState();

    useEffect(() => {
        (async () => {
            const mediaLibaryPermission = await MediaLibrary.requestPermissionsAsync();
            setMediaLibraryPermission(mediaLibaryPermission.status === 'granted');
        })();
    }, []);
    return (
        <Modal animationType="slide" transparent visible={isVisable} onRequestClose={() => onClose}>
            {expense ? (
                <SafeAreaView style={styles.container}>
                    <View style={styles.textContainer}>
                        <Text style={styles.title}>Expense Info</Text>
                    </View>
                    {expense.picture !== null && hasMediaLibraryPermission ? (
                        <TouchableOpacity style={styles.circleContainer}>
                            <Image
                                style={styles.circleImage}
                                source={{ uri: expense.picture }}
                                alt="unable to load image"
                            />
                        </TouchableOpacity>
                    ) : (
                        <TouchableOpacity style={styles.circleContainer}>
                            <AntDesign name="upload" size={40} color="black" />
                        </TouchableOpacity>
                    )}
                    <View style={styles.textContainer}>
                        <Text style={styles.titleText}>Title</Text>
                        <Text style={styles.valueText}>{expense.name}</Text>
                    </View>
                    <View style={styles.textContainer}>
                        <Text style={styles.titleText}>When</Text>
                        <Text style={styles.valueText}>
                            {getDatetimeString(getDateFromUTCDatetimeString(expense.timestamp))}
                        </Text>
                    </View>
                    <View style={styles.textContainer}>
                        <Text style={styles.titleText}>Amount</Text>
                        <Text style={styles.valueText}>${expense.amount}</Text>
                    </View>
                    <View style={styles.textContainer}>
                        <Text style={styles.titleText}>Category</Text>
                        <Text style={styles.valueText}>{expense.category}</Text>
                    </View>
                    <View style={styles.memoContainer}>
                        <Text style={styles.titleText}>Memo</Text>
                        <Text style={styles.valueText}>{expense.memo}</Text>
                    </View>

                    <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                        <Feather name="x-circle" size={50} color="red" />
                    </TouchableOpacity>
                </SafeAreaView>
            ) : (
                <View style={styles.container}>
                    <Text>Expense is null</Text>
                </View>
            )}
        </Modal>
    );
};
export default ExpenseInfoComponent;

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
        margin: 30,
        padding: 30,
        borderRadius: 30,
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
    closeButton: {
        position: 'absolute',
        top: 0,
        right: 0,
        margin: 5,
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
    },
});
