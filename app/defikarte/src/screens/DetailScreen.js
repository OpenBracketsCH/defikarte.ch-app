import React, { useRef, useContext, useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { Feather, MaterialIcons } from '@expo/vector-icons';
import MapView from 'react-native-maps';
import openMap from 'react-native-open-maps';
import DefiMarker from '../components/DefiMarker';
import AttributeListing from '../components/AttributeListing';

const DetailScreen = ({ navigation }) => {
  const defibrillator = navigation.getParam('defibrillator');

  const initCoords = {
    latitude: defibrillator.lat,
    longitude: defibrillator.lon,
    latitudeDelta: 0.001,
    longitudeDelta: 0.001
  };

  const name = defibrillator.tags['defibrillator:location'] ?? defibrillator.tags.description ?? defibrillator.tags.operator ?? 'n/A';
  const emergencyPhone = '144';
  return (
    <View style={styles.containerStyle} >
      <View style={{ height: '25%' }}>
        <MapView
          style={styles.mapStyle}
          initialRegion={initCoords}
          scrollEnabled={false}
          rotateEnabled={false}
          zoomEnabled={false}
          onPress={() => { navigation.navigate('Main', { latlng: { latitude: defibrillator.lat, longitude: defibrillator.lon } }) }}
        >
          <DefiMarker
            defibrillator={defibrillator}
          />
        </MapView>
      </View>
      <View style={styles.innerContainerStyle}>
        <Text style={styles.titleStyle}>{name}</Text>
        <View style={styles.buttonContainerStyle}>
          <TouchableOpacity
            style={styles.buttonStyle}
            onPress={() => openMap({ latitude: defibrillator.lat, longitude: defibrillator.lon, end: `${defibrillator.lat}, ${defibrillator.lon}`, query: name, travelType: 'walk' })}
          >
            <Feather style={styles.navigationIconStyle} name='navigation' />
            <Text style={styles.buttonTextStyle}>Navigieren</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.buttonStyle}
            onPress={() => { }}
          >
            <Feather style={styles.navigationIconStyle} name='phone-call' />
            <Text style={styles.buttonTextStyle}>Notruf ({emergencyPhone})</Text>
          </TouchableOpacity>
        </View>
      </View>
      <ScrollView >
        <AttributeListing title="Standort" iconName="map-pin" value={defibrillator.tags['defibrillator:location']} />
        <AttributeListing title="Beschreibung" iconName="list" value={defibrillator.tags.description} />
        <AttributeListing title="Öffnungszeiten" iconName="clock" value={defibrillator.tags.opening_hours} />
        <AttributeListing title="Betreiber" iconName="flag" value={defibrillator.tags.operator} />
        <AttributeListing title="Telefon" iconName="phone" value={defibrillator.tags.phone} />
        <AttributeListing title="Zugänglich" iconName="alert-circle" value={defibrillator.tags.access} />
        <AttributeListing title="Im Gebäude" iconName="home" value={defibrillator.tags.indoor} />
      </ScrollView>
    </View >
  );
};

const styles = StyleSheet.create({
  containerStyle: {
    ...StyleSheet.absoluteFillObject,
    flex: 1,
  },
  titleStyle: {
    fontSize: 18,
    textAlign: 'center',
    fontWeight: '500',
    margin: 10,
  },
  innerContainerStyle: {
    margin: 5,
    padding: 10,
    alignItems: 'center',
  },
  mapStyle: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 50,
  },
  buttonStyle: {
    backgroundColor: 'green',
    borderRadius: 5,
    padding: 15,
    margin: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonTextStyle: {
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
  },
  buttonContainerStyle: {
    flexDirection: 'row',
  },
  navigationIconStyle: {
    fontSize: 18,
    marginRight: 10,
    color: 'white',
  }
});

export default DetailScreen;