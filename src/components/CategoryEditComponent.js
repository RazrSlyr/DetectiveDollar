import React, { useState, useEffect } from 'react';
import { Alert, Modal, SafeAreaView, StyleSheet, Text, TextInput, View } from 'react-native';
import ColorPicker from 'react-native-wheel-color-picker';

import GreenLine from './GreenLine';
import ButtonComponent from '../components/ButtonComponent';
import * as Colors from '../constants/Colors';
import { updateRowFromCategoryTable } from '../util/FileSystemUtils';

/**
 * Component for the Category editing pop up
 * @param {object} props Props object. The props are isVisible (bool),
 * onClose (callback), onUpdate (callback), and category (object)
 * @returns {object} The component object for the Category Edit Pop Up
 * @memberof Components
 */
const DEFAULTCOLOR = 'white';
const CategoryEditComponent = ({ isVisable, onClose, onUpdate, category = null }) => {
    const [categoryName, setCategoryName] = useState();
    const [categoryColor, setCategoryColor] = useState(DEFAULTCOLOR); //use to update color
    useEffect(() => {
        setCategoryName(category?.name);
        setCategoryColor(category?.color);
    }, [category]);

    return (
        <Modal animationType="slide" transparent visible={isVisable} onRequestClose={() => onClose}>
            <View style={styles.modalContainer}>
                <SafeAreaView style={styles.container}>
                    {category ? (
                        <View style={{ width: '100%' }}>
                            <View style={styles.titleContainer}>
                                <Text style={styles.titleText}>Edit Category</Text>
                            </View>
                            <View style={styles.inputContainer}>
                                <Text style={styles.inputHeading}>Name</Text>
                                <TextInput
                                    style={styles.inputField}
                                    value={categoryName !== undefined ? categoryName : ''}
                                    placeholder={category?.name}
                                    onChangeText={(value) => {
                                        setCategoryName(value);
                                    }}
                                />
                            </View>
                            <GreenLine style={{ alignSelf: 'center' }} />
                            <View style={styles.inputContainer}>
                                <Text style={styles.inputHeading}>Color</Text>
                                <View style={styles.colorPickerContainer}>
                                    <ColorPicker
                                        color={categoryColor}
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
                        </View>
                    ) : (
                        <View>
                            <Text>No Category Selected</Text>
                        </View>
                    )}
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
                                if (
                                    categoryName !== category?.name ||
                                    categoryColor !== category?.color
                                ) {
                                    try {
                                        await updateRowFromCategoryTable(
                                            category.id,
                                            categoryName.trim(),
                                            categoryColor
                                        );
                                        await onUpdate();
                                    } catch (error) {
                                        console.log(
                                            'Failed to update Category ' + category['id'],
                                            error
                                        );
                                    }
                                }
                                onClose();
                            }}
                            name="Save"
                            buttonColor={Colors.SECONDARYCOLOR}
                            buttonStyle={styles.button}
                        />
                        <ButtonComponent
                            onPress={async () => {
                                setCategoryName(undefined);
                                setCategoryColor(undefined);
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

export default CategoryEditComponent;

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
