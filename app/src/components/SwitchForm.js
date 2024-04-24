import { t } from 'i18next';
import React from 'react';
import { Controller } from 'react-hook-form';
import { StyleSheet, Switch, Text, View } from 'react-native';

const SwitchForm = ({ labelText, name, control, rules, errors, errorMsg, defaultValue, disabled }) => {
  return (
    <View style={styles.inlineForm}>
      <Text style={styles.labelStyle}>{t(labelText)}</Text>
      <Controller
        control={control}
        name={name}
        rules={rules}
        defaultValue={defaultValue}
        render={({ field }) => <Switch onBlur={field.onBlur} onValueChange={field.onChange} value={field.value} disabled={disabled} />}
      />
      {errors && errors[name] && <Text style={styles.errorTextStyle}>{errorMsg ? t(errorMsg) : t(errors[name]?.message)}</Text>}
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
  },
});

export default SwitchForm;
