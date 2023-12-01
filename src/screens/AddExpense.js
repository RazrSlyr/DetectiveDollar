import { AntDesign, Feather } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import {
    TouchableOpacity,
    StyleSheet,
    Text,
    TextInput,
    View,
    Dimensions,
    SafeAreaView,
} from 'react-native';

import DropdownSelector from '../components/Dropdown';
import { textColor } from '../constants/Colors';
import { DAILY, MONTHLY, NO_REPETION, WEEKLY } from '../constants/FrequencyConstants';
import { getCurrentDateString } from '../util/DatetimeUtils';
import { addRowToCategoryTable, addRowToExpenseTable, addImage, getCategoryTable} from '../util/FileSystemUtils';
import { pickImage, captureImage } from '../util/ImagePickerUtil';

export default function App({ navigation }) {
    const [name, setName] = useState('');
    const [amount, setAmount] = useState('');
    const [category, setCategory] = useState('');
    const [frequency, setFrequency] = useState(NO_REPETION);
    const [previewURI, setImageURI] = useState(null);
    const handleButtonPress = async () => {
        // Button logic
        if (name === '' || amount === '' || category === '') {
            alert('Please Input a Name, Amount, and Category');
            return;
        }
        const dateString = getCurrentDateString();
        await addRowToCategoryTable(category);
        let imageURI = null;
        if (previewURI) {
            imageURI = await addImage(previewURI);
        }
        await addRowToExpenseTable(
            name,
            category,
            parseFloat(amount),
            dateString,
            frequency,
            imageURI
        );
        this.name.clear()
        this.amount.clear()
        // this.category.clear()
        alert("Entry added")
        setTextInputVisible(false)
        navigation.navigate('Home')
    };
    const formattedAmount = amount.toLocaleString('en-US', {
        style: 'currency',
        currency: 'USD',
    });
    const clearImage = async () => {
        console.log('remove photo');
        //deleteImageAsset(imageURI);
        setImageURI(null);
    };

    const [categories, setCategories] = useState([]);
    const fetchCategories = async() => {
        try {
            const categories = await getCategoryTable();
            const categoryNames = categories.map((category) => category["name"]);
            setCategories(categoryNames);
            return categoryNames
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };
    useEffect(() => {
        fetchCategories();  
    }, []);

    const [isTextInputVisible, setTextInputVisible] = useState(false);
    const handleCategoryButtonPress = () => {
        setTextInputVisible(true);
    }

    return (
        <View style={styles.container}>
            <Text style={[styles.title, styles.topTitle]}>Add{'\n'}Expense</Text>
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
                    Today's Remaining Budget
                </Text>
                <Text style={{ ...styles.title, fontSize: 40, top: 10 }}>${formattedAmount}</Text>
            </View>
            <View style={styles.box2}>
                <TextInput ref={input => { this.name = input }}
                    style={styles.input}
                    placeholder="Name"
                    onChangeText={(value) => setName(value)}
                />
                <TextInput ref={input => { this.amount = input }}
                    style={styles.input}
                    placeholder="Amount"
                    keyboardType="numeric"
                    maxLength={10}
                    onChangeText={(value) => setAmount(value)}
                />
                <View style={{ flexDirection: 'row', alignItems: 'center'}}>
                        <DropdownSelector
                            data = {categories.map((name) => ({ label: name }))}
                            onChange={(item) => {
                                {!isTextInputVisible (
                                    setCategory(item.label)
                                )}
                            }}
                            dropdownLabel="Category"
                            placeHolderLabel="Category"
                        />
                    <TouchableOpacity onPress={handleCategoryButtonPress}>
                        <AntDesign name="pluscircleo" size={20} color="#37c871" />
                    </TouchableOpacity>
                </View>
                <View>
                    {isTextInputVisible && (
                        <View style={{ flexDirection: 'row', alignItems: 'center'}}>
                            <TextInput ref={input => { this.category = input }}
                                style={styles.input}
                                placeholder="Category"
                                onChangeText={(value) => setCategory(value)}
                            />
                        </View>
                    )}
                </View>
                <DropdownSelector
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
                {previewURI ? (
                    <SafeAreaView style={styles.container}>
                        <Image style={styles.preview} source={{ uri: previewURI }} />
                        <TouchableOpacity
                            style={{ position: 'absolute', right: -30, alignSelf: 'center' }}
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
                                const imageURI = await captureImage();
                                console.log('uri from imagepicker: ', imageURI);
                                setImageURI(imageURI);
                            }}>
                            <Feather name="camera" size={40} color="black" />
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.rowItem}
                            onPress={async () => {
                                const imageURI = await pickImage();
                                console.log('uri from imagepicker: ', imageURI);
                                setImageURI(imageURI);
                            }}>
                            <AntDesign name="upload" size={40} color="black" />
                        </TouchableOpacity>
                    </View>
                )}
            </View>

            <TouchableOpacity style={styles.button} onPress={handleButtonPress}>
                <View style={styles.buttonContainer}>
                    <Text
                        style={{
                            fontFamily: 'Roboto-Bold',
                            color: '#ffffff',
                            textAlign: 'center',
                            fontSize: 30,
                        }}>
                        Add
                    </Text>
                </View>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f9f9f9',
        alignItems: 'center',
        justifyContent: 'top',
    },
    topTitle: {
        paddingTop: 50,
        margin: 'auto',
    },
    title: {
        color: '#37c871',
        fontFamily: 'Roboto-Bold',
        fontSize: 30,
        textAlign: 'center',
        marginTop: 20,
    },
    box: {
        width: 300,
        height: 100,
        backgroundColor: '#ffffff',
        borderRadius: 10,
        margin: 10,
    },
    box2: {
        width: 300,
        height: Dimensions.get('window').height * 0.5,
        backgroundColor: '#ffffff',
        borderRadius: 10,
        margin: 10,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
    },
    input: {
        color: textColor,
        fontFamily: 'Roboto-Bold',
        fontSize: 20,
        width: 250,
        borderColor: '#37c871',
        borderRadius: 10,
        padding: 10,
        textAlign: 'center',
    },
    button: {
        color: '#ffffff',
        fontFamily: 'Roboto-Bold',
        fontSize: 20,
        width: 250,
        height: 40,
        outlineColor: '#37c871',
        borderColor: '#37c871',
        borderRadius: 10,
        textAlign: 'center',
    },
    buttonContainer: {
        backgroundColor: '#37c871',
        padding: 10,
        borderRadius: 10,
        height: 60,
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
});
