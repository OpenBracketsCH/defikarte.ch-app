import React, { useState, useRef, useContext } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Feather, MaterialIcons } from '@expo/vector-icons';
import useDefibrillators from '../hooks/useDefibrillators';
import useLocation from '../hooks/useLocation';
import Map from '../components/Map';

const MainScreen = ({ navigation }) => {
  const [state] = useDefibrillators(navigation);
  const [userLocation, getUserLocation] = useLocation();
  const mapRef = useRef(null);
  
  const animateToRegion = ({latitude, longitude}) => {
    mapRef.current.animateToRegion({
      latitude,
      longitude,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01
    });
  };

  const latlng = navigation.getParam('latlng');
  if (latlng) {
    animateToRegion(latlng);
  }

  const locationIcon = !userLocation.enabled ? 'location-disabled' : !userLocation.location ? 'location-searching' : 'my-location';
  return (
    <View style={styles.containerStyle} >
      <Map
        mapRef={mapRef}
        initCoords={{
          latitude: 47,
          longitude: 7.4,
          latitudeDelta: 1.5,
          longitudeDelta: 1.5,
        }}
        defibrillators={state}
      />
      <View style={styles.bottomBar}>
        <TouchableOpacity onPress={() => navigation.navigate('List')}>
          <Feather name='list' style={styles.iconStyle} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => {
          getUserLocation();
          if (userLocation.location){
            animateToRegion(userLocation.location);
          }
          }}>
          <MaterialIcons name={locationIcon} style={styles.iconStyle} />
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