import * as React from 'react';
import { StyleSheet, Text, Button, View } from 'react-native';



const HomePage = ({navigation}) => {
    return (
        <View style={styles.container}>
          <Text>Home Screen</Text>
        </View>
      );
}

export default HomePage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});