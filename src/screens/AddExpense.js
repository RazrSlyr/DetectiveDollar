import { AntDesign, Feather } from '@expo/vector-icons';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { StatusBar } from 'expo-status-bar';
import React, { useState, useMemo, useEffect } from 'react';
import {
    TouchableOpacity,
    StyleSheet,
    Text,
    TextInput,
    View,
    Dimensions,
    SafeAreaView,
    Alert,
} from 'react-native';

import DatePickerComponent from '../components/DatePickerComponent';
import DropdownSelector from '../components/Dropdown';
import GreenLine from '../components/GreenLine';
import * as Colors from '../constants/Colors';
import { DAILY, MONTHLY, NO_REPETION, WEEKLY } from '../constants/FrequencyConstants';
import { getCurrentDateString } from '../util/DatetimeUtils';
import { addRowToCategoryTable, addRowToExpenseTable, saveImage, getExpensesFromDay } from '../util/FileSystemUtils';
import { pickImage, captureImage } from '../util/ImagePickerUtil';

export default function App({ navigation }) {
    const [name, setName] = useState('');
    const [amount, setAmount] = useState('');
    const [category, setCategory] = useState('');
    const [frequency, setFrequency] = useState(NO_REPETION);
    const [previewURI, setImageURI] = useState(null);
    const [todayExpenses, setTodayExpenses] = useState([]);
    
    const spending = useMemo(() => {
        if (todayExpenses?.length === 0) {
            return '$0.00';
        }
        let newSpending = 0;
        todayExpenses.forEach((expense) => {
            newSpending += parseFloat(expense['amount']);
        });
        const todaySpending = newSpending.toLocaleString('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2,
        });
        return todaySpending;
    }, [todayExpenses]);

    useEffect(() => {
        const getExpenses = async () => {
            setTodayExpenses(await getExpensesFromDay(getCurrentDateString()));
        };
        navigation.addListener('focus', () => {
            getExpenses();
        });
    }, []);

    const handleButtonPress = async () => {
        // Add your button click logic here
        if (name === '' || amount === '' || category === '') {
            alert('Please Input a Name, Amount, and Category');
            return;
        }
        const currentDate = new Date();
        const dateString = getDateStringFromDate(currentDate);
        const timestamp = currentDate.getTime();
        const categoryId = await addRowToCategoryTable(category);
        console.log(categoryId);
        let imageURI = null;
        if (previewURI) {
            imageURI = await saveImage(previewURI);
        }
        await addRowToExpenseTable(
            name,
            categoryId,
            parseFloat(amount).toFixed(2),
            timestamp,
            dateString,
            null,
            imageURI,
            null,
            frequency
        );
    };
    const clearImage = async () => {
        console.log('removed photo');
        setImageURI(null);
    };
    return (
        <View style={styles.container}>
            <View style={styles.upperPart} />
            {/* Upper portion above SafeAreaView */}
            <SafeAreaView style={styles.content}>
                <View style={styles.titleContainer}>
                    <Text style={styles.title}>Add Expense</Text>
                </View>
                <StatusBar style="auto" />
                <View style={styles.box}>
                    <Text
                        style={{
                            position: 'absolute',
                            fontFamily: 'Roboto-Bold',
                            color: '#d6dfda',
                            top: 5,
                            left: 5,
                        }}>
                        Today's Spending
                    </Text>
                    <Text style={{ fontSize: 50, paddingTop: 15, left: -5 }}>{`${spending}`}</Text>
                </View>
                <View style={styles.box2}>
                    <View style={[styles.inputContainer, styles.firstInput]}>
                        <Text style={styles.inputHeading}>Name</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Name of expense"
                            onChangeText={(value) => setName(value)}
                        />
                    </View>
                    <GreenLine />
                    <View style={styles.inputContainer}>
                        <Text style={styles.inputHeading}>Amount</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="$"
                            keyboardType="numeric"
                            maxLength={10}
                            onChangeText={(value) => setAmount(parseFloat(value).toFixed(2))}
                        />
                    </View>
                    <GreenLine />
                    <View style={styles.inputContainer}>
                        <Text style={styles.inputHeading}>Date</Text>
                        {/* CHANGE TO DATE HERE */}
                        <Text />
                    </View>
                    <GreenLine />
                    <View style={styles.inputContainer}>
                        <Text style={styles.inputHeading}>Category</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="e.g., Food, Entertainment"
                            onChangeText={(value) => setCategory(value)}
                        />
                    </View>
                    <GreenLine />
                    <View style={styles.inputContainer}>
                        <Text style={styles.inputHeading}>Recurring</Text>
                        <DropdownSelector
                            style={styles.input}
                            data={[
                                { label: "Don't Repeat", value: NO_REPETION },
                                { label: 'Daily', value: DAILY },
                                { label: 'Weekly', value: WEEKLY },
                                { label: 'Monthly', value: MONTHLY },
                            ]}
                            onChange={(item) => {
                                setFrequency(item.value);
                            }}
                            dropdownLabel="Expense Frequency"
                            placeholderLabel="Expense Frequency"
                        />
                    </View>
                    <GreenLine />
                    <View style={styles.inputContainer}>
                        <Text style={styles.inputHeading}>Memo</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Notes about spending"
                            /* Need to add logic to connect to backend */
                        />
                    </View>
                    <GreenLine />
                    <View style={[styles.inputContainer, styles.cameraBtnsContainer]}>
                        {previewURI ? (
                            <SafeAreaView style={styles.container}>
                                <Image style={styles.preview} source={{ uri: previewURI }} />
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
                                            console.log('uri from imagepicker: ', imageURI);
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
                                        if (mediaLibaryPermission.status === 'granted') {
                                            const imageURI = await pickImage();
                                            console.log('uri from imagepicker: ', imageURI);
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
                        <TouchableOpacity style={styles.button} onPress={handleButtonPress}>
                            <Text
                                style={{
                                    fontFamily: 'Roboto-Bold',
                                    color: '#ffffff',
                                    textAlign: 'center',
                                    fontSize: 24,
                                }}>
                                Add
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    upperPart: {
        height: 50,
        backgroundColor: Colors.secondaryColor,
    },
    content: {
        flex: 1,
        alignItems: 'center',
    },
    titleContainer: {
        width: '100%',
        alignItems: 'center',
        backgroundColor: Colors.secondaryColor,
        paddingBottom: 10,
    },
    title: {
        color: 'white',
        fontFamily: 'Roboto-Bold',
        fontSize: 32,
        textAlign: 'center',
    },
    box: {
        width: 300,
        height: 100,
        backgroundColor: '#ffffff',
        borderRadius: 10,
        margin: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    box2: {
        width: 300,
        height: '66%',
        // height: Dimensions.get('window').height * 0.4,
        backgroundColor: '#ffffff',
        borderRadius: 10,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    inputContainer: {
        //flex: 1,
        height: 60,
        width: '100%',
        alignItems: 'center',
        textAlign: 'left',
    },
    inputHeading: {
        fontSize: 14,
        fontFamily: 'Roboto-Bold',
        color: Colors.secondaryColor,
        width: '84%',
        marginTop: 15,
    },
    input: {
        width: '84%',
        color: Colors.textColor,
        fontFamily: 'Roboto-Bold',
        fontSize: 18,
        textAlign: 'left',
    },
    button: {
        color: Colors.secondaryColor,
        fontFamily: 'Roboto-Bold',
        width: '60%',
        height: 40,
        borderRadius: 20,
        textAlign: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.secondaryColor,
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
        height: 100,
        marginTop: 10,
    },
    firstInput: {
        marginTop: 0,
    },
});
