import { t } from 'i18next';
import React from 'react';
import { Controller } from 'react-hook-form';
import { StyleSheet, Text, View } from 'react-native';
import SelectDropdown from 'react-native-select-dropdown';
import FieldInfo from './FieldInfo';

const SelectForm = ({ labelText, placeholder, name, control, rules, errors, errorMsg, disabled, options, infoTitel, infoText, infoLink }) => {
  return (
    <>
      <View style={styles.inlineForm}>
        <Controller
          control={control}
          name={name}
          rules={rules}
          render={({ field }) => {
            return (
              <>
                <View style={styles.inlineInfoStyle}>
                  <Text style={styles.labelStyle}>{labelText}</Text>
                  <FieldInfo titel={infoTitel} text={infoText} link={infoLink} />
                </View>
                <SelectDropdown
                  showsVerticalScrollIndicator={true}
                  data={['', ...options]}
                  onSelect={(selectedItem) => {
                    field.onChange(selectedItem);
                  }}
                  onBlur={field.onBlur}
                  defaultValue={field.value}
                  disabled={disabled}
                  renderButton={(selectedItem) => {
                    return (
                      <View style={styles.dropdownButtonStyle}>
                        <Text style={styles.dropdownButtonTextStyle}>{t(selectedItem) || placeholder}</Text>
                      </View>
                    );
                  }}
                  renderItem={(item, index, isSelected) => {
                    return (
                      <View
                        style={{
                          ...styles.dropdownItemStyle,
                          ...(isSelected && { backgroundColor: '#D2D9DF' }),
                        }}
                      >
                        {(item && <Text style={styles.dropdownItemTextStyle}>{t(item)}</Text>) || (
                          <Text style={styles.dropdownItemEmptyTextStyle}>keine Angabe</Text>
                        )}
                      </View>
                    );
                  }}
                  dropdownStyle={styles.dropdownMenuStyle}
                />
              </>
            );
          }}
        />
        {errors && errors[name] && <Text style={styles.errorTextStyle}>{errorMsg ?? errors[name]?.message}</Text>}
      </View>
    </>
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
  inlineInfoStyle: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputStyle: {
    borderColor: 'rgba(200, 200, 200, 1)',
    borderBottomWidth: 1,
    fontSize: 18,
    padding: 5,
  },
  centeredView: {
    borderWidth: 1,
    borderColor: 'red',
    marginTop: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  errorTextStyle: {
    fontSize: 16,
    color: 'red',
    marginTop: 3,
  },
  dropdownButtonStyle: {
    marginTop: 5,
    padding: 5,
    width: '100%',
    height: 35,
    backgroundColor: '#E9ECEF',
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  dropdownButtonTextStyle: {
    flex: 1,
    fontSize: 18,
    color: '#151E26',
    textAlign: 'left',
  },
  dropdownMenuStyle: {
    backgroundColor: '#E9ECEF',
    borderRadius: 5,
    height: 235,
  },
  dropdownItemStyle: {
    width: '100%',
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#B1BDC8',
  },
  dropdownItemTextStyle: {
    flex: 1,
    fontSize: 18,
    textAlign: 'left',
    height: 22,
  },
  dropdownItemEmptyTextStyle: {
    flex: 1,
    fontSize: 18,
    textAlign: 'left',
    height: 22,
    color: '#8F8F8F',
  },
});

export default SelectForm;
