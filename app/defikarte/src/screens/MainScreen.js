import React, { useState, useRef, useContext, useEffect } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import useDefibrillators from '../hooks/useDefibrillators';
import Map from '../components/Map';

const MainScreen = ({ navigation }) => {
  const [state] = useDefibrillators(navigation);
  const mapRef = useRef(null);
  const [centerCoords, setCenterCoords] = useState({
    latitude: 47,
    longitude: 7.4,
    latitudeDelta: 1.5,
    longitudeDelta: 1.5,
  });

  const latlng = navigation.getParam('latlng');
  if (latlng && (latlng.latitude !== centerCoords.latitude || latlng.longitude !== centerCoords.longitude)) {
    mapRef.current.animateToRegion({
      ...latlng,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01
    });
  }

  return (
    <View style={styles.containerStyle} >
      <Map
        mapRef={mapRef}
        initCoords={centerCoords}
        defibrillators={state}
      />
      <View style={styles.bottomBar}>
        <TouchableOpacity onPress={() => navigation.navigate('List')}>
          <Feather name='list' style={styles.iconStyle} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => console.log('location')}>
          <Feather name='heart' style={styles.iconStyle} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => console.log('add defi')}>
          <Feather name='plus-circle' style={styles.iconStyle} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  containerStyle: {
    ...StyleSheet.absoluteFillObject,
    flex: 1,
  },
  titleStyle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  bottomBar: {
    padding: 10,
    justifyContent: 'space-between',
    flexDirection: 'row',
    bottom: 0,
    height: 50,
    backgroundColor: 'green'
  },
  iconStyle: {
    alignSelf: 'center',
    fontSize: 30,
    color: 'white'
  }
});

export default MainScreen;