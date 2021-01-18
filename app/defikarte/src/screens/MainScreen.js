import React, { useRef, useContext, useEffect, useState } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Feather, MaterialIcons } from '@expo/vector-icons';
import { Context as LocationContext } from '../context/LocationContext';
import useDefibrillators from '../hooks/useDefibrillators';
import useLocation from '../hooks/useLocation';
import Map from '../components/Map';
import LocationError from '../components/LocationError';

const MainScreen = ({ navigation }) => {
  const [state] = useDefibrillators(navigation);
  const { state: userLocation, updateLocation, enableLocationTracking, setLocationTracker } = useContext(LocationContext);
  const [locationErr, resetErr] = useLocation(userLocation, updateLocation, enableLocationTracking, setLocationTracker);
  const mapRef = useRef(null);
  const [isCreateMode, setIsCreateMode] = useState(false);

  const animateToRegion = ({ latitude, longitude }) => {
    mapRef.current.animateToRegion({
      latitude,
      longitude,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01
    });
  };

  useEffect(() => {
    const latlng = navigation.getParam('latlng');
    if (latlng) {
      animateToRegion(latlng);
    }
  }, [navigation]);

  useEffect(() => {
    if (locationErr) {
      LocationError({ title: "Standort Zugriff verweigert", message: "Um die Standortfunktion zu nutzen, aktiviere den Zugriff in den Einstellungen." });
      resetErr();
    }
  }, [locationErr]);

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
        isCreateMode={isCreateMode}
        setIsCreateMode={setIsCreateMode}
      />
      <View style={styles.bottomBar}>
        <TouchableOpacity onPress={() => navigation.navigate('List')}>
          <Feather name='list' style={styles.iconStyle} />
        </TouchableOpacity>
        <TouchableOpacity onPress={async () => {
          enableLocationTracking(true)
          if (userLocation.location) {
            animateToRegion(userLocation.location);
          }
        }}>
          <MaterialIcons name={locationIcon} style={styles.iconStyle} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setIsCreateMode(true)}>
          <Feather name='plus-circle' style={styles.iconStyle} />
        </TouchableOpacity>
      </View>
    </View >
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