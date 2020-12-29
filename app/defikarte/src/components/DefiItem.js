import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import { withNavigation } from 'react-navigation';

const DefiItem = ({defibrillator, navigation}) => {
  return (
    <TouchableOpacity onPress={() => navigation.navigate('Main', { latlng: { latitude: defibrillator.lat, longitude: defibrillator.lon }})}>
      <View style={styles.containerStyle}>
        <Text style={styles.titleStyle}>{defibrillator.tags['defibrillator:location'] ?? 'n/A'}</Text>
        <Text>{defibrillator.lat}, {defibrillator.lon} / {defibrillator.tags['emergency:phone']}</Text>
      </View>
    </TouchableOpacity>    
  );
}

const styles = StyleSheet.create({
  titleStyle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  containerStyle: {
    padding: 5,
    borderColor: 'lightgrey',
    borderWidth: 0.3,
  }
});

export default withNavigation(DefiItem);