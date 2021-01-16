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
    marginHorizontal: 20,
    marginVertical: 10,
  },
  labelStyle: {
    fontSize: 18,
    marginRight: 10,
    minWidth: 120,
    color: 'rgba(70, 70, 70, 1)',
  },
});

export default SwitchForm;