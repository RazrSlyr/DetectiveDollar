import { Entypo, AntDesign } from '@expo/vector-icons';
import { Image } from 'expo-image';
import * as MediaLibrary from 'expo-media-library';
import React, { useState, useEffect } from 'react';
import { TouchableOpacity, StyleSheet, Text, View, Modal, Dimensions } from 'react-native';

import EditExpenseComponent from './EditExpenseComponent';
import * as Colors from '../constants/Colors';
import * as Sizes from '../constants/Sizes';
import { getDateFromUTCDatetimeString, getDatetimeString } from '../util/DatetimeUtils';
const ExpenseInfoComponent = ({ isVisible, onClose, onHome, expense = null, onUpdateExpenses }) => {
    const [hasMediaLibraryPermission, setMediaLibraryPermission] = useState();
    const [showEditExpense, setshowEditExpense] = useState(false);

    const closeInfo = () => {
        setshowEditExpense(false);
    };
    const openInfo = async () => {
        setshowEditExpense(true);
    };
    const handleUpdateExpenses = () => {
        // Call the callback function to signal that expenses need to be updated
        onUpdateExpenses();
    };

    useEffect(() => {
        (async () => {
            const mediaLibaryPermission = await MediaLibrary.requestPermissionsAsync();
            setMediaLibraryPermission(mediaLibaryPermission.status === 'granted');
        })();
    }, []);
    return (
        <Modal animationType="slide" transparent visible={isVisible} onRequestClose={() => onClose}>
            {expense ? (
                <View style={styles.container}>
                    <View style={styles.content}>
                        <View style={styles.titleContainer}>
                            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                                <Entypo
                                    name="chevron-thin-left"
                                    size={45}
                                    color={Colors.primaryColor}
                                />
                            </TouchableOpacity>
                            <Text style={styles.title}>Expense Info</Text>
                        </View>
                        <View style={styles.allInfoContainer}>
                            {onHome ? (
                                <View style={styles.buttonContainer}>
                                    <TouchableOpacity
                                        style={styles.editButton}
                                        onPress={async () => {
                                            openInfo();
                                        }}>
                                        <Text style={styles.buttonText}>Edit</Text>
                                    </TouchableOpacity>
                                </View>
                            ) : null}
                            {expense.picture !== null && hasMediaLibraryPermission ? (
                                <TouchableOpacity style={styles.circleContainer}>
                                    <Image
                                        style={styles.circleImage}
                                        source={{ uri: expense.picture }}
                                        alt="unable to load image"
                                    />
                                </TouchableOpacity>
                            ) : (
                                <TouchableOpacity style={styles.circleContainer} disabled>
                                    <AntDesign name="upload" size={40} color="white" />
                                </TouchableOpacity>
                            )}
                            <View style={styles.dividerLine} />
                            <View style={styles.textContainer}>
                                <Text style={styles.infoText}>{'Name: ' + expense.name}</Text>
                                <Text style={styles.infoText}>
                                    {'Date/Timestamp: ' +
                                        getDatetimeString(
                                            getDateFromUTCDatetimeString(expense.timestamp)
                                        )}
                                </Text>
                                <Text style={styles.infoText}>
                                    {'Amount: ' + '$' + parseFloat(expense['amount']).toFixed(2)}
                                </Text>
                                <Text style={styles.infoText}>
                                    {'Category: ' + expense.category}
                                </Text>
                                <Text style={styles.infoText}>
                                    {'Recur: ' + (expense.reacurring_id ?? 'Does no recur')}
                                </Text>
                                <Text style={styles.infoText}>
                                    {'Memo: ' + (expense.memo ?? 'None')}
                                </Text>
                            </View>
                        </View>
                    </View>
                </View>
            ) : (
                <View style={styles.container}>
                    <Text>Expense is null</Text>
                </View>
            )}
            <EditExpenseComponent
                isVisible={showEditExpense}
                onClose={() => {
                    closeInfo();
                    handleUpdateExpenses();
                }}
                expense={expense}
            />
        </Modal>
    );
};
export default ExpenseInfoComponent;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 32,
        borderWidth: 5,
        borderColor: 'black',
    },
    content: {
        backgroundColor: Colors.secondaryColor,
        padding: 20,
        borderRadius: 8,
        width: '94%', // take 70% of the screen width
        maxHeight: '90%', // take 70% of the screen height
        alignItems: 'center',
    },
    titleContainer: {
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 5,
        backgroundColor: Colors.secondaryColor,
        borderTopLeftRadius: 27, // Radius for the top-left corner
        borderTopRightRadius: 27, // Radius for the top-right corner
    },
    title: {
        fontWeight: 'bold',
        fontSize: Sizes.titleSize,
        color: Colors.primaryColor,
    },
    closeButton: {
        position: 'absolute',
        top: 0,
        left: 0,
        margin: 5,
    },
    allInfoContainer: {
        width: '100%',
        height: '85%',
        backgroundColor: 'white',
        borderRadius: 32,
        margin: 25,
    },
    circleContainer: {
        width: Dimensions.get('window').width / 2, // Set the desired width of the circle
        height: Dimensions.get('window').width / 2, // Set the desired height of the circle
        borderRadius: Dimensions.get('window').width / 4, // Half of the width and height to create a circle
        overflow: 'hidden', // Clip the content to the circle shape
        backgroundColor: 'orange',
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        margin: 20,
    },
    circleImage: {
        width: '100%',
        height: '100%',
    },
    dividerLine: {
        width: '50%',
        borderBottomWidth: 3,
        borderColor: Colors.secondaryColor,
        marginVertical: 0,
        alignSelf: 'center',
    },
    textContainer: {
        padding: 5,
        backgroundColor: 'white',
        margin: 20,
        height: '50%',
    },
    infoText: {
        fontSize: Sizes.textSize,
        color: Colors.textColor,
    },
    valueText: {
        fontSize: 20,
    },
    buttonContainer: {
        justifyContent: 'right',
        alignItems: 'flex-end',
    },
    editButton: {
        borderRadius: 20,
        height: 40,
        width: 80,
        paddingTop: 10,
    },
    buttonText: {
        textAlign: 'center',
        fontSize: 24,
        color: Colors.secondaryColor,
    },
});
