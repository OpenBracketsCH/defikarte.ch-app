import { Feather } from '@expo/vector-icons';
import { t } from 'i18next';
import React from 'react';
import { Linking, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import MapView, { UrlTile } from 'react-native-maps';
import openMap from 'react-native-open-maps';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AttributeListing from '../components/AttributeListing';
import DefiMarker from '../components/DefiMarker';
import OsmContributerOverlay from '../components/OsmContributerOverlay';

const DetailScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const defibrillator = navigation.getParam('defibrillator');

  const initCoords = {
    latitude: defibrillator.lat,
    longitude: defibrillator.lon,
    latitudeDelta: 0.001,
    longitudeDelta: 0.001,
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
  const newInfo = defibrillator.new ? <Text>({t('aed_only_temporary_in_app')})</Text> : null;

  let containerStyle = { ...styles.containerStyle };
  containerStyle.paddingBottom = insets.bottom * 0.5;
  return (
    <View style={containerStyle}>
      <View style={{ height: '30%' }}>
        <MapView
          style={styles.mapStyle}
          initialRegion={initCoords}
          scrollEnabled={false}
          rotateEnabled={false}
          zoomEnabled={false}
          onPress={() => {
            navigation.navigate('Main', { latlng: { latitude: defibrillator.lat, longitude: defibrillator.lon } });
          }}
        >
          <UrlTile urlTemplate="https://tile.osm.ch/osm-swiss-style/{z}/{x}/{y}.png" maximumZ={19} flipY={false} />
          <DefiMarker defibrillator={defibrillator} />
        </MapView>
        <OsmContributerOverlay show={true} />
      </View>
      <View style={styles.innerContainerStyle}>
        <Text style={styles.titleStyle}>{name}</Text>
        {newInfo}
        <View style={styles.buttonContainerStyle}>
          <TouchableOpacity
            style={styles.buttonStyle}
            onPress={() =>
              openMap({
                latitude: defibrillator.lat,
                longitude: defibrillator.lon,
                end: `${defibrillator.lat}, ${defibrillator.lon}`,
                query: name,
                travelType: 'walk',
              })
            }
          >
            <Feather style={styles.navigationIconStyle} name="navigation" />
            <Text style={styles.buttonTextStyle}>{t('directions')}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.buttonStyle}
            onPress={() => {
              makeCall(emergencyPhone);
            }}
          >
            <Feather style={styles.navigationIconStyle} name="phone-call" />
            <Text style={styles.buttonTextStyle}>{t('emergency_phone', { emergencyPhone })}</Text>
          </TouchableOpacity>
        </View>
      </View>
      <ScrollView>
        <AttributeListing title={t('location')} iconName="map-pin" value={defibrillator.tags['defibrillator:location']} />
        <AttributeListing title={t('level')} iconName="stairs" value={defibrillator.tags.level} />
        <AttributeListing title={t('description')} iconName="list" value={defibrillator.tags.description} />
        <AttributeListing title={t('openinghours')} iconName="clock" value={defibrillator.tags.opening_hours} />
        <AttributeListing title={t('operator')} iconName="flag" value={defibrillator.tags.operator} />
        <AttributeListing title={t('operatorphone')} iconName="phone" value={defibrillator.tags.phone} />
        <AttributeListing title={t('access')} iconName="alert-circle" value={defibrillator.tags.access} />
        <AttributeListing title={t('indoor')} iconName="home" value={defibrillator.tags.indoor} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  containerStyle: {
    backgroundColor: 'white',
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
  },
});

export default DetailScreen;
