import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';

import * as Colors from '../../constants/Colors';

/**
 * Component for displaying a legend for a pie chart
 * @param {object} props Props object. Only prop is chartData (object)
 * @returns {object} The component object for the pie chart legend
 * @memberof Components
 */
const PieChartLegend = ({ chartData }) => {
    // create dot for legend
    const renderCategoryColor = (color) => {
        return <View style={[styles.categoryColor, { backgroundColor: color }]} />;
    };

    return (
        <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContentContainer}>
            <View style={styles.legendBox}>
                {chartData.map((item, index) => (
                    <View key={index} style={styles.categoryBoxes}>
                        <View style={styles.categoryInfo}>
                            {item.label === 'No Data Available' && chartData.length === 1 ? (
                                <Text>No Data Available</Text>
                            ) : (
                                <>
                                    <Text style={styles.categoryData}>{item.label}</Text>
                                    <Text> - </Text>
                                    <Text style={styles.categoryData}>${item.value}</Text>
                                </>
                            )}
                        </View>
                        {renderCategoryColor(item.color)}
                    </View>
                ))}
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    legendBox: {
        justifyContent: 'center',
        marginTop: 40,
    },
    categoryBoxes: {
        width: 300,
        height: 40,
        backgroundColor: 'white',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between', // Adjust this to control spacing
        alignItems: 'center',
        borderRadius: 10,
        borderWidth: 1.5,
        borderColor: Colors.SUBHEADINGCOLOR,
        marginTop: 2,
    },
    categoryInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 10, // Adjust this to control space between text and dot
    },
    categoryData: {
        textAlign: 'center',
        fontSize: 14,
    },
    scrollContentContainer: {
        paddingBottom: 20,
    },
    categoryColor: {
        height: 15,
        width: 15,
        borderRadius: 10,
        marginRight: 5,
    },
});

export default PieChartLegend;
