import { Feather } from '@expo/vector-icons';
import { t } from 'i18next';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { AppState, Platform, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import LocationError from '../components/LocationError';
import Map from '../components/Map';
import { Context as DefibrillatorContext } from '../context/DefibrillatorContext';
import { Context as LocationContext } from '../context/LocationContext';
import useDefibrillators from '../hooks/useDefibrillators';
import useLocation from '../hooks/useLocation';

const MainScreen = ({ navigation }) => {
  const appState = useRef(AppState.currentState);
  const [appStateVisible, setAppStateVisible] = useState(appState.current);
  const insets = useSafeAreaInsets();
  const {
    state: { defibrillators, loading },
    getDefibrillators,
    setDefisNearLocation,
  } = useContext(DefibrillatorContext);
  const { state: userLocation, updateLocation, enableLocationTracking, setLocationTracker, setInitZoom } = useContext(LocationContext);
  useDefibrillators(defibrillators, getDefibrillators, setDefisNearLocation, userLocation);
  const [locationErr, resetErr] = useLocation(userLocation, updateLocation, enableLocationTracking, setLocationTracker);
  const mapRef = useRef(null);
  const [isCreateMode, setIsCreateMode] = useState(false);

  const animateToRegion = ({ latitude, longitude }) => {
    mapRef.current.animateToRegion({
      latitude,
      longitude,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    });
  };

  useEffect(() => {
    if (userLocation && !userLocation.initZoom && userLocation.location && userLocation.enabled) {
      animateToRegion({ latitude: userLocation.location.latitude, longitude: userLocation.location.longitude });
      setInitZoom(true);
    }
  }, [userLocation]);

  useEffect(() => {
    const latlng = navigation.getParam('latlng');
    if (latlng) {
      animateToRegion(latlng);
    }
  }, [navigation]);

  useEffect(() => {
    if (locationErr) {
      LocationError({
        title: t('location_access_denied'),
        message: t('location_access_denied_message'),
      });
      resetErr();
    }
  }, [locationErr]);

  useEffect(() => {
    if (Platform.OS === 'android') {
      AppState.addEventListener('focus', _handleAppStateFocus);
    } else if (Platform.OS === 'ios') {
      AppState.addEventListener('change', _handleAppStateChange);
    }

    return () => {
      AppState.removeEventListener('focus', _handleAppStateFocus);
      AppState.removeEventListener('change', _handleAppStateChange);
    };
  }, []);

  useEffect(() => {
    if (appStateVisible === 'active') {
      enableLocationTracking(true);
    } else {
      enableLocationTracking(false);
    }
  }, [appStateVisible]);

  const _handleAppStateChange = (nextAppState) => {
    appState.current = nextAppState;
    setAppStateVisible(appState.current);
  };

  const _handleAppStateFocus = () => {
    setAppStateVisible('active');
  };

  let bottomBar = { ...styles.bottomBar };
  bottomBar.paddingBottom = insets.bottom * 0.5;
  return (
    <View style={styles.containerStyle}>
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
          <Feather name="list" style={styles.iconStyle} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setIsCreateMode(true)}>
          <Feather name="plus-circle" style={styles.iconStyle} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('About')}>
          <Feather name="info" style={styles.iconStyle} />
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
    paddingHorizontal: '4%',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    bottom: 0,
    height: 70,
    backgroundColor: 'green',
  },
  iconStyle: {
    alignSelf: 'center',
    fontSize: 32,
    color: 'white',
  },
});

export default MainScreen;
