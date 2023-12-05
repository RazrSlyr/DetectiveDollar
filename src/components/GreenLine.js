import React from 'react';
import { View, StyleSheet } from 'react-native';

import * as Colors from '../constants/Colors';

const GreenLine = () => {
    return <View style={styles.line} />;
};

const styles = StyleSheet.create({
    line: {
        height: 2,
        width: '84%',
        backgroundColor: Colors.secondaryColor,
    },
});

export default GreenLine;
