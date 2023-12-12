import React, { useState, useEffect } from 'react';
import {
    Alert,
    StyleSheet,
    Text,
    Platform,
    View,
    SafeAreaView,
    Modal,
    TextInput,
} from 'react-native';
import ColorPicker from 'react-native-wheel-color-picker';

import GreenLine from './GreenLine';
import ButtonComponent from '../components/ButtonComponent';
import * as Colors from '../constants/Colors';
import * as Sizes from '../constants/Sizes';
import { addRowToCategoryTable } from '../util/FileSystemUtils';
const DEFAULTCOLOR = 'white';
const CategoryAddComponent = ({ isVisable, onClose, onAdd }) => {
    const [categoryName, setCategoryName] = useState();
    const [categoryColor, setCategoryColor] = useState(DEFAULTCOLOR); //use to update color

    return (
        <Modal animationType="slide" transparent visible={isVisable} onRequestClose={() => onClose}>
            <View
                style={styles.modalContainer}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
                <SafeAreaView style={styles.container}>
                    <View style={styles.titleContainer}>
                        <Text style={styles.titleText}>Add Category</Text>
                    </View>
                    <View style={styles.inputContainer}>
                        <Text style={styles.inputHeading}>Name</Text>
                        <TextInput
                            style={styles.inputField}
                            value={categoryName}
                            placeholder="Category Name"
                            onChangeText={(value) => setCategoryName(value)}
                        />
                    </View>
                    <GreenLine />
                    <View style={styles.inputContainer}>
                        <Text style={styles.inputHeading}>Color</Text>
                        <View style={styles.colorPickerContainer}>
                            <ColorPicker
                                color={DEFAULTCOLOR}
                                onColorChangeComplete={(categoryColor) =>
                                    setCategoryColor(categoryColor)
                                }
                                thumbSize={30}
                                sliderSize={30}
                                noSnap
                                row={false}
                            />
                        </View>
                    </View>
                    <View style={styles.rowContainer}>
                        <ButtonComponent
                            onPress={async () => {
                                if (
                                    categoryName === undefined ||
                                    categoryName === null ||
                                    categoryName.trim().length === 0
                                ) {
                                    Alert.alert('Please Input a Category Name');
                                    return;
                                }
                                try {
                                    await addRowToCategoryTable(categoryName.trim(), categoryColor);
                                    setCategoryName(undefined);
                                    setCategoryColor(DEFAULTCOLOR);
                                    await onAdd();
                                    onClose();
                                } catch (error) {
                                    console.log('Failed to add Category', error);
                                }
                            }}
                            name="Add"
                            buttonColor={Colors.SECONDARYCOLOR}
                            buttonStyle={styles.button}
                        />
                        <ButtonComponent
                            onPress={async () => {
                                setCategoryName(undefined);
                                setCategoryColor(DEFAULTCOLOR);
                                onClose();
                            }}
                            name="Cancel"
                            buttonColor={Colors.CONTRASTCOLOR}
                            buttonStyle={styles.button}
                        />
                    </View>
                </SafeAreaView>
            </View>
        </Modal>
    );
};

export default CategoryAddComponent;
const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        justifyContent: 'center',
    },
    container: {
        backgroundColor: Colors.PRIMARYCOLOR,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: -20,
        marginHorizontal: 20,
        paddingTop: 10,
        paddingBottom: 30,
        paddingHorizontal: 5,
        borderRadius: 30,
        height: 'auto',
        flexDirection: 'column',
    },
    titleContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    titleText: {
        fontWeight: 'bold',
        fontSize: 35,
        color: Colors.SECONDARYCOLOR,
    },
    inputContainer: {
        height: 'auto',
        width: '100%',
        alignItems: 'center',
        marginBottom: 10,
        paddingHorizontal: 10,
    },
    inputHeading: {
        fontSize: 15,
        fontFamily: 'Roboto-Bold',
        color: Colors.SECONDARYCOLOR,
        width: '84%',
        marginTop: 15,
        marginBottom: 5,
    },
    inputField: {
        width: '84%',
        color: Colors.TEXTCOLOR,
        fontFamily: 'Roboto-Bold',
        fontSize: 20,
        textAlign: 'left',
    },
    rowContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        //marginTop: 10,
    },
    colorPickerContainer: {
        height: 300,
        width: 300,
    },
    button: {
        width: 100,
        marginLeft: 20,
    },
});
