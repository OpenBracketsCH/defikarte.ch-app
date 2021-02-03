import React, { useState, useEffect, useContext } from 'react';
import { View, StyleSheet } from 'react-native';
import { Marker } from 'react-native-maps';
import MapView from 'react-native-map-clustering';
import currentDefisOnMap from '../helpers/markersOnMap.js'
import { Context as DefibrillatorContext } from '../context/DefibrillatorContext';
import DefiMarker from './DefiMarker';
import SimpleMarker from './SimpleMarker';
import CreateMapOverlay from './CreateMapOverlay';
import MapInfoPanel from './MapInfoPanel';
import DetailMapOverlay from './DetailMapOverlay';

const Map = ({ initCoords, mapRef, defibrillators, isCreateMode, setIsCreateMode }) => {
  const { state: { loading } } = useContext(DefibrillatorContext);
  const [region, setRegion] = useState(initCoords);
  const [newDefiCoords, setNewDefiCoords] = useState(initCoords);
  const [defisOnMap, setDefisOnMap] = useState([]);
  const [selectedDefibrillator, setSelectedDefibrillator] = useState(null);

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
      if (defibrillators.length >= 1000) {
        return null;
      }
      return defibrillators.map((defibrillator) => {
        if (selectedDefibrillator && selectedDefibrillator.id == defibrillator.id) {
          return (
            <DefiMarker
              key={defibrillator.id.toString()}
              defibrillator={defibrillator}
              coordinate={{ latitude: defibrillator.lat, longitude: defibrillator.lon }}
            />
          );
        }
        else {
          return (
            <SimpleMarker
              key={defibrillator.id.toString()}
              defibrillator={defibrillator}
              coordinate={{ latitude: defibrillator.lat, longitude: defibrillator.lon }}
              onMarkerSelected={setSelectedDefibrillator}
            />
          );
        }
      }
      );
    }
  };

  const renderOverlay = (isCreateMode, isLoading) => {
    if (isCreateMode) {
      return <CreateMapOverlay
        isTopView={!isLoading}
        setIsCreateMode={setIsCreateMode}
        newDefiCoords={newDefiCoords} />
    }
    else {
      return <DetailMapOverlay defibrillator={selectedDefibrillator} />
    }
  }

  const renderInfoPanel = (defibrillators, isCreateMode, isLoading) => {
    if (defibrillators.length > 1000 && !isCreateMode) {
      return (
        <MapInfoPanel
          isTopView={true}
          text='Zoome in eine bestimmte Region um Defibrillatoren anzuzeigen.'
          subText={`(${defibrillators.length} Defis im Kartenausschnitt, Anzeige ab < 1000)`} />
      );
    }
    else if (defibrillators.length === 0 && isLoading) {
      return (
        <MapInfoPanel
          isTopView={true}
          text="Lade Defibrillatoren..."
          showLoading={true}
        />
      );
    }
  }

  const onMapPress = event => {
    if (event.action !== null && event.action !== 'marker-press') {
      setSelectedDefibrillator(null);
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
      {renderInfoPanel(defisOnMap, isCreateMode, loading)}
      {renderOverlay(isCreateMode, loading)}
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