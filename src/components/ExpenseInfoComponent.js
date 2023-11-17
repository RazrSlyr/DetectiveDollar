import { AntDesign, Feather } from '@expo/vector-icons';
import { Image } from 'expo-image';
import * as MediaLibrary from 'expo-media-library';
import React, { useState, useEffect } from 'react';
import { TouchableOpacity, StyleSheet, Text, View, SafeAreaView, Modal } from 'react-native';

import * as Colors from '../constants/Colors';
const ExpenseInfoComponent = ({ isVisable, onClose, expense }) => {
    const [hasMediaLibraryPermission, setMediaLibraryPermission] = useState();
    useEffect(() => {
        (async () => {
            const mediaLibaryPermission = await MediaLibrary.requestPermissionsAsync();
            setMediaLibraryPermission(mediaLibaryPermission.status === 'granted');
        })();
    }, []);
    if (expense === undefined || expense === null) {
        onClose();
        return;
    }
    return (
        <Modal animationType="slide" transparent={false} visible={isVisable}>
            <SafeAreaView style={styles.container}>
                <Text>Expense Info</Text>
                <Text>{expense.name}</Text>
                <Text>{expense.timestamp}</Text>
                <Text>{expense.category}</Text>
                {expense.picture ? (
                    <SafeAreaView style={styles.imageContainer}>
                        <Image
                            style={styles.image}
                            source={{ uri: expense.picture }}
                            contentFit="contain"
                            alt="unavle to load image"
                        />
                    </SafeAreaView>
                ) : (
                    <View>
                        <Text>No Image</Text>
                        <TouchableOpacity>
                            <AntDesign name="upload" size={40} color="black" />
                        </TouchableOpacity>
                    </View>
                )}
                <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                    <Feather name="x-circle" size={50} color="black" />
                </TouchableOpacity>
            </SafeAreaView>
        </Modal>
    );
};
export default ExpenseInfoComponent;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.secondaryColor,
        justifyContent: 'top',
        alignItems: 'center',
        margin: 30,
        padding: 50,
        borderRadius: 40,
        opacity: '80%'
    },
    imageContainer: {
        flex: 1,
        backgroundColor: 'grey',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '30%',
    },
    buttonContainer: {
        backgroundColor: '#37c871',
        padding: 10,
        borderRadius: 10,
        height: 60,
    },
    image: {
        flex: 1,
        contentFit: 'contain',
        width: '100%',
    },
    closeButton: {
        position: 'absolute',
        top: 0,
        right: 0,
        margin: 15,
    },
});
