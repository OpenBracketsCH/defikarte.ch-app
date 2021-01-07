import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { Marker, Callout } from 'react-native-maps';

const DefiMarker = ({ defibrillator }) => {
  const tags = defibrillator.tags;

  const dayNightStyle = tags.opening_hours === '24/7' ? styles.markerDayNightStyle : styles.markerDayStyle;

  return (
    <>
      <Marker
        anchor={{ x: 0.5, y: 1 }}
        centerOffset={{ x: 0, y: -35 }}
        coordinate={{ latitude: defibrillator.lat, longitude: defibrillator.lon }}
      >
        <View style={styles.markerOutsideStyle}>
          <View style={dayNightStyle}>
            <Image style={styles.imageStyle} source={require('../../assets/marker.png')} />
          </View>
        </View>
        <View style={styles.markerPointerStyle} />

        <Callout style={styles.calloutStyle}>
          <View >
            <Text>Verfügbarkeit: {tags.opening_hours}</Text>
            <Text>Ort: {tags['defibrillator:location']}</Text>
            <Text>Besonderes: {tags.description}</Text>
            <Text>Zugang: {tags.access}</Text>
            <Text>Nortrufnummer: {tags['emergency:phone']}</Text>
          </View>
        </Callout>
      </Marker>
    </>
  );
};

const styles = StyleSheet.create({
  imageStyle: {
    width: 38,
    height: 38,
    margin: 4,
    alignSelf: 'center',
  },
  markerOutsideStyle: {
    borderRadius: 15,
    borderColor: 'green',
    backgroundColor: '#009a3b',
    height: 54,
    width: 54,
    zIndex: 100,
  },
  markerPointerStyle: {
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: '#009a3b',
    borderLeftWidth: 12,
    borderRightWidth: 12,
    borderTopWidth: 20,
    borderStyle: 'solid',
    width: 0,
    height: 0,
    alignSelf: 'center',
    zIndex: 50,
  },
  markerDayStyle: {
    borderColor: 'orange',
    borderRadius: 15,
    borderWidth: 4,
  },
  markerDayNightStyle: {
    borderColor: '#009a3b',
    borderRadius: 15,
    borderWidth: 4,
  },
  calloutStyle: {
    width: 250,
  }
});

export default DefiMarker;