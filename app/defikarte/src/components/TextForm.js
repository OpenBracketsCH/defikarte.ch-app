import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';

const TextForm = ({ labelText, value, setValue }) => {
  return (
    <View style={styles.inlineForm} >
      <Text style={styles.labelStyle}>{labelText}</Text>
      <TextInput
        style={styles.inputStyle}
        value={value}
        onChangeText={setValue}
        autoCapitalize='none'
        autoCorrect={false} />
    </View>
  );
};

const styles = StyleSheet.create({
  inlineForm: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  labelStyle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 10,
    width: 140,
  },
  inputStyle: {
    borderColor: 'lightgrey',
    borderWidth: 1,
    borderRadius: 5,
    fontSize: 18,
    padding: 5,
    flex: 1,
  }
});

export default TextForm;