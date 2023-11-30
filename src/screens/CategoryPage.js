import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { TouchableOpacity, StyleSheet, View, Text, ScrollView, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import CategoryEditComponent from '../components/CategoryEditComponent';
import * as Colors from '../constants/Colors';
import { getCategoryTable } from '../util/FileSystemUtils';
export default function CategoryPage({ navigation }) {
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [showEditor, setShowEditor] = useState(false);
    useEffect(() => {
        const getCategories = async () => {
            try {
                // Fetch expenses for today and set to state
                const categories = await getCategoryTable();
                setCategories(categories);
                console.log('Categories set!');
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
            console.log('Categories set!');
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
                {categories.map((category) => {
                    return (
                        <View
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
                                    console.log('edit', category.name);
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
});
