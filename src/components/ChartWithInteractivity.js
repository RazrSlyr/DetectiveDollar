import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { PieChart } from 'react-native-svg-charts';

const data = [
    { key: 1, value: 30, svg: { fill: 'green' } },
    { key: 2, value: 20, svg: { fill: 'blue' } },
    { key: 3, value: 10, svg: { fill: 'red' } },
];

const ChartWithInteractivity = () => {
    const [expandedSlice, setExpandedSlice] = useState(null);

    const handleSlicePress = (index) => {
        setExpandedSlice(index);
    };

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <PieChart
                style={{ height: 200, width: 200 }}
                data={data}
                innerRadius={10} // Adjust this value for spacing between slices
                outerRadius={expandedSlice === null ? 70 : 80} // Adjust this value for slice expansion
                labelRadius={90} // Adjust this value to move the label away from the pie chart
                padAngle={0.02} // Adjust this value for slice separation
                onSlicesContentPress={(e) => handleSlicePress(e.index)}
            />
            <Text>Tap a slice to expand</Text>
            <Text>(Not working)</Text>
        </View>
    );
};

export default ChartWithInteractivity;
