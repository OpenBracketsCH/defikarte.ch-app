import React from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { Marker } from 'react-native-maps';

const SimpleMarker = ({ defibrillator, onMarkerSelected }) => {
  return (
    <Marker
      coordinate={{ latitude: defibrillator.lat, longitude: defibrillator.lon }}
      tracksViewChanges={false}
      onPress={() => onMarkerSelected(defibrillator.id)}
    >
      <View style={styles.simpleMarkerStyle}>
        <Image style={styles.simpleImageStyle} source={require('../../assets/marker.png')} />
      </View>
    </Marker>
  );
};

const styles = StyleSheet.create({
  simpleImageStyle: {
    width: 20,
    height: 20,
    margin: 4,
    alignSelf: 'center',
  },
  simpleMarkerStyle: {
    height: 30,
    width: 30,
    backgroundColor: 'rgba(0, 153, 57, 1)',
    borderRadius: 50,
  }
});

export default SimpleMarker;