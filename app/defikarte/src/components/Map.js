import React from 'react';
import { View, StyleSheet } from 'react-native';
import MapView from 'react-native-map-clustering';
import DefiMarker from './DefiMarker';

const Map = ({ initCoords, mapRef, defibrillators }) => {
  return (
    <View style={styles.containerStyle}>
      <MapView
        ref={mapRef}
        style={styles.mapStyle}
        initialRegion={initCoords}
      >
        {defibrillators.map((defibrillator) => {
          return (
            <DefiMarker
              key={defibrillator.id.toString()}
              defibrillator={defibrillator}
              coordinate={{ latitude: defibrillator.lat, longitude: defibrillator.lon }}
            />
          );
        }
        )}
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  containerStyle: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  mapStyle: {
    ...StyleSheet.absoluteFillObject,
  },
});

export default Map;