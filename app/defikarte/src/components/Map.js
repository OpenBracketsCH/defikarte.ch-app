import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { Marker } from 'react-native-maps';
import MapView from 'react-native-map-clustering';
import DefiMarker from './DefiMarker';
import SimpleMarker from './SimpleMarker';
import CreateMapOverlay from './CreateMapOverlay';
import MapInfoPanel from './MapInfoPanel';

const Map = ({ initCoords, mapRef, defibrillators, isCreateMode, setIsCreateMode }) => {
  const [region, setRegion] = useState(initCoords);
  const [newDefiCoords, setNewDefiCoords] = useState(initCoords);
  const [defisOnMap, setDefisOnMap] = useState([]);
  const [selectedMarker, setSelectedMarker] = useState(null);

  // restricts which defis are displayed, if not the map will block the ui
  const currentDefisOnMap = (defibrillators, region) => {
    return defibrillators.filter(defibrillator => {
      const lat = defibrillator.lat;
      const lon = defibrillator.lon;

      const maxLat = region.latitude + region.latitudeDelta;
      const minLat = region.latitude - region.latitudeDelta;
      const maxLon = region.longitude + region.longitudeDelta;
      const minLon = region.longitude - region.longitudeDelta;

      return lat > minLat && lat < maxLat && lon > minLon && lon < maxLon;
    });
  };

  useEffect(() => {
    if (isCreateMode) {
      setNewDefiCoords({ latitude: region.latitude, longitude: region.longitude });
    }
  }, [isCreateMode]);

  useEffect(() => {
    // debounce defis on map claculation for performance optimization
    const timerId = setTimeout(() => {
      setDefisOnMap(currentDefisOnMap(defibrillators, region));
    }, 500);

    return () => {
      clearTimeout(timerId);
    }
  }, [region, defibrillators])

  const renderMarkers = (createMode, defibrillators, latlon, setLatLng) => {
    if (createMode) {
      return (
        <Marker draggable
          coordinate={latlon}
          onDragEnd={(e) => setLatLng(e.nativeEvent.coordinate)}
        />
      );
    }
    else {
      if (defibrillators.length > 1000) {
        return null;
      }
      return defibrillators.map((defibrillator) => {
        if (selectedMarker == defibrillator.id) {
          return (
            <DefiMarker
              key={defibrillator.id.toString()}
              defibrillator={defibrillator}
              coordinate={{ latitude: defibrillator.lat, longitude: defibrillator.lon }}
              onMarkerDeselect={setSelectedMarker}
            />
          );
        }
        else {
          return (
            <SimpleMarker
              key={defibrillator.id.toString()}
              defibrillator={defibrillator}
              coordinate={{ latitude: defibrillator.lat, longitude: defibrillator.lon }}
              onMarkerSelected={setSelectedMarker}
            />
          );
        }
      }
      );
    }
  };

  const renderInfoPanel = (defibrillators) => {
    if (defibrillators.length > 1000) {
      return (
        <MapInfoPanel
          text='Zoome in eine bestimmte Region um Defibrillatoren anzuzeigen.'
          subText={`(${defibrillators.length} Defis geladen, Anzeige ab < 1000)`} />
      );
    }
  }

  const onMapPress = event => {
    if (event.action !== null && event.action !== 'marker-press') {
      setSelectedMarker(null);
    }
  }

  return (
    <View style={styles.containerStyle}>
      <MapView
        ref={mapRef}
        style={styles.mapStyle}
        initialRegion={initCoords}
        showsUserLocation
        followsUserLocation={false}
        onRegionChangeComplete={setRegion}
        spiralEnabled={false}
        onPress={(e) => onMapPress(e.nativeEvent)}
      >
        {renderMarkers(isCreateMode, defisOnMap, newDefiCoords, setNewDefiCoords)}
      </MapView>
      <CreateMapOverlay
        createMode={isCreateMode}
        setIsCreateMode={setIsCreateMode}
        newDefiCoords={newDefiCoords} />
      {renderInfoPanel(defisOnMap)}
    </View >
  );
};

const styles = StyleSheet.create({
  containerStyle: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  mapStyle: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 50,
  }
});

export default Map;