import { StatusBar } from 'expo-status-bar';
import { useEffect, useMemo, useState } from 'react';
import {
    TouchableOpacity,
    StyleSheet,
    View,
    Text,
    ScrollView,
    Alert,
    SafeAreaView,
    Array,
} from 'react-native';
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
                setCategories(categories);
                console.log('Categories set!');
                console.log(categories);
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
            <Text style={[styles.title, styles.topTitle]}>Categories</Text>
            <View style={styles.scrollableContent}>
                {categories.map((category) => {
                    return (
                        <TouchableOpacity style={styles.catgeoryContainer}>
                            <Text>{category['name']}</Text>
                        </TouchableOpacity>
                    );
                })}
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: Colors.primaryColor,
        // figure out fontStyles
    },
    scrollableContent: {
        flex: 1,
        width: '100%', // Adjust the width as needed
        alignItems: 'center',
    },
    topTitle: {
        paddingTop: 20,
        margin: 'auto',
    },
    title: {
        fontWeight: 'bold',
        fontSize: 36,
        color: Colors.secondaryColor,
        marginRight: 15,
    },
    catgeoryContainer: {
        width: '80%',
        height: '10%',
    },
});
