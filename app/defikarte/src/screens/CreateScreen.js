import React, { useContext, useReducer } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { Context as DefibrillatorContext } from '../context/DefibrillatorContext';
import TextForm from '../components/TextForm';
import SwitchForm from '../components/SwitchForm';
import { useEffect } from 'react';

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
  const [state, dispatch] = useReducer(reducer, {});
  const defiForm = [
    {
      type: 'Text',
      label: 'Melder',
      value: state.reporter,
      setValue: (newValue) => dispatch({ type: 'reporter', payload: newValue })
    },
    {
      type: 'Text',
      label: 'Notrufnummer',
      value: state.emergencyPhone,
      setValue: (newValue) => dispatch({ type: 'emergencyPhone', payload: newValue })
    },
    {
      type: 'Text',
      label: 'Standort',
      value: state.location,
      setValue: (newValue) => dispatch({ type: 'location', payload: newValue })
    },
    {
      type: 'Text',
      label: 'Öffnungszeiten',
      value: state.openingHours,
      setValue: (newValue) => dispatch({ type: 'openingHours', payload: newValue })
    },
    {
      type: 'Text',
      label: 'Betreiber',
      value: state.operator,
      setValue: (newValue) => dispatch({ type: 'operator', payload: newValue })
    },
    {
      type: 'Text',
      label: 'Telefon',
      value: state.operatorPhone,
      setValue: (newValue) => dispatch({ type: 'operatorPhone', payload: newValue })
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
        return <TextForm key={index} labelText={formComp.label} value={formComp.value} setValue={formComp.setValue} />
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
      {renderFormComponent()}
      <Text style={styles.labelStyle}>Koordinaten: {state.latitude}, {state.longitude}</Text>
      <Button title='Erstellen' onPress={() => addDefibrillator(state, () => navigation.navigate('Main'))} />
    </View>
  );
};

const styles = StyleSheet.create({
  containerStyle: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'space-between',
    flex: 1,
    padding: 20,
  },
  titleStyle: {
    fontSize: 25,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 30,
    marginHorizontal: 10,
    marginBottom: 10,
    alignSelf: 'center',
  },
  labelStyle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  inputStyle: {
    borderColor: 'grey',
    borderWidth: 1,
    borderRadius: 5,
    fontSize: 18,
  }
});

export default CreateScreen;