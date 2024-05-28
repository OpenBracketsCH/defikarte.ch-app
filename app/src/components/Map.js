import { t } from 'i18next';
import React, { useEffect, useState } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import MapView from 'react-native-map-clustering';
import { Marker, UrlTile } from 'react-native-maps';
import { currentDefisOnMap, isPointInRegion } from '../helpers/markersOnMap.js';
import CreateMapOverlay from './CreateMapOverlay';
import DefiMarker from './DefiMarker';
import DetailMapOverlay from './DetailMapOverlay';
import LocationButton from './LocationButton.js';
import MapInfoPanel from './MapInfoPanel';
import MapLayerButton from './MapLayersButton.js';
import OsmContributerOverlay from './OsmContributerOverlay.js';
import SimpleMarker from './SimpleMarker';

const Map = ({ initCoords, mapRef, defibrillators, defibrillatorsLoading, isCreateMode, setIsCreateMode }) => {
  const [region, setRegion] = useState(initCoords);
  const [newDefiCoords, setNewDefiCoords] = useState(initCoords);
  const [defisOnMap, setDefisOnMap] = useState([]);
  const [selectedDefibrillator, setSelectedDefibrillator] = useState(null);
  const [mode, setMode] = useState('');
  const [isTileOverlayActive, setIsTileOverlayActive] = useState(false);

  const animateToRegion = ({ latitude, longitude }) => {
    mapRef.current.animateToRegion({
      latitude,
      longitude,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    });
  };

  useEffect(() => {
    if (isCreateMode) {
      setNewDefiCoords({ latitude: region.latitude, longitude: region.longitude });
    }
  }, [isCreateMode]);

  useEffect(() => {
    let markerOutsideRegion = !isPointInRegion({ lat: newDefiCoords.latitude, lon: newDefiCoords.longitude }, region);
    if (isCreateMode && markerOutsideRegion) {
      setNewDefiCoords({ latitude: region.latitude, longitude: region.longitude });
    }
  }, [region, isCreateMode]);

  useEffect(() => {
    // debounce defis on map claculation for performance optimization
    const timerId = setTimeout(() => {
      setDefisOnMap(currentDefisOnMap(defibrillators, region));
    }, 500);

    return () => {
      if (timerId) {
        clearTimeout(timerId);
      }
    };
  }, [region, defibrillators]);

  useEffect(() => {
    const firstload = defibrillators.length === 0 && defibrillatorsLoading;
    const info = defisOnMap.length > 1000 && !isCreateMode;
    const top = firstload ? 'load' : info ? 'info' : isCreateMode ? 'create' : 'loc';
    setMode(top);
  }, [defisOnMap.length, defibrillators.length, defibrillatorsLoading, isCreateMode]);

  const renderMarkers = (createMode, defibrillators, latlon, setLatLng) => {
    if (createMode) {
      return <Marker draggable coordinate={latlon} onDragEnd={(e) => setLatLng(e.nativeEvent.coordinate)} />;
    } else {
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
        } else {
          return (
            <SimpleMarker
              key={defibrillator.id.toString()}
              defibrillator={defibrillator}
              coordinate={{ latitude: defibrillator.lat, longitude: defibrillator.lon }}
              onMarkerSelected={setSelectedDefibrillator}
            />
          );
        }
      });
    }
  };

  const renderOverlay = (mode) => {
    if (mode === 'create') {
      return <CreateMapOverlay isTopView={true} setIsCreateMode={setIsCreateMode} newDefiCoords={newDefiCoords} />;
    } else if (selectedDefibrillator != null) {
      return <DetailMapOverlay defibrillator={selectedDefibrillator} />;
    } else {
      return null;
    }
  };

  const renderInfoPanel = (defibrillators, mode) => {
    if (mode === 'info') {
      //defibrillators.length > 1000 && !isCreateMode
      return (
        <MapInfoPanel
          isTopView={true}
          text={t('zoom_in_to_see_defis')}
          subText={`(${t('current_aeds_on_map', { count: defibrillators.length })})`}
        />
      );
    } else if (mode === 'load') {
      //defibrillators.length === 0 && isLoading
      return <MapInfoPanel isTopView={true} text={t('load_aed')} showLoading={true} />;
    }
  };

  const onMapPress = (event) => {
    if (event.action !== null && event.action !== 'marker-press') {
      setSelectedDefibrillator(null);
    }
  };

  const tileOverlay = isTileOverlayActive ? (
    <UrlTile urlTemplate="https://tile.osm.ch/osm-swiss-style/{z}/{x}/{y}.png" maximumZ={19} flipY={false} />
  ) : null;

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
        showsMyLocationButton={false}
        mapType={Platform.OS == 'android' ? 'standard' : 'mutedStandard'}
        maxZoomLevel={19}
        maxZoom={17}
        moveOnMarkerPress={false}
        showsCompass={false}
      >
        {renderMarkers(isCreateMode, defisOnMap, newDefiCoords, setNewDefiCoords)}
        {tileOverlay}
      </MapView>
      <OsmContributerOverlay show={isTileOverlayActive} />
      {renderInfoPanel(defisOnMap, mode)}
      {renderOverlay(mode)}
      <LocationButton isTopView={mode === 'loc'} animateToRegion={animateToRegion} />
      <MapLayerButton setLayerActive={setIsTileOverlayActive} layerIsActive={isTileOverlayActive} />
    </View>
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
  },
});

export default Map;
