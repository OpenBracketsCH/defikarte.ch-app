import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import MapView, {Marker} from 'react-native-maps';
import defis from '../api/backendDefis';

const Map = () => {
  return (
    <View style={styles.containerStyle}>
      <MapView 
        style={styles.mapStyle}
        initialRegion={{
          latitude: 37.78825,
          longitude: -122.4324,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        >
        {defis().map((defi, index) => {
          return (          
            <Marker
              key={index}
              coordinate={defi.latlng}
              title={defi.title}
              description={defi.description}
            />
          );}
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