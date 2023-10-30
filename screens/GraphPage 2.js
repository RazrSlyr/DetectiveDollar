import * as React from 'react';
import { StyleSheet, Text, Button, View } from 'react-native';



const GraphPage = ({navigation}) => {
    return (
        <View style={styles.container}>
          <Text>Graph Screen</Text>
        </View>
      );
}

export default GraphPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});