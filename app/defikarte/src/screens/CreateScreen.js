import React, { useContext, useState } from 'react';
import { View, SafeAreaView, Text, TouchableOpacity, KeyboardAvoidingView, ActivityIndicator, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useForm } from 'react-hook-form';
import opening_hours from 'opening_hours';
import { Context as DefibrillatorContext } from '../context/DefibrillatorContext';
import TextForm from '../components/TextForm';
import SwitchForm from '../components/SwitchForm';
import { useEffect } from 'react';
import { ScrollView } from 'react-native-gesture-handler';

const CreateScreen = ({ navigation }) => {
  const { state: defiState, addDefibrillator } = useContext(DefibrillatorContext);
  const [state, setState] = useState({ latitude: 0, longitude: 0, emergencyPhone: '144' });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { control, handleSubmit, errors } = useForm();

  const openingHoursValidation = value => {
    let valid = false;
    try {
      let oh = new opening_hours(value);
      valid = true;
    } catch (error) {
      valid = false;
    }

    return value == '' || valid;
  }

  const defiForm = [
    {
      name: 'reporter',
      rules: { required: true },
      type: 'Text',
      label: 'Melder',
      placeholder: 'Max Mustermann',
      defaultValue: '',
      errorMsg: 'Der Melder wird benötigt',
    },
    {
      name: 'location',
      rules: { required: true, maxLength: 200 },
      type: 'Text',
      label: 'Standort',
      placeholder: 'Schulhaus Zürich West, neben Eingang',
      defaultValue: '',
      errorMsg: 'Der Standort wird benötigt, maximale Länge 200 Zeichen',
    },
    {
      name: 'description',
      rules: { required: false, maxLength: 200 },
      type: 'Text',
      label: 'Beschreibung',
      placeholder: 'z.B.: während Öffnungszeiten verfügbar',
      defaultValue: '',
      multiline: true,
      errorMsg: 'Die maximale Länge beträgt 200 Zeichen',
    },
    /* not required 
    es gibt diverse opening Hour validation tools. problem: es gibt sehr viele kombinationen,
    automatische opening hours validation wäre gut: https://wiki.openstreetmap.org/wiki/Key:opening_hours#Implementation*/
    {
      name: 'openingHours',
      rules: { validate: openingHoursValidation },
      type: 'Text',
      label: 'Öffnungszeiten',
      placeholder: 'Mo-Fr: 08:00-17:00',
      defaultValue: '24/7',
      useSwitch: true,
      multiline: true,
      errorMsg: 'Die eingegebenen Öffnungzeiten entsprechen nicht dem geforderten Format.',
    },
    {
      name: 'operator',
      rules: { required: false },
      type: 'Text',
      label: 'Betreiber',
      placeholder: 'Gemeinde, Verein, Privatperson',
      defaultValue: '',
    },
    {
      name: 'operatorPhone',
      rules: { pattern: /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/ },
      type: 'Text',
      label: 'Telefon',
      placeholder: '+41 79 000 00 00',
      keyboardType: 'phone-pad',
      defaultValue: '',
      errorMsg: 'Der Wert muss eine gültige Telefonummer sein',
    },
    {
      name: 'access',
      type: 'Switch',
      label: 'Zugänglich',
      defaultValue: false,
    },
    {
      name: 'indoor',
      type: 'Switch',
      label: 'Im Gebäude',
      defaultValue: false,
    },
  ]

  const onSubmit = (formValues) => {
    setState({ ...state, ...formValues });
    setIsSubmitted(true);
  }

  const add = async () => {
    await addDefibrillator(state, () => navigation.navigate('Main'));
    console.log(defiState.newDefibrillators)
    console.log(defiState.creating)
  }

  useEffect(() => {
    const latlon = navigation.getParam('latlon');
    if (latlon) {
      setState({ ...state, latitude: latlon.latitude, longitude: latlon.longitude })
    }
  }, [])

  useEffect(() => {
    if (isSubmitted) {
      add();
    }
  }, [isSubmitted])

  const renderFormComponent = () => {
    return defiForm.map((formComp, index) => {
      if (formComp.type === 'Text') {
        return <TextForm
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
      }
      else if (formComp.type === 'Switch') {
        return <SwitchForm
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
      }
      else {
        return null;
      }
    })
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'green' }}>
      <ActivityIndicator style={styles.loadingStyle} size="large" color="green" animating={defiState.creating} />
      <View style={styles.containerStyle} >
        <View style={styles.coordStyle}>
          <MaterialIcons color='green' size={30} name='location-pin' />
          <Text style={styles.inputStyle}>{state.latitude.toFixed(4)}, {state.longitude.toFixed(4)}</Text>
        </View>
        <ScrollView
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          <KeyboardAvoidingView
            // padding is for ios best, for android it is not the best solution, 
            // but the best available in this context
            behavior={Platform.OS === "ios" ? "padding" : "padding"}
            enabled
          >
            {renderFormComponent()}
          </KeyboardAvoidingView>
        </ScrollView>
        <View style={styles.bottomBar}>
          <TouchableOpacity
            disabled={defiState.creating}
            color='white'
            title='Erstellen'
            onPress={handleSubmit(onSubmit)} >
            <Text style={styles.buttonTextStyle}>Erstellen</Text>
          </TouchableOpacity>
          <TouchableOpacity
            disabled={defiState.creating}
            color='white'
            title='Abbrechen'
            onPress={() => navigation.navigate('Main')} >
            <Text style={styles.buttonTextStyle}>Abbrechen</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  containerStyle: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'white',
  },
  coordStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 15,
    paddingVertical: 10,
    borderBottomWidth: 0.3,
    borderColor: 'rgba(200, 200, 200, 1)'
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
    height: 55,
    backgroundColor: 'green'
  },
  loadingStyle: {
    position: 'absolute',
    marginTop: 200,
    alignSelf: 'center',
    zIndex: 200,
  }
});

export default CreateScreen;