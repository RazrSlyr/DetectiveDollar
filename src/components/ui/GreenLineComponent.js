import React from 'react';
import { View, StyleSheet } from 'react-native';

import * as Colors from '../../constants/Colors';

/**
 * Component for a green separator line
 * @returns {object} The component object for the separator line
 * @memberof Components
 */
const GreenLine = () => {
    return <View style={styles.line} />;
};

const styles = StyleSheet.create({
    line: {
        height: 2,
        width: '84%',
        backgroundColor: Colors.SECONDARYCOLOR,
        alignSelf: 'center',
    },
});

export default GreenLine;
