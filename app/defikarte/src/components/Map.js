import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { withNavigation } from 'react-navigation';
import { Marker } from 'react-native-maps';
import MapView from 'react-native-map-clustering';
import { AntDesign } from '@expo/vector-icons';
import DefiMarker from './DefiMarker';

const Map = ({ initCoords, mapRef, defibrillators, isCreateMode, setIsCreateMode, navigation }) => {
  const [region, setRegion] = useState(initCoords);
  const [newDefiCoords, setNewDefiCoords] = useState(initCoords);

  useEffect(() => {
    if (isCreateMode) {
      setNewDefiCoords({ latitude: region.latitude, longitude: region.longitude });
    }
  }, [isCreateMode]);

  const renderMarkers = (createMode, defibrillators, latlon, setLatLng) => {
    if (createMode) {
      return (
        <Marker draggable
          coordinate={latlon}
          onDragEnd={(e) => setLatLng(e.nativeEvent.coordinate)}
        >
        </Marker>
      );
    }
    else {
      return defibrillators.map((defibrillator) => {
        return (
          <DefiMarker
            key={defibrillator.id.toString()}
            defibrillator={defibrillator}
            coordinate={{ latitude: defibrillator.lat, longitude: defibrillator.lon }}
          />
        );
      }
      );
    }
  };

  const renderCreateItems = (createMode) => {
    if (createMode) {
      return (
        <>
          <View style={styles.createTextContainerStyle}>
            <Text style={styles.createTextStyle}>
              Ziehe den Marker an den Standort des neuen Defibrillators
            </Text>
            <Text style={styles.createSubTextStyle}>(Marker halten und verschieben)</Text>
          </View>
          <View style={styles.createIconsContainerStyle}>
            <TouchableOpacity onPress={() => navigation.navigate('Create', { latlon: newDefiCoords })} >
              <AntDesign name="checkcircleo" size={48} color="green" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setIsCreateMode(false)} style={styles.createIconsStyle}>
              <AntDesign name="closecircleo" size={48} color="red" />
            </TouchableOpacity>
          </View>
        </>
      );
    }

    return null;
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
      >
        {renderMarkers(isCreateMode, defibrillators, newDefiCoords, setNewDefiCoords)}
      </MapView>
      {renderCreateItems(isCreateMode)}
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
  },
  createIconsContainerStyle: {
    flexDirection: 'row',
    height: 70,
    borderRadius: 10,
    zIndex: 100,
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: 'rgba(254, 254, 254, .6)',
    borderWidth: 1,
    borderColor: 'rgba(200, 200, 200, 1)',
    position: 'absolute',
    bottom: 20,
  },
  createTextContainerStyle: {
    borderRadius: 10,
    zIndex: 100,
    marginTop: 30,
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: 'rgba(254, 254, 254, .6)',
    borderWidth: 1,
    borderColor: 'rgba(200, 200, 200, 1)',
  },
  createTextStyle: {
    textAlign: 'center',
    fontSize: 20,
  },
  createSubTextStyle: {
    textAlign: 'center',
    marginTop: 5,
  },
  createIconsStyle: {
    paddingLeft: 20,
  }
});

export default withNavigation(Map);