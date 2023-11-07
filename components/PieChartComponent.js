import { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { PieChart } from 'react-native-svg-charts';

const randomGreenShade = () => {
    // Need to work on this if we want more consistent green colors
    // let greenComponent;
    // let redComponent;
    // let blueComponent
    
    // // lower values for red and blue components so we can more shades of green
    // do {
    //     greenComponent = Math.floor(Math.random() * 256);
    //     redComponent = Math.floor(Math.random() * 256);
    //     blueComponent = Math.floor(Math.random() * 256);
        
    // } while ((greenComponent <= redComponent) || (greenComponent <= blueComponent));
    const greenComponent = Math.floor(Math.random() * 256);
    const redComponent = Math.floor(Math.random() * 256);
    const blueComponent = Math.floor(Math.random() * 256);

    const randomColor = `rgb(${redComponent}, ${greenComponent}, ${blueComponent})`;
  
    return randomColor;
};

// Function to grab our data
// edit this function to grab the data we need
const getPieChartData = (data: []) => {
    return data.map((item, index) => {  
        const color = randomGreenShade();

        return  {
            key: index,
            value: item,
            svg: { fill: color },
        }
    })
}

export const PieChartComponent = () => {
    // random data I made. Pass our data here
    const randData = [40, 30, 20, 10, 9, 2, 50]
    const pieChartData = getPieChartData(randData)

    return (
        <PieChart
            style={styles.chart}
            data={pieChartData}
            innerRadius={0}
            padAngle={0}
        />
    )
}

const styles = StyleSheet.create({
    chart: {
        width: 200,
        height: 200,
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center', 
        marginLeft: 30, // for some reason graph is hugging right side
    },
});