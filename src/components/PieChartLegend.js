import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';

const PieChartLegend = ({ chartData }) => {
    // create dot for legend
    const renderDot = (color) => {
        return (
            <View
                style={{
                    height: 15,
                    width: 15,
                    borderRadius: 10,
                    backgroundColor: color,
                    marginRight: 5,
                }}
            />
        );
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
                        {renderDot(item.color)}
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
        borderColor: '#b7c8be',
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
});

export default PieChartLegend;
