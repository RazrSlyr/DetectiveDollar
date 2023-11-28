import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const PieChartLegend = ({ chartData }) => {
    // create dot for legend
    const renderDot = (color) => {
        return (
            <View
                style={{
                    height: 10,
                    width: 10,
                    borderRadius: 5,
                    backgroundColor: color,
                    marginRight: 5,
                }}
            />
        );
    };

    return (
        <View style={styles.legendGrid}>
            {chartData.map((item, index) => (
                <View key={index} style={styles.legendItem}>
                    {renderDot(item.color)}
                    <Text style={styles.legendLabel}>{item.label}</Text>
                </View>
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    legendGrid: {
        flexGrow: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        marginTop: 10,
    },
    legendItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 20,
        marginBottom: 10,
    },
    legendLabel: {
        marginLeft: 5,
    },
});

export default PieChartLegend;
