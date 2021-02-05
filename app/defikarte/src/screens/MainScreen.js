import React, { useRef, useContext, useEffect, useState } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather, MaterialIcons } from '@expo/vector-icons';
import { Context as DefibrillatorContext } from '../context/DefibrillatorContext';
import { Context as LocationContext } from '../context/LocationContext';
import useDefibrillators from '../hooks/useDefibrillators';
import useLocation from '../hooks/useLocation';
import Map from '../components/Map';
import LocationError from '../components/LocationError';

const MainScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const { state: { defibrillators, loading }, getDefibrillators, setDefisNearLocation } = useContext(DefibrillatorContext);
  const { state: userLocation, updateLocation, enableLocationTracking, setLocationTracker } = useContext(LocationContext);
  useDefibrillators(defibrillators, getDefibrillators, setDefisNearLocation, userLocation);
  const [locationErr, resetErr] = useLocation(userLocation, updateLocation, enableLocationTracking, setLocationTracker);
  const mapRef = useRef(null);
  const [isCreateMode, setIsCreateMode] = useState(false);

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

  useEffect(() => {
    enableLocationTracking(true);
  }, []);

  const locationIcon = !userLocation.enabled ? 'location-disabled' : !userLocation.location ? 'location-searching' : 'my-location';

  let bottomBar = { ...styles.bottomBar };
  bottomBar.paddingBottom = insets.bottom * 0.5;
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
        defibrillators={defibrillators}
        defibrillatorsLoading={loading}
        isCreateMode={isCreateMode}
        setIsCreateMode={setIsCreateMode}
      />
      <View style={bottomBar}>
        <TouchableOpacity onPress={() => navigation.navigate('List')}>
          <Feather name='list' style={styles.iconStyle} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setIsCreateMode(true)}>
          <Feather name='plus-circle' style={styles.iconStyle} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('About')}>
          <Feather name='info' style={styles.iconStyle} />
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
    paddingHorizontal: '4%',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    bottom: 0,
    height: 55,
    backgroundColor: 'green'
  },
  iconStyle: {
    alignSelf: 'center',
    fontSize: 32,
    color: 'white'
  }
});

export default MainScreen;