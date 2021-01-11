import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons, Feather } from '@expo/vector-icons';
import { withNavigation } from 'react-navigation';
import openMap from 'react-native-open-maps';

const DefiItem = ({ defibrillator, navigation }) => {
  const latlng = { latitude: defibrillator.lat, longitude: defibrillator.lon };
  const openingHours = () => {
    if (defibrillator.tags.opening_hours) {
      return (
        <View style={styles.noWrapStyle}>
          <Feather style={styles.inlineIconStyle} name='clock' />
          <Text style={styles.openingHoursTextStyle}>{defibrillator.tags.opening_hours}</Text>
        </View>
      );
    }
    return null;
  };

  const phone = () => {
    if (defibrillator.tags['emergency:phone']) {
      return (
        <View style={styles.noWrapStyle}>
          <MaterialIcons style={styles.inlineIconStyle} name='phone' />
          <Text style={styles.inlineTextStyle}>{defibrillator.tags['emergency:phone']}</Text>
        </View>
      );
    }
    return null;
  };

  const name = defibrillator.tags['defibrillator:location'] ?? defibrillator.tags.description ?? defibrillator.tags.operator ?? 'n/A';
  return (
    <TouchableOpacity onPress={() => navigation.navigate('Main', { latlng })}>
      <View style={styles.outsideContainerStyle}>
        <View style={styles.containerStyle}>
          <Text style={styles.titleStyle}>{name}</Text>
          <View style={styles.inlineStyle}>
            <MaterialIcons style={styles.inlineIconStyle} name='my-location' />
            <Text style={styles.inlineTextStyle}>{defibrillator.distance}m
          / {defibrillator.lat.toFixed(4)}, {defibrillator.lon.toFixed(4)}
            </Text>
            {phone()}
            {openingHours()}
          </View>
        </View>
        <TouchableOpacity onPress={() => openMap({ latitude: defibrillator.lat, longitude: defibrillator.lon, query: name, travelType: 'walk' })}>
          <Feather style={styles.navigationIconStyle} name='navigation' />
        </TouchableOpacity>
      </View>
    </TouchableOpacity >
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
    flexWrap: 'wrap',
  },
  inlineTextStyle: {
    fontSize: 16,
  },
  noWrapStyle: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  openingHoursTextStyle: {
    flexWrap: 'wrap',
    fontSize: 16,
    flexShrink: 1,
  },
  containerStyle: {
    padding: 5,
    width: 300,
  },
  outsideContainerStyle: {
    flexDirection: 'row',
    borderColor: 'lightgrey',
    borderWidth: 0.3,
    alignItems: 'center'
  },
  navigationIconStyle: {
    fontSize: 48,
    marginRight: 20,
    color: '#007AFF',
  }
});

export default withNavigation(DefiItem);