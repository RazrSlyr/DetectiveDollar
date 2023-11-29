import { StatusBar } from 'expo-status-bar';
import { useEffect, useMemo, useState } from 'react';
import { TouchableOpacity, StyleSheet, View, Text, ScrollView, Alert } from 'react-native';
import {
    SafeAreaView,
    SafeAreaProvider,
    SafeAreaInsetsContext,
    useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { Button } from 'react-native-web';

import * as Colors from '../constants/Colors';
import { getCategoryTable } from '../util/FileSystemUtils';
export default function CategoryPage({ navigation }) {
    const [categories, setCategories] = useState([]);
    useEffect(() => {
        const getCategories = async () => {
            try {
                // Fetch expenses for today and set to state
                const categories = await getCategoryTable();
                console.log(categories);
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
                            <TouchableOpacity style={styles.editButtonContainer}>
                                <Text style={styles.editText}>Edit</Text>
                            </TouchableOpacity>
                        </View>
                    );
                })}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: '90%',
        alignContent: 'flex-start',
        alignItems: 'center',
        // figure out fontStyles
    },
    scrollableContainer: {
        flex: 1,
        width: '100%',
    },
    scrollableContent: {
        width: '100%', // Adjust the width as needed
        padding: 10,
        alignItems: 'center',
    },
    titleContainer: {
        margin: 'auto',
        width: '100%',
        backgroundColor: Colors.secondaryColor,
        alignItems: 'center',
        justifyContent: 'center',
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
});
