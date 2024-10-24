import { MaterialIcons } from '@expo/vector-icons';
import { t } from 'i18next';
import React, { useContext, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import SelectForm from '../components/SelectForm';
import SwitchForm from '../components/SwitchForm';
import TextForm from '../components/TextForm';
import createForm from '../config/createForm';
import { Context as DefibrillatorContext } from '../context/DefibrillatorContext';

const CreateScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const { state: defiState, addDefibrillator, resetError } = useContext(DefibrillatorContext);
  const [state, setState] = useState({ latitude: 0, longitude: 0, emergencyPhone: '144' });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (formValues) => {
    setState({ ...state, ...formValues, indoor: formValues.indoor ? 'yes' : 'no' });
    setIsSubmitted(true);
  };

  const add = async () => {
    await addDefibrillator(state, () => navigation.navigate('Main'));
  };

  useEffect(() => {
    const latlon = navigation.getParam('latlon');
    if (latlon) {
      setState({ ...state, latitude: latlon.latitude, longitude: latlon.longitude });
    }
  }, []);

  useEffect(() => {
    if (isSubmitted) {
      add();
      setIsSubmitted(false);
    } else {
      resetError();
    }
  }, [isSubmitted]);

  useEffect(() => {}, [state]);

  const renderFormComponent = () => {
    return createForm.map((formComp, index) => {
      if (formComp.type === 'Text') {
        return (
          <TextForm
            name={formComp.name}
            rules={formComp.rules}
            control={control}
            errors={errors}
            errorMsg={formComp.errorMsg}
            key={index}
            labelText={formComp.label}
            defaultValue={formComp.defaultValue}
            keyboardType={formComp.keyboardType}
            multiline={formComp.multiline}
            useSwitch={formComp.useSwitch}
            placeholder={formComp.placeholder}
            disabled={defiState.creating}
          />
        );
      } else if (formComp.type === 'Switch') {
        return (
          <SwitchForm
            name={formComp.name}
            rules={formComp.rules}
            control={control}
            errors={errors}
            errorMsg={formComp.errorMsg}
            defaultValue={formComp.defaultValue}
            key={index}
            labelText={formComp.label}
            disabled={defiState.creating}
          />
        );
      } else if (formComp.type === 'Select') {
        return (
          <SelectForm
            labelText={formComp.label}
            placeholder={formComp.placeholder}
            name={formComp.name}
            control={control}
            rules={formComp.rules}
            errors={errors}
            errorMsg={formComp.errorMsg}
            key={index}
            disabled={defiState.creating}
            options={formComp.options}
            infoTitel={formComp.infoTitel}
            infoText={formComp.infoText}
            infoLink={formComp.infoLink}
          />
        );
      } else {
        return null;
      }
    });
  };

  const bottomBar = { ...styles.bottomBar };
  bottomBar.paddingBottom = insets.bottom;

  return (
    <View style={styles.containerStyle}>
      <ActivityIndicator style={styles.loadingStyle} size="large" color="green" animating={defiState.creating} />
      <View style={styles.coordStyle}>
        <MaterialIcons color="green" size={30} name="location-pin" />
        <Text style={styles.inputStyle}>
          {state.latitude.toFixed(4)}, {state.longitude.toFixed(4)}
        </Text>
      </View>
      <KeyboardAvoidingView
        // padding is for ios best, for android it is not the best solution,
        // but the best available in this context
        behavior={Platform.OS === 'ios' ? 'padding' : 'padding'}
        enabled
        style={styles.fieldsContainer}
      >
        <ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          {renderFormComponent()}
          <Text style={styles.errorTextStyle}>{defiState.error}</Text>
        </ScrollView>
      </KeyboardAvoidingView>
      <View style={bottomBar}>
        <TouchableOpacity disabled={defiState.creating} color="white" title={t('create')} onPress={handleSubmit(onSubmit)}>
          <Text style={styles.buttonTextStyle}>{t('create')}</Text>
        </TouchableOpacity>
        <TouchableOpacity disabled={defiState.creating} color="white" title={t('cancel')} onPress={() => navigation.navigate('Main')}>
          <Text style={styles.buttonTextStyle}>{t('cancel')}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  containerStyle: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'white',
    display: 'flex',
  },
  fieldsContainer: {
    flex: 1,
  },
  coordStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 15,
    paddingVertical: 10,
    borderBottomWidth: 0.3,
    borderColor: 'rgba(200, 200, 200, 1)',
  },
  inputStyle: {
    fontSize: 18,
    paddingHorizontal: 5,
  },
  buttonTextStyle: {
    color: 'white',
    fontSize: 18,
  },
  bottomBar: {
    justifyContent: 'space-around',
    flexDirection: 'row',
    alignItems: 'center',
    height: 75,
    backgroundColor: 'green',
  },
  loadingStyle: {
    position: 'absolute',
    marginTop: 200,
    alignSelf: 'center',
    zIndex: 200,
  },
  errorTextStyle: {
    fontSize: 16,
    color: 'red',
    marginTop: 3,
    alignSelf: 'center',
  },
});

export default CreateScreen;
