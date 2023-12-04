import { Feather } from '@expo/vector-icons';
import React, { useState, useEffect } from 'react';
import {
    TouchableOpacity,
    StyleSheet,
    Text,
    View,
    SafeAreaView,
    Modal,
    TextInput,
} from 'react-native';
import ColorPicker from 'react-native-wheel-color-picker';

import * as Colors from '../constants/Colors';
import { updateRowFromCategoryTable } from '../util/FileSystemUtils';

const CategoryEditComponent = ({ isVisable, onClose, onUpdate, category = null }) => {
    const [enableSave, setEnableSave] = useState(false);
    const [categoryName, setCategoryName] = useState(category?.name);
    const [categoryColor, setColor] = useState(category?.color); //use to update color

    const onColorChange = (color) => {
        setColor(color);
    };

    useEffect(() => {
        const updateEnableSave = () => {
            if (
                (categoryName === undefined ||
                    categoryName === '' ||
                    categoryName === category.name) &&
                (!categoryColor || categoryColor === category.color)
            ) {
                setEnableSave(false);
            } else {
                setEnableSave(true);
            }
        };
        updateEnableSave();
    }, [categoryName, categoryColor]);

    return (
        <Modal animationType="slide" transparent visible={isVisable} onRequestClose={() => onClose}>
            <View style={styles.modalContainer}>
                <SafeAreaView style={styles.container}>
                    {category ? (
                        <View style={{ width: '100%' }}>
                            <View style={styles.titleContainer}>
                                <Text style={styles.titleText}>Edit Expense</Text>
                            </View>
                            <View style={styles.inputContainer}>
                                <Text style={styles.inputHeading}>Name</Text>
                                <TextInput
                                    style={styles.input}
                                    value={
                                        categoryName === undefined ? category.name : categoryName
                                    }
                                    onChangeText={(value) => {
                                        //console.log('change value', value);
                                        setCategoryName(value);
                                        //setColor(color)
                                    }}
                                />
                            </View>
                            <View style={styles.line} />
                            <View style={styles.inputContainer}>
                                <Text style={styles.inputHeading}>Color</Text>
                                <View style={styles.colorPickerContainer}>
                                    <ColorPicker
                                        color={!category?.color ? '#ffffff' : category.color}
                                        onColorChangeComplete={(categoryColor) =>
                                            onColorChange(categoryColor)
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
                        <TouchableOpacity
                            style={[
                                styles.button,
                                { backgroundColor: !enableSave ? 'grey' : styles.button.color },
                            ]}
                            disabled={!enableSave}
                            onPress={async () => {
                                //console.log('attempt to update');
                                await updateRowFromCategoryTable(
                                    category.id,
                                    categoryName === category?.name ? null : categoryName,
                                    categoryColor === category?.color ? null : categoryColor
                                );
                                await onUpdate();
                                onClose();
                            }}>
                            <Text style={styles.buttonText}>Save</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.button, { backgroundColor: 'red' }]}
                            onPress={async () => {
                                //await deleteRowFromCategoryTable(category.name);
                                await onUpdate();
                                setCategoryName(undefined);
                                setColor(undefined);
                                onClose();
                            }}>
                            <Text style={styles.buttonText}>Cancel</Text>
                        </TouchableOpacity>
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
        backgroundColor: Colors.primaryColor,
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
        color: Colors.secondaryColor,
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
        color: Colors.secondaryColor,
        width: '84%',
        marginTop: 15,
        marginBottom: 5,
    },
    input: {
        width: '84%',
        color: Colors.textColor,
        fontFamily: 'Roboto-Bold',
        fontSize: 20,
        textAlign: 'left',
    },
    line: {
        height: 2,
        width: '85%',
        backgroundColor: Colors.secondaryColor,
        alignSelf: 'center',
    },
    closeButton: {
        position: 'absolute',
        top: 5,
        right: 5,
    },
    button: {
        color: Colors.secondaryColor,
        fontFamily: 'Roboto-Bold',
        width: '35%',
        height: 'auto',
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.secondaryColor,
        marginRight: 15,
    },
    buttonText: {
        fontFamily: 'Roboto-Bold',
        color: '#ffffff',
        textAlign: 'center',
        fontSize: 24,
    },
    rowContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    colorPickerContainer: {
        height: 300,
        width: 300,
    },
});
