import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons, Feather } from '@expo/vector-icons';
import { withNavigation } from 'react-navigation';
import openMap from 'react-native-open-maps';

const DefiItem = ({ defibrillator, navigation }) => {
  const phone = defibrillator.tags['emergency:phone'] ?? '144';
  let openingHoursText = defibrillator.tags.opening_hours ?? 'n/A';
  openingHoursText = openingHoursText.length > 31 ? openingHoursText.substring(0, 29) + '...' : openingHoursText;

  const name = defibrillator.tags['defibrillator:location'] ?? defibrillator.tags.description ?? defibrillator.tags.operator ?? 'n/A';
  const shortName = name.length > 28 ? name.substring(0, 27) + '...' : name;

  const locationText = defibrillator.distance ? `${defibrillator.distance}m / ${defibrillator.lat.toFixed(4)}, ${defibrillator.lon.toFixed(4)}` : `${defibrillator.lat.toFixed(4)}, ${defibrillator.lon.toFixed(4)}`;
  return (
    <TouchableOpacity onPress={() => navigation.navigate('Detail', { defibrillator })}>
      <View style={styles.outsideContainerStyle}>
        <View style={styles.containerStyle}>
          <Text style={styles.titleStyle}>{shortName}</Text>
          <View style={styles.inlineStyle}>
            <MaterialIcons style={styles.inlineIconStyle} name='my-location' />
            <Text style={styles.inlineTextStyle}>{locationText}</Text>
            <View style={styles.noWrapStyle}>
              <MaterialIcons style={styles.inlineIconStyle} name='phone' />
              <Text style={styles.inlineTextStyle}>{phone}</Text>
            </View>
          </View>
          <View style={styles.noWrapStyle}>
            <Feather style={styles.inlineIconStyle} name='clock' />
            <Text style={styles.openingHoursTextStyle}>{openingHoursText}</Text>
          </View>
        </View>
        <TouchableOpacity
          onPress={() => openMap({ latitude: defibrillator.lat, longitude: defibrillator.lon, end: `${defibrillator.lat}, ${defibrillator.lon}`, query: name, travelType: 'walk' })}>
          <Feather style={styles.navigationIconStyle} name='navigation' />
        </TouchableOpacity>
      </View>
    </TouchableOpacity >
  );
}

const styles = StyleSheet.create({
  titleStyle: {
    fontSize: 20,
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
    alignItems: 'center',
  },
  navigationIconStyle: {
    fontSize: 36,
    marginRight: 10,
    color: '#007AFF',
  }
});

export default withNavigation(DefiItem);