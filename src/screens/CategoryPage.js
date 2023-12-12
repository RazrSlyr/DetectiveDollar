/**
 * @file Code for the user's Category screen.
 * Allows the user to add and edit expense categories
 */

import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { TouchableOpacity, StyleSheet, View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import ButtonComponent from '../components/ButtonComponent';
import CategoryAddComponent from '../components/CategoryAddComponent';
import CategoryEditComponent from '../components/CategoryEditComponent';
import GreenLine from '../components/GreenLine';
import * as Colors from '../constants/Colors';
import { getCategoryTable } from '../util/CategoryTableUtils';

export default function CategoryPage({ navigation }) {
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [showEditorComponent, setShowEditorComponent] = useState(false);
    const [showAddComponent, setShowAddComponent] = useState(false);

    useEffect(() => {
        updateCategories();

        // Add an event listener for focus to re-fetch expenses when the component comes into focus
        const unsubscribe = navigation.addListener('focus', updateCategories);

        // Clean up the event listener when the component unmounts
        return () => unsubscribe();
    }, [navigation, updateCategories]);

    const openCategoryEditor = () => {
        setShowEditorComponent(true);
    };
    const openCategoryAdd = () => {
        setShowAddComponent(true);
    };
    const updateCategories = async () => {
        try {
            // Fetch expenses for today and set to state
            const categories = await getCategoryTable();
            categories.sort(function (a, b) {
                const x = a.name;
                const y = b.name;
                if (x > y) {
                    return 1;
                }
                if (x < y) {
                    return -1;
                }
                return 0;
            });
            setCategories(categories);
            //console.log('Categories set!');
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    const closeCategoryEditor = () => {
        setSelectedCategory(null);
        setShowEditorComponent(false);
    };
    const closeCategoryAdd = () => {
        setShowAddComponent(false);
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
                <ButtonComponent
                    onPress={() => {
                        openCategoryAdd();
                    }}
                    name="Add"
                    buttonColor={Colors.SECONDARYCOLOR}
                    buttonStyle={styles.button}
                />
                <GreenLine />

                {categories.map((category) => {
                    return (
                        <View
                            key={category['id']}
                            style={[
                                styles.catgeoryContainer,
                                {
                                    backgroundColor: category['color']
                                        ? category['color']
                                        : Colors.SECONDARYCOLOR,
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
            <CategoryAddComponent
                isVisable={showAddComponent}
                onClose={closeCategoryAdd}
                onAdd={updateCategories}
            />
            <CategoryEditComponent
                isVisable={showEditorComponent}
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
        backgroundColor: Colors.SECONDARYCOLOR,
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
        backgroundColor: Colors.PRIMARYCOLOR,
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
        color: Colors.PRIMARYCOLOR,
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
        color: Colors.PRIMARYCOLOR,
        fontSize: 30,
        fontWeight: 'bold',
        alignSelf: 'flex-start',
        margin: 10,
    },
    editButtonContainer: {
        backgroundColor: Colors.PRIMARYCOLOR,
        borderRadius: 30,
        width: '20%',
        height: 'auto',
        alignItems: 'center',
        position: 'absolute',
        right: 20,
    },
    editText: {
        color: Colors.SECONDARYCOLOR,
        fontSize: 20,
    },
    button: {
        width: 180,
        marginBottom: 10,
    },
});
