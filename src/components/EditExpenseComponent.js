import { Feather, AntDesign } from '@expo/vector-icons';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import * as MediaLibrary from 'expo-media-library';
import React, { useState, useMemo, useEffect } from 'react';
import {
    TouchableOpacity,
    StyleSheet,
    Text,
    TextInput,
    View,
    Dimensions,
    Alert,
    Button,
    TouchableWithoutFeedback,
    Keyboard,
    KeyboardAvoidingView,
    ScrollView,
    Platform,
} from 'react-native';
import Modal from 'react-native-modal';
import { SafeAreaView } from 'react-native-safe-area-context';

import DatePickerComponent from '../components/DatePickerComponent';
import DropdownSelector from '../components/Dropdown';
import GreenLine from '../components/GreenLine';
import * as Colors from '../constants/Colors';
import { DAILY, MONTHLY, NO_REPETION, WEEKLY } from '../constants/FrequencyConstants';
import * as Sizes from '../constants/Sizes';
import {
    getDateFromUTCDatetimeString,
    getDatetimeString,
    getCurrentDateString,
    getDateStringFromDate,
} from '../util/DatetimeUtils';
import {
    updateExpense,
    addRowToCategoryTable,
    addRowToExpenseTable,
    saveImage,
    getExpensesFromDay,
} from '../util/FileSystemUtils';
import { pickImage, captureImage } from '../util/ImagePickerUtil';

