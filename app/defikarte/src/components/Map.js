import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import MapView, {Marker} from 'react-native-maps';
import DefiMarker from './DefiMarker';
import defis from '../api/backendDefis';

const Map = ({initCoords}) => { 
  return (
    <View style={styles.containerStyle}>
      <MapView 
        style={styles.mapStyle}
        region={{
          latitude: initCoords.latitude,
          longitude: initCoords.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        >
        {defis().elements.map((defi) => {        
          return (     
            <DefiMarker
              key={defi.id.toString()}
              defibrillator={defi}
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