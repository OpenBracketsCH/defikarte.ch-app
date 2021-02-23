import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Linking, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import MapView, { UrlTile } from 'react-native-maps';
import openMap from 'react-native-open-maps';
import DefiMarker from '../components/DefiMarker';
import AttributeListing from '../components/AttributeListing';
import OsmContributerOverlay from '../components/OsmContributerOverlay';

const DetailScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const defibrillator = navigation.getParam('defibrillator');

  const initCoords = {
    latitude: defibrillator.lat,
    longitude: defibrillator.lon,
    latitudeDelta: 0.001,
    longitudeDelta: 0.001
  };

  makeCall = (phoneNumber) => {
    if (Platform.OS === 'ios') {
      phoneNumber = `telprompt:${phoneNumber}`;
    } else {
      phoneNumber = `tel:${phoneNumber}`;
    }

    Linking.openURL(phoneNumber);
  };

  const name = defibrillator.tags['defibrillator:location'] ?? defibrillator.tags.description ?? defibrillator.tags.operator ?? 'n/A';
  const emergencyPhone = defibrillator.tags['emergency:phone'] ?? '144';
  const newInfo = defibrillator.new ? <Text>(Temporär in App erfasst, OSM update ausstehend)</Text> : null;

  let containerStyle = { ...styles.containerStyle };
  containerStyle.paddingBottom = insets.bottom * 0.5;
  return (
    <View style={containerStyle} >
      <View style={{ height: '30%' }}>
        <MapView
          style={styles.mapStyle}
          initialRegion={initCoords}
          scrollEnabled={false}
          rotateEnabled={false}
          zoomEnabled={false}
          onPress={() => { navigation.navigate('Main', { latlng: { latitude: defibrillator.lat, longitude: defibrillator.lon } }) }}
        >
          <UrlTile
            urlTemplate='http://c.tile.openstreetmap.org/{z}/{x}/{y}.png'
            maximumZ={19}
            flipY={false}
          />
          <DefiMarker
            defibrillator={defibrillator}
          />
        </MapView>
        <OsmContributerOverlay show={true} />
      </View>
      <View style={styles.innerContainerStyle}>
        <Text style={styles.titleStyle}>{name}</Text>
        {newInfo}
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
            onPress={() => { makeCall(emergencyPhone) }}
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
    backgroundColor: 'white',
    flex: 1
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