const EditExpenseComponent = ({ isVisable, onClose, expense = null }) => {
    const [name, setName] = useState('');
    const [amount, setAmount] = useState('');
    const [category, setCategory] = useState('');
    const [previewURI, setImageURI] = useState(null);
    const [memo, setMemo] = useState(null);
    console.log(expense);

    const handleButtonPress = async () => {
        // Need to get new category ID
        //const categoryId = await addRowToCategoryTable(category);
        // console.log(categoryId);
        let imageURI = null;
        if (previewURI) {
            imageURI = await saveImage(previewURI);
        }
        await updateExpense(
            expense.id,
            name !== '' ? name : expense.name,
            category !== '' ? category : expense.categoryId,
            amount !== null && amount !== '' ? parseFloat(amount).toFixed(2) : expense.amount,
            imageURI !== null ? imageURI : expense.picture,
            memo !== null ? imageURI : expense.memo
        );
        alert('Entry changed');
    };

    const clearImage = async () => {
        console.log('removed photo');
        setImageURI(null);
    };

    return (
        <Modal
            isVisible={isVisable}
            animationInTiming={500}
            animationOutTiming={500}
            backdropTransitionInTiming={300}
            backdropTransitionOutTiming={300}
            onBackdropPress={onClose}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
                <View style={styles.content}>
                    <View style={styles.titleContainer}>
                        <Text style={styles.title}>Edit</Text>
                    </View>
                    <KeyboardAvoidingView style={{ flex: 1, paddingTop: 20 }}>
                        <ScrollView showsVerticalScrollIndicator={false}>
                            <View style={styles.box2}>
                                <View style={[styles.inputContainer, styles.firstInput]}>
                                    <Text style={styles.inputHeading}>NAME</Text>
                                    <TextInput
                                        style={styles.input}
                                        onChangeText={(value) => setName(value)}
                                    />
                                    <GreenLine />
                                </View>
                                <View style={styles.inputContainer}>
                                    <Text style={styles.inputHeading}>AMOUNT</Text>
                                    <TextInput
                                        style={styles.input}
                                        placeholder="$0.00"
                                        keyboardType="numeric"
                                        maxLength={10}
                                        onChangeText={(value) =>
                                            setAmount(parseFloat(value).toFixed(2))
                                        }
                                    />
                                    <GreenLine />
                                </View>
                                <View style={styles.inputContainer}>
                                    <Text style={styles.inputHeading}>CATEGORY</Text>
                                    <GreenLine />
                                </View>
                                <View style={styles.inputContainer}>
                                    <Text style={styles.inputHeading}>MEMO</Text>
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Notes about spending"
                                        /* Need to add logic to connect to backend */
                                        onChangeText={(value) => setMemo(value)}
                                    />
                                    <GreenLine />
                                </View>
                                <View style={[styles.inputContainer, styles.cameraBtnsContainer]}>
                                    {previewURI ? (
                                        <SafeAreaView style={styles.container}>
                                            <Image
                                                style={styles.preview}
                                                source={{ uri: previewURI }}
                                            />
                                            <TouchableOpacity
                                                style={{
                                                    position: 'absolute',
                                                    right: -30,
                                                    alignSelf: 'center',
                                                }}
                                                onPress={async () => {
                                                    await clearImage();
                                                }}>
                                                <Feather name="x-circle" size={30} color="red" />
                                            </TouchableOpacity>
                                        </SafeAreaView>
                                    ) : (
                                        <View style={styles.rowContainer}>
                                            <TouchableOpacity
                                                style={styles.rowItem}
                                                onPress={async () => {
                                                    const cameraPermission =
                                                        await ImagePicker.requestCameraPermissionsAsync();
                                                    if (cameraPermission.status === 'granted') {
                                                        const imageURI = await captureImage();
                                                        console.log(
                                                            'uri from imagepicker: ',
                                                            imageURI
                                                        );
                                                        setImageURI(imageURI);
                                                    } else {
                                                        Alert.alert(
                                                            'Camera Permission Not Set',
                                                            'Please change app permission in settings',
                                                            [{ text: 'OK' }]
                                                        );
                                                    }
                                                }}>
                                                <Feather
                                                    name="camera"
                                                    size={36}
                                                    color={Colors.secondaryColor}
                                                />
                                            </TouchableOpacity>
                                            <TouchableOpacity
                                                style={styles.rowItem}
                                                onPress={async () => {
                                                    const mediaLibaryPermission =
                                                        await ImagePicker.requestMediaLibraryPermissionsAsync();
                                                    if (
                                                        mediaLibaryPermission.status === 'granted'
                                                    ) {
                                                        const imageURI = await pickImage();
                                                        console.log(
                                                            'uri from imagepicker: ',
                                                            imageURI
                                                        );
                                                        setImageURI(imageURI);
                                                    } else {
                                                        Alert.alert(
                                                            'Media Library Permission Not Set',
                                                            'Please change app permission in settings',
                                                            [{ text: 'OK' }]
                                                        );
                                                    }
                                                }}>
                                                <AntDesign
                                                    name="upload"
                                                    size={36}
                                                    color={Colors.secondaryColor}
                                                />
                                            </TouchableOpacity>
                                        </View>
                                    )}
                                    <View style={styles.buttonContainer}>
                                        <TouchableOpacity
                                            style={styles.saveButton}
                                            onPress={handleButtonPress}>
                                            <Text style={styles.buttonText}>Save</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            style={styles.cancelButton}
                                            onPress={onClose}>
                                            <Text style={styles.buttonText}>Cancel</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                        </ScrollView>
                    </KeyboardAvoidingView>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
};
export default EditExpenseComponent;

const styles = StyleSheet.create({
    content: {
        height: Dimensions.get('window').height * 0.6,
        alignItems: 'center',
        backgroundColor: Colors.primaryColor,
        borderRadius: 40,
    },
    titleContainer: {
        width: '100%',
        alignItems: 'center',
        //backgroundColor: Colors.secondaryColor,
        paddingTop: 10,
    },
    title: {
        color: Colors.secondaryColor,
        fontFamily: 'Roboto-Bold',
        fontSize: Sizes.titleSize,
        textAlign: 'center',
        fontWeight: 'bold',
    },
    box2: {
        width: Dimensions.get('window').width * 0.8,
        height: Dimensions.get('window').height * 0.5,
        backgroundColor: 'white',
        borderRadius: 10,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    inputContainer: {
        height: Dimensions.get('window').height * 0.072,
        width: '100%',
        alignItems: 'center',
        textAlign: 'left',
    },
    inputHeading: {
        fontSize: 12,
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
        fontSize: Sizes.textSize,
        textAlign: 'left',
    },
    preview: {
        height: '100%',
        aspectRatio: 1,
    },
    rowContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    rowItem: {
        margin: 10,
    },
    cameraBtnsContainer: {
        height: '20%',
        marginTop: 10,
    },
    firstInput: {
        marginTop: 0,
    },
    dateInputContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        width: '84%',
    },
    buttonContainer: {
        justifyContent: 'center',
        alignItems: 'flex-end',
        flexDirection: 'row',
    },
    cancelButton: {
        backgroundColor: '#FF3F48',
        padding: 10,
        borderRadius: 20,
        height: 40,
        width: 80,
        margin: 10,
    },
    saveButton: {
        backgroundColor: Colors.secondaryColor,
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
});
