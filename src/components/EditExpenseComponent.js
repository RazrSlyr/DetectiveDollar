import { Feather, AntDesign } from '@expo/vector-icons';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import React, { useState, useEffect } from 'react';
import {
    TouchableOpacity,
    StyleSheet,
    Text,
    TextInput,
    View,
    Dimensions,
    Alert,
    TouchableWithoutFeedback,
    Keyboard,
    KeyboardAvoidingView,
    ScrollView,
} from 'react-native';
import Modal from 'react-native-modal';
import { SafeAreaView } from 'react-native-safe-area-context';

import ButtonComponent from '../components/ButtonComponent';
import DropdownSelector from '../components/Dropdown';
import GreenLine from '../components/GreenLine';
import * as Colors from '../constants/Colors';
import * as Sizes from '../constants/Sizes';
import { captureImage, pickImage, saveImage } from '../util/ImageUtils';
import { updateExpense } from '../util/ExpenseTableUtils';
import { getCategoryTable } from '../util/CategoryTableUtils';

/**
 * Component for the inspecting expense info
 * @param {object} props. Props object. The props are isVisible (bool), onClose (callback),
 * and expense (object)
 * @returns {object} The component object for the Edit Expense pop up
 * @memberof Components
 */

const EditExpenseComponent = ({ isVisible, onClose, expense = null }) => {
    const [allCategories, setAllCategories] = useState([]);
    const [name, setName] = useState('');
    const [amount, setAmount] = useState('');
    const [category, setCategory] = useState('');
    const [previewURI, setImageURI] = useState(null);
    const [memo, setMemo] = useState('');

    const handleButtonPress = async () => {
        let imageURI = null;
        if (previewURI) {
            imageURI = await saveImage(previewURI);
        }
        await updateExpense(
            expense?.id,
            name !== '' && name !== null ? name : expense?.name,
            category !== '' && category !== null ? category : expense?.categoryId,
            amount !== null && amount !== '' ? amount : expense?.amount,
            imageURI !== null && imageURI !== '' ? imageURI : expense?.picture,
            memo !== null && memo !== '' ? memo : expense?.memo
        );
        Alert.alert('Success', 'Entry changed', [{ text: 'OK', onPress: onClose }]);
        setImageURI('');
    };

    const clearImage = async () => {
        console.log('removed photo');
        setImageURI(null);
    };

    useEffect(() => {
        const getCategories = async () => {
            setAllCategories(await getCategoryTable());
        };
        if (isVisible) {
            getCategories();
        }
    }, [isVisible]);

    return (
        <Modal
            isVisible={isVisible}
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
                                        placeholder={expense?.name}
                                        placeholderTextColor={Colors.SUBHEADINGCOLOR}
                                        onChangeText={(value) => setName(value)}
                                    />
                                    <GreenLine />
                                </View>
                                <View style={styles.inputContainer}>
                                    <Text style={styles.inputHeading}>AMOUNT</Text>
                                    <TextInput
                                        style={styles.input}
                                        keyboardType="numeric"
                                        placeholder={`$${expense?.amount}`}
                                        placeholderTextColor={Colors.SUBHEADINGCOLOR}
                                        maxLength={10}
                                        onChangeText={(value) =>
                                            setAmount(parseFloat(value).toFixed(2))
                                        }
                                    />
                                    <GreenLine />
                                </View>
                                <View style={styles.inputContainer}>
                                    <Text style={styles.inputHeading}>CATEGORY</Text>
                                    <DropdownSelector
                                        style={styles.input}
                                        data={allCategories.map((category) => {
                                            return {
                                                label: category['name'],
                                                value: category['id'],
                                            };
                                        })}
                                        value={category}
                                        onChange={(item) => {
                                            setCategory(item.value);
                                        }}
                                        dropdownLabel="Category"
                                        placeholderLabel={expense?.category}
                                        placeholderTextColor={Colors.SUBHEADINGCOLOR}
                                    />
                                    <View style={{ height: 15, width: 15, marginBottom: 1 }} />
                                    <GreenLine />
                                </View>
                                <View style={styles.inputContainer}>
                                    <Text style={styles.inputHeading}>MEMO</Text>
                                    <TextInput
                                        style={styles.input}
                                        placeholder={expense?.memo}
                                        placeholderTextColor={Colors.SUBHEADINGCOLOR}
                                        onChangeText={(value) => setMemo(value)}
                                    />
                                    <GreenLine />
                                </View>
                                <View style={[styles.inputContainer, styles.cameraBtnsContainer]}>
                                    {previewURI ? (
                                        <SafeAreaView>
                                            <Image
                                                style={styles.imagePreview}
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
                                                    color={Colors.SECONDARYCOLOR}
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
                                                    color={Colors.SECONDARYCOLOR}
                                                />
                                            </TouchableOpacity>
                                        </View>
                                    )}
                                    <View style={styles.buttonContainer}>
                                        <ButtonComponent
                                            onPress={handleButtonPress}
                                            name="Save"
                                            buttonColor={Colors.SECONDARYCOLOR}
                                            buttonStyle={styles.button}
                                        />
                                        <ButtonComponent
                                            onPress={onClose}
                                            name="Cancel"
                                            buttonColor={Colors.CONTRASTCOLOR}
                                            buttonStyle={styles.button}
                                        />
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
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
    },
    content: {
        height: Dimensions.get('window').height * 0.6,
        alignItems: 'center',
        backgroundColor: Colors.PRIMARYCOLOR,
        borderRadius: 40,
    },
    titleContainer: {
        width: '100%',
        alignItems: 'center',
        //backgroundColor: Colors.secondaryColor,
        paddingTop: 10,
    },
    title: {
        color: Colors.SECONDARYCOLOR,
        fontFamily: 'Roboto-Bold',
        fontSize: Sizes.TITLESIZE,
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
        color: Colors.SECONDARYCOLOR,
        width: '84%',
        marginTop: 15,
        marginBottom: 5,
    },
    input: {
        width: '84%',
        color: Colors.TEXTCOLOR,
        fontFamily: 'Roboto-Bold',
        fontSize: Sizes.TEXTSIZE,
        textAlign: 'left',
    },
    imagePreview: {
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
    button: {
        width: 100,
        margin: 10,
    }
});
