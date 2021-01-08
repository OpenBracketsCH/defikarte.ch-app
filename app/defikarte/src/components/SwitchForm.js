import React from 'react';
import { View, Text, Switch, StyleSheet } from 'react-native';

const SwitchForm = ({ labelText, value, setValue }) => {
  return (
    <View style={styles.inlineForm} >
      <Text style={styles.labelStyle}>{labelText}</Text>
      <Switch
        onValueChange={setValue}
        value={value}
      />
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
    width: 150,
  },
});

export default SwitchForm;