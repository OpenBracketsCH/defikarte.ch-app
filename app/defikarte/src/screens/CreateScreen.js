import React, { useRef, useContext } from 'react';
import { View, Text, Button, TouchableOpacity, StyleSheet } from 'react-native';
import { Feather, MaterialIcons } from '@expo/vector-icons';
import { Context as DefibrillatorContext } from '../context/DefibrillatorContext';
import useDefibrillators from '../hooks/useDefibrillators';

const CreateScreen = ({ navigation }) => {
  const [state] = useDefibrillators(navigation);

  return (
    <View style={styles.containerStyle} >
      <Text style={styles.titleStyle}>Einen Defibrillator melden</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  containerStyle: {
    ...StyleSheet.absoluteFillObject,
    flex: 1,
  },
  titleStyle: {
    fontSize: 25,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 30,
    marginHorizontal: 10,
    marginBottom: 10,
    alignSelf: 'center',
  }
});

export default CreateScreen;