/**
 * @file Code for the user's Category screen.
 * Allows the user to add and edit expense categories
 */

import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import {
    TouchableOpacity,
    StyleSheet,
    View,
    Text,
    ScrollView,
    Modal,
    TextInput,
    KeyboardAvoidingView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ColorPicker from 'react-native-wheel-color-picker';

import CategoryEditComponent from '../components/CategoryEditComponent';
import * as Colors from '../constants/Colors';
import * as Sizes from '../constants/Sizes';
import { addRowToCategoryTable, getCategoryTable } from '../util/FileSystemUtils';

export default function CategoryPage({ navigation }) {
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [showEditor, setShowEditor] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [categoryName, setCategoryName] = useState('');
    const [categoryColor, setColor] = useState('');

    const onColorChange = (color) => {
        setColor(color);
    };

    useEffect(() => {
        const getCategories = async () => {
            try {
                // Fetch expenses for today and set to state
                const categories = await getCategoryTable();
                setCategories(categories);
                //console.log('Categories set!');
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };

        // Call getExpenses when the component mounts
        getCategories();

        // Add an event listener for focus to re-fetch expenses when the component comes into focus
        const unsubscribe = navigation.addListener('focus', getCategories);

        // Clean up the event listener when the component unmounts
        return () => unsubscribe();
    }, [navigation]);

    const openCategoryEditor = async () => {
        setShowEditor(true);
    };

    const updateCategories = async () => {
        try {
            // Fetch expenses for today and set to state
            const categories = await getCategoryTable();
            setCategories(categories);
            //console.log('Categories set!');
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    const closeCategoryEditor = () => {
        setSelectedCategory(null);
        setShowEditor(false);
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar style="auto" />
            <View style={styles.titleContainer}>
                <Text style={styles.titleText}>Categories</Text>
            </View>
            <ScrollView
                style={styles.scrollableContainer}
                contentContainerStyle={styles.scrollableContent}>
                <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
                    <Text style={styles.addButtonText}>Add Category</Text>
                </TouchableOpacity>
                <View style={styles.dividerLine} />
                <Modal
                    animationType="slide"
                    transparent
                    visible={modalVisible}
                    onRequestClose={() => {
                        setModalVisible(!modalVisible);
                    }}>
                    <KeyboardAvoidingView style={styles.modalShadow}>
                        <KeyboardAvoidingView style={styles.centeredView}>
                            <View style={styles.modalView}>
                                <Text style={styles.modalTitle}>Add Category</Text>
                                <View style={styles.inputContainer}>
                                    <Text style={styles.inputHeading}>Name</Text>
                                    <TextInput
                                        style={styles.input}
                                        value={categoryName}
                                        onChangeText={(cName) => setCategoryName(cName)}
                                    />
                                    <View style={styles.line} />
                                    <Text style={styles.inputHeading}>Color</Text>
                                    <View style={styles.colorPickerBox}>
                                        <ColorPicker
                                            color={categoryColor}
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
                                <View style={styles.addCancelBox}>
                                    <TouchableOpacity
                                        style={[
                                            styles.addButton,
                                            {
                                                backgroundColor: Colors.secondaryColor,
                                                width: '40%',
                                                alignSelf: 'right',
                                            },
                                        ]}
                                        onPress={async () => {
                                            addRowToCategoryTable(categoryName, categoryColor);
                                            setModalVisible(!modalVisible);
                                            updateCategories();
                                            setCategoryName(undefined);
                                        }}>
                                        <Text style={styles.addButtonText}>Add</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={[
                                            styles.addButton,
                                            {
                                                backgroundColor: 'red',
                                                width: '40%',
                                                alignSelf: 'right',
                                            },
                                        ]}
                                        onPress={async () => {
                                            setModalVisible(!modalVisible);
                                            setCategoryName(undefined);
                                        }}>
                                        <Text style={styles.addButtonText}>Cancel</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </KeyboardAvoidingView>
                    </KeyboardAvoidingView>
                </Modal>
                {categories.map((category) => {
                    return (
                        <View
                            key={category['id']}
                            style={[
                                styles.catgeoryContainer,
                                {
                                    backgroundColor: category['color']
                                        ? category['color']
                                        : Colors.secondaryColor,
                                },
                            ]}>
                            <Text style={styles.categoryText}>{category.name}</Text>
                            <TouchableOpacity
                                style={styles.editButtonContainer}
                                onPress={async () => {
                                    setSelectedCategory(category);
                                    openCategoryEditor();
                                }}>
                                <Text style={styles.editText}>Edit</Text>
                            </TouchableOpacity>
                        </View>
                    );
                })}
            </ScrollView>

            <CategoryEditComponent
                isVisable={showEditor}
                onClose={closeCategoryEditor}
                category={selectedCategory}
                onUpdate={updateCategories}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        height: '90%',
        width: '100%',
        alignSelf: 'center',
        alignItems: 'center',
        backgroundColor: Colors.secondaryColor,
    },
    rowContainer: {
        width: '90%',
        marginBottom: 10,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        position: 'absolute',
        marginTop: 30,
    },
    scrollableContainer: {
        flex: 1,
        width: '100%',
        backgroundColor: Colors.primaryColor,
    },
    scrollableContent: {
        width: '100%', // Adjust the width as needed
        padding: 10,
        alignItems: 'center',
    },
    titleContainer: {
        width: 'auto',
    },
    addButton: {
        color: Colors.secondaryColor,
        width: '60%',
        height: 50,
        borderRadius: 20,
        textAlign: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.secondaryColor,
        margin: 20,
    },
    addButtonText: {
        color: Colors.primaryColor,
        alignSelf: 'center',
        fontSize: Sizes.textSize,
        fontWeight: 'bold',
    },
    dividerLine: {
        width: '70%',
        borderBottomWidth: 3,
        borderColor: Colors.secondaryColor,
        alignSelf: 'center',
    },
    titleText: {
        fontWeight: 'bold',
        fontSize: 35,
        color: Colors.primaryColor,
        justifyContent: 'center',
    },
    catgeoryContainer: {
        width: '90%',
        height: 'auto',
        flexDirection: 'row',
        alignItems: 'center',
        margin: 10,
        borderRadius: 10,
        paddingHorizontal: 10,
        borderColor: 'black',
        borderWidth: 2,
    },
    categoryText: {
        color: Colors.primaryColor,
        fontSize: 30,
        fontWeight: 'bold',
        alignSelf: 'flex-start',
        margin: 10,
    },
    editButtonContainer: {
        backgroundColor: Colors.primaryColor,
        borderRadius: 30,
        width: '20%',
        height: 'auto',
        alignItems: 'center',
        position: 'absolute',
        right: 20,
    },
    editText: {
        color: Colors.secondaryColor,
        fontSize: 20,
    },
    backButton: {
        width: 'auto',
    },
    // Starting now, add category modal styles
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalShadow: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
    },
    modalView: {
        backgroundColor: Colors.primaryColor,
        borderRadius: 20,
        padding: 10,
        alignItems: 'center',
        elevation: 5,
        width: '80%',
        height: '70%',
    },
    modalTitle: {
        textAlign: 'center',
        color: Colors.secondaryColor,
        fontWeight: 'bold',
        fontSize: Sizes.titleSize,
    },
    inputContainer: {
        height: '50%',
        width: '80%',
        marginBottom: 10,
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
        width: '80%',
        color: Colors.textColor,
        fontFamily: 'Roboto-Bold',
        fontSize: 20,
        textAlign: 'left',
    },
    line: {
        height: 2,
        width: '100%',
        backgroundColor: Colors.secondaryColor,
        alignSelf: 'center',
    },
    addCancelBox: {
        width: '80%',
        height: 'auto',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        margin: 120,
    },
    colorPickerBox: {
        width: '100%',
        height: 300,
    },
});
