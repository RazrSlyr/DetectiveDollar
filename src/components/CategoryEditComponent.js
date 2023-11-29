import { AntDesign, Feather } from '@expo/vector-icons';
import React, { useState, useEffect } from 'react';
import {
    TouchableOpacity,
    StyleSheet,
    Text,
    View,
    SafeAreaView,
    Modal,
    InputText,
} from 'react-native';

import * as Colors from '../constants/Colors';

const CategoryEditComponent = ({ isVisable, onClose, category = null }) => {
    console.log('category to edit: ', category);
    return (
        <Modal animationType="slide" transparent visible={isVisable} onRequestClose={() => onClose}>
            <SafeAreaView styles={styles.container}>
                {category ? (
                    <View>
                        <View styles={styles.titleContainer}>
                            <Text styles={styles.titleText}> EDIT </Text>
                        </View>
                        <View>
                            <Text styles={styles.inputHeading}>NAME</Text>
                            <Text styles={styles.titleText}>{category.name}</Text>
                        </View>
                        <View>
                            <Text styles={styles.inputHeading}>COLOR</Text>
                            <Text styles={styles.titleText}>ADD COLOR PICKER</Text>
                        </View>
                    </View>
                ) : (
                    <View>
                        <Text>No Category Selected</Text>
                    </View>
                )}
            </SafeAreaView>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                <Feather name="x-circle" size={50} color="red" />
            </TouchableOpacity>
        </Modal>
    );
};

export default CategoryEditComponent;

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'black',
        justifyContent: 'center',
        alignItems: 'center',
        margin: 30,
        padding: 30,
        borderRadius: 30,
    },
    titleContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: 5,
    },
    titleText: {
        fontWeight: 'bold',
        fontSize: 35,
        color: Colors.primaryColor,
        justifyContent: 'center',
    },
    inputContainer: {
        //flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 5,
    },
    inputHeading: {
        fontSize: 14,
        color: Colors.secondaryColor,
        marginTop: 15,
    },
    input: {
        width: '84%',
        color: Colors.textColor,
        fontFamily: 'Roboto-Bold',
        fontSize: 18,
        textAlign: 'left',
    },
    closeButton: {
        position: 'absolute',
        top: 0,
        right: 0,
        margin: 5,
    },
});
