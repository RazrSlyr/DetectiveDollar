import * as React from 'react';
import { StyleSheet, Text, Button, View } from 'react-native';



const AddExpense = ({navigation}) => {
    return (
        <View style={styles.container}>
          <Text>Add Expense Screen</Text>
        </View>
      );
}

export default AddExpense;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});