import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Text, TextInput, ScrollView } from 'react-native';
import { backgroundColor, primaryColor, secondaryColor, subHeadingColor } from './Colors';
import AddButton from './components/AddButton';

export default function HomePage() {
    const goToAddPage = () => {
        navigation.navigate('TEMPORARY') // change TEMPORARY to actual page
    };
    
    return (
        <View style={styles.container}>
            <Text style={[styles.title, styles.topTitle]}>Daily</Text>
            <Text style={styles.title}>Summary</Text>
            <View style={styles.totalExpensesContainer}>
                <Text style={styles.subHeading}>
                    Today's Expenses
                </Text>
                <TextInput 
                    style={styles.textInput}
                    placeholder='$0.00'
                />
            </View>
            <View style={styles.expensesContainer}>
                <Text style={styles.subHeading}>
                    History
                </Text>
                <ScrollView>
                    <View style={styles.scrollableContent}>
                        {/* Place your scrollable content here */}
                        <View style={styles.expenseBoxes}></View>
                        <View style={styles.expenseBoxes}></View>
                        <View style={styles.expenseBoxes}></View>
                        <View style={styles.expenseBoxes}></View>
                        <View style={styles.expenseBoxes}></View>
                        {/* Add more content as needed */}
                    </View>
                </ScrollView>
            </View>
            <AddButton onPress={goToAddPage}></AddButton>
            <StatusBar style="auto" />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: primaryColor,
        // figure out fontStyles
    },
    topTitle: {
        paddingTop: 50,
        margin: 'auto',
    },
    title: {
        fontWeight: 'bold',
        fontSize: 36,
        color: secondaryColor,
    },
    totalExpensesContainer: {
        backgroundColor: 'white',
        borderRadius: 15,
        flex: 1 / 4,
        margin: 20,
        width: '70%',
        alignItems: 'right',
        justifyContent: 'center',
    },
    subHeading: {
        color: subHeadingColor,
        fontSize: 24,
        margin: 'auto',
        paddingLeft: 10,
        paddingTop: 10,
    },
    textInput: {
        fontSize: 50,
        margin: 'auto',
        paddingLeft: 10,
        paddingBottom: 5,
    },
    expensesContainer: {
        backgroundColor: 'green',
        flex: 1 / 2,
        width: '70%',
        borderRadius: 15,
        borderWidth: 2,
    },
    scrollableContent: {
        flex: 1,
        width: '100%', // Adjust the width as needed
        alignItems: 'center',
    },
    expenseBoxes: {
        width: '100%',
        height: 70,
        backgroundColor: 'white',
        borderRadius: 15,
        borderWidth: 2,
        borderColor: secondaryColor,
    },
});