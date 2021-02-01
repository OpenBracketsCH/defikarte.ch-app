import React from 'react';
import { View, Text, Switch, StyleSheet } from 'react-native';
import { Controller } from "react-hook-form";

const SwitchForm = ({ labelText, name, control, rules, errors, errorMsg, defaultValue, disabled }) => {
  return (
    <View style={styles.inlineForm} >
      <Text style={styles.labelStyle}>{labelText}</Text>
      <Controller
        control={control}
        name={name}
        rules={rules}
        defaultValue={defaultValue}
        render={({ onChange, onBlur, value }) => (
          <Switch
            onBlur={onBlur}
            onValueChange={onChange}
            value={value}
            disabled={disabled}
          />
        )}
      />
      {errors[name] && <Text style={styles.errorTextStyle}>{errorMsg}</Text>}
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
  errorTextStyle: {
    fontSize: 16,
    color: 'red',
    marginTop: 3,
  }
});

export default SwitchForm;