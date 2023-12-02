import { Entypo, AntDesign} from '@expo/vector-icons';
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
    Alert
} from 'react-native';

import * as Colors from '../constants/Colors';
import * as Sizes from '../constants/Sizes';
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
                <View style={styles.container}>
                    <View style={styles.titleContainer}>
                        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                            <Entypo name="chevron-thin-left" size={50} color={Colors.primaryColor} />
                        </TouchableOpacity>
                        <Text style={styles.title}>Expense Info</Text>
                    </View>
                    <View style={styles.allInfoContainer}>
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
                                <AntDesign name="upload" size={40} color="white" />
                            </TouchableOpacity>
                        )}
                        <View style={styles.dividerLine}/>
                        <View style={styles.textContainer}>
                            <Text style={styles.infoText}>{"Name: " + expense.name}</Text>
                            <Text style={styles.infoText}>{"Date/Timestamp: " + getDatetimeString(getDateFromUTCDatetimeString(expense.timestamp))}</Text>
                            <Text style={styles.infoText}>{"Amount: " + '$' + parseFloat(expense['amount']).toFixed(2)}</Text>
                            <Text style={styles.infoText}>{"Category: " + expense.category}</Text>
                            <Text style={styles.infoText}>{"Recurre: " + expense.reacurring_id}</Text>
                            <Text style={styles.infoText}>{"Memo: " + expense.memo}</Text>
                        </View>
                    </View>
                </View>
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
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
        backgroundColor: Colors.primaryColor,
        alignItems: 'center',
        borderTopLeftRadius: 32, // Radius for the top-left corner
        borderTopRightRadius: 32, // Radius for the top-right corner
        borderWidth: 5,
        borderColor: "black",
    },
    titleContainer: {
        width: "100%",
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
        width: "90%",
        height: "85%",
        backgroundColor: "white",
        borderRadius: 32,
        margin: 25,
    },
    circleContainer: {
        width: Dimensions.get('window').width / 2, // Set the desired width of the circle
        height: Dimensions.get('window').width / 2, // Set the desired height of the circle
        borderRadius: Dimensions.get('window').width / 4, // Half of the width and height to create a circle
        overflow: 'hidden', // Clip the content to the circle shape
        backgroundColor: "orange",
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
        width: "50%",
        borderBottomWidth: 3,
        borderColor: Colors.secondaryColor,
        marginVertical: 0,
        alignSelf: 'center',
    },
    textContainer: {
        padding: 5,
        backgroundColor: 'white',
        margin: 20,
        height: 400,
    },
    infoText: {
        fontSize: Sizes.textSize,
        color: Colors.textColor,
    },
    valueText: {
        fontSize: 20,
    },
});
