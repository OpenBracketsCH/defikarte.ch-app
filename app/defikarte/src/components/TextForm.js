import React, { useState } from 'react';
import { View, Text, Switch, TextInput, StyleSheet } from 'react-native';
import { Controller } from "react-hook-form";

const TextForm = ({ labelText, keyboardType, defaultValue, multiline, placeholder, useSwitch = false, name, control, rules, errors, errorMsg }) => {
  const [switchValue, setSwitchValue] = useState(false);
  const [tempValue, setTempValue] = useState('');

  const onSwitchChange = (newVal, value, setValue) => {
    if (newVal) {
      setTempValue(value);
      setValue(defaultValue);
    }
    setSwitchValue(newVal);
    setValue(tempValue);
  }

  const defaultWithSwitch = (value, onChange) => {
    const textStyle = switchValue ? styles.switchActiveLabelStyle : styles.switchLabelStyle;
    if (useSwitch) {
      return (
        <View style={styles.switchContainerStyle}>
          <Switch
            style={styles.switchStyle}
            onValueChange={newVal => onSwitchChange(newVal, value, onChange)}
            value={switchValue}
          />
          <Text style={textStyle}>{defaultValue}</Text>
        </View>
      );
    }

    return null;
  }

  const showTextInput = (onChange, onBlur, value) => {
    if (!switchValue) {
      return (
        <TextInput
          style={styles.inputStyle}
          value={value}
          onChangeText={onChange}
          onBlur={onBlur}
          autoCapitalize='none'
          keyboardType={keyboardType}
          defaultValue={useSwitch ? '' : defaultValue}
          multiline={multiline}
          placeholder={placeholder}
          autoCorrect={false}
          editable={!switchValue}
          returnKeyType='done'
        />
      );
    }
  };

  return (
    <View style={styles.inlineForm} >
      <Controller
        control={control}
        name={name}
        rules={rules}
        defaultValue={useSwitch ? '' : defaultValue}
        render={({ onChange, onBlur, value }) => (
          <>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={styles.labelStyle}>{labelText}</Text>
              {defaultWithSwitch(value, onChange)}
            </View>
            {showTextInput(onChange, onBlur, value)}
          </>
        )}
      />
      {errors[name] && <Text style={styles.errorTextStyle}>{errorMsg}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  inlineForm: {
    flex: 1,
    marginHorizontal: 20,
    marginVertical: 10,
  },
  labelStyle: {
    fontSize: 18,
    marginRight: 10,
    color: 'rgba(70, 70, 70, 1)',
  },
  inputStyle: {
    borderColor: 'rgba(200, 200, 200, 1)',
    borderBottomWidth: 1,
    fontSize: 18,
    padding: 5,
  },
  switchContainerStyle: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  switchStyle: {
    marginRight: 10,
    marginVertical: 5,
  },
  switchLabelStyle: {
    fontSize: 16,
    marginRight: 10,
    color: 'rgba(140, 140, 140, 1)',
  },
  switchActiveLabelStyle: {
    fontSize: 16,
    marginRight: 10,
    color: '#007AFF',
    fontWeight: 'bold'
  },
  errorTextStyle: {
    fontSize: 16,
    color: 'red',
    marginTop: 3,
  }
});

export default TextForm;