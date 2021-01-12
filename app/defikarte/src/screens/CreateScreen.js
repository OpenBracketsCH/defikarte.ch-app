import React, { useContext, useReducer } from 'react';
import { View, Text, Button, KeyboardAvoidingView, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Context as DefibrillatorContext } from '../context/DefibrillatorContext';
import TextForm from '../components/TextForm';
import SwitchForm from '../components/SwitchForm';
import { useEffect } from 'react';
import { ScrollView } from 'react-native-gesture-handler';

const reducer = (state, action) => {
  switch (action.type) {
    case 'reporter':
      return { ...state, reporter: action.payload };
    case 'emergencyPhone':
      return { ...state, emergencyPhone: action.payload };
    case 'location':
      return { ...state, location: action.payload };
    case 'openingHours':
      return { ...state, openingHours: action.payload };
    case 'operatorPhone':
      return { ...state, operatorPhone: action.payload };
    case 'operator':
      return { ...state, operator: action.payload };
    case 'access':
      return { ...state, access: action.payload };
    case 'indoor':
      return { ...state, indoor: action.payload };
    case 'latitude':
      return { ...state, latitude: action.payload };
    case 'longitude':
      return { ...state, longitude: action.payload };
    default:
      return state;
  }
};

const CreateScreen = ({ navigation }) => {
  const { addDefibrillator } = useContext(DefibrillatorContext);
  const [state, dispatch] = useReducer(reducer, { latitude: 0, longitude: 0 });

  const defiForm = [
    {
      type: 'Text',
      label: 'Melder',
      value: state.reporter,
      setValue: (newValue) => dispatch({ type: 'reporter', payload: newValue }),
      placeholder: 'Max Mustermann'
    },
    {
      type: 'Text',
      label: 'Notrufnummer',
      value: state.emergencyPhone,
      setValue: (newValue) => dispatch({ type: 'emergencyPhone', payload: newValue }),
      defaultValue: '144',
      useSwitch: 'true',
      placeholder: '117',
      keyboardType: 'phone-pad'
    },
    {
      type: 'Text',
      label: 'Standort',
      value: state.location,
      setValue: (newValue) => dispatch({ type: 'location', payload: newValue }),
      placeholder: 'Schulhaus Zürich West, neben Eingang'
    },
    {
      type: 'Text',
      label: 'Öffnungszeiten',
      value: state.openingHours,
      setValue: (newValue) => dispatch({ type: 'openingHours', payload: newValue }),
      placeholder: 'Mo-Fr: 08:00-17:00',
      defaultValue: '24/7',
      useSwitch: true,
      multiline: true,
    },
    {
      type: 'Text',
      label: 'Betreiber',
      value: state.operator,
      setValue: (newValue) => dispatch({ type: 'operator', payload: newValue }),
      placeholder: 'Schutz und Rettung Zürich'
    },
    {
      type: 'Text',
      label: 'Telefon',
      value: state.operatorPhone,
      setValue: (newValue) => dispatch({ type: 'operatorPhone', payload: newValue }),
      placeholder: '+41 79 000 00 00',
      keyboardType: 'phone-pad'
    },
    {
      type: 'Switch',
      label: 'Zugänglich',
      value: state.access,
      setValue: (newValue) => dispatch({ type: 'access', payload: newValue })
    },
    {
      type: 'Switch',
      label: 'Im Gebäude',
      value: state.indoor,
      setValue: (newValue) => dispatch({ type: 'indoor', payload: newValue })
    },
  ]

  useEffect(() => {
    const latlon = navigation.getParam('latlon');
    if (latlon) {
      dispatch({ type: 'latitude', payload: latlon.latitude });
      dispatch({ type: 'longitude', payload: latlon.longitude });
    }
  }, [])


  const renderFormComponent = () => {
    return defiForm.map((formComp, index) => {
      if (formComp.type === 'Text') {
        return <TextForm
          key={index}
          labelText={formComp.label}
          value={formComp.value}
          setValue={formComp.setValue}
          defaultValue={formComp.defaultValue}
          keyboardType={formComp.keyboardType}
          multiline={formComp.multiline}
          useSwitch={formComp.useSwitch}
          placeholder={formComp.placeholder}
        />
      }
      else if (formComp.type === 'Switch') {
        return <SwitchForm key={index} labelText={formComp.label} value={formComp.value} setValue={formComp.setValue} />
      }
      else {
        return null;
      }
    })
  }

  return (
    <View style={styles.containerStyle} >
      <Text style={styles.titleStyle}>Einen Defibrillator melden</Text>
      <View style={styles.coordStyle}>
        <MaterialIcons color='green' size='30' name='location-pin' />
        <Text style={styles.inputStyle}>{state.latitude.toFixed(4)}, {state.longitude.toFixed(4)}</Text>
      </View>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>
        <KeyboardAvoidingView enabled behavior='position'>
          {renderFormComponent()}
        </KeyboardAvoidingView>
      </ScrollView>
      <View style={styles.bottomBar}>
        <Button
          color='white'
          title='Erstellen'
          onPress={() => addDefibrillator(state, () => navigation.navigate('Main'))} />
        <Button
          color='white'
          title='Abbrechen'
          onPress={() => navigation.navigate('Main')} />
      </View>

    </View>
  );
};

const styles = StyleSheet.create({
  containerStyle: {
    ...StyleSheet.absoluteFillObject,
  },
  titleStyle: {
    fontSize: 25,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 30,
    marginHorizontal: 10,
    marginBottom: 20,
    alignSelf: 'center',
  },
  labelStyle: {
    fontSize: 18,
    fontWeight: 'bold',
    width: 140,
  },
  coordStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 15,
    paddingBottom: 10,
    borderBottomWidth: 0.3,
    borderColor: 'rgba(200, 200, 200, 1)'
  },
  inputStyle: {
    fontSize: 18,
    paddingHorizontal: 5,
  },
  buttonContainerStyle: {
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    borderTopWidth: 0.3,
    borderColor: 'rgba(200, 200, 200, 1)',
    backgroundColor: 'green'
  },
  bottomBar: {
    justifyContent: 'space-around',
    flexDirection: 'row',
    alignItems: 'center',
    height: 50,
    backgroundColor: 'green'
  },
});

export default CreateScreen;