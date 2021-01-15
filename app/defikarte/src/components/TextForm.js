import React, { useState } from 'react';
import { View, Text, Switch, TextInput, StyleSheet } from 'react-native';

const TextForm = ({ labelText, value, setValue, keyboardType, defaultValue, multiline, placeholder, useSwitch = false }) => {
  const [switchValue, setSwitchValue] = useState(false);
  const [tempValue, setTempValue] = useState('');

  const onSwitchChange = (newVal) => {
    if (newVal) {
      setTempValue(value);
      setValue(defaultValue);
    }
    setSwitchValue(newVal);
    setValue(tempValue);
  }

  const defaultWithSwitch = () => {
    const textStyle = switchValue ? styles.switchActiveLabelStyle : styles.switchLabelStyle;
    if (useSwitch) {
      return (
        <View style={styles.switchContainerStyle}>
          <Switch
            style={styles.switchStyle}
            onValueChange={onSwitchChange}
            value={switchValue}
          />
          <Text style={textStyle}>{defaultValue}</Text>
        </View>
      );
    }

    return null;
  }

  const showTextInput = () => {
    if (!switchValue) {
      return (
        <TextInput
          style={styles.inputStyle}
          value={value}
          onChangeText={setValue}
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
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Text style={styles.labelStyle}>{labelText}</Text>
        {defaultWithSwitch()}
      </View>

      {showTextInput()}
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
  }
});

export default TextForm;