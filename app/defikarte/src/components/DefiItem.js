import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons, Feather } from '@expo/vector-icons';
import { withNavigation } from 'react-navigation';

const DefiItem = ({ defibrillator, navigation }) => {
  const latlng = { latitude: defibrillator.lat, longitude: defibrillator.lon };

  return (
    <TouchableOpacity onPress={() => navigation.navigate('Main', { latlng })}>
      <View style={styles.containerStyle}>
        <Text style={styles.titleStyle}>{defibrillator.tags['defibrillator:location'] ?? defibrillator.tags.description ?? defibrillator.tags.operator ?? 'n/A'}</Text>
        <View style={styles.inlineStyle}>
          <MaterialIcons style={styles.inlineIconStyle} name='my-location' />
          <Text style={styles.inlineTextStyle}>{defibrillator.distance}m
          / {defibrillator.lat.toFixed(4)}, {defibrillator.lon.toFixed(4)}
          </Text>
          <MaterialIcons style={styles.inlineIconStyle} name='phone' />
          <Text style={styles.inlineTextStyle}>{defibrillator.tags['emergency:phone']}</Text>
          <Feather style={styles.inlineIconStyle} name='clock' />
          <Text>{defibrillator.tags.opening_hours}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  titleStyle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 5,
  },
  inlineIconStyle: {
    fontSize: 20,
    margin: 5,
  },
  inlineStyle: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  inlineTextStyle: {
    fontSize: 16,
  },
  containerStyle: {
    padding: 5,
    borderColor: 'lightgrey',
    borderWidth: 0.3,
  }
});

export default withNavigation(DefiItem);