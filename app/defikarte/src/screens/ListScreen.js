import React, { useEffect, useContext, useState } from 'react';
import { View, SafeAreaView, Text, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Feather, MaterialIcons } from '@expo/vector-icons';
import { Context as LocationContext } from '../context/LocationContext';
import { Context as DefibrillatorContext } from '../context/DefibrillatorContext';
import DefiItem from '../components/DefiItem';

const ListScreen = ({ navigation }) => {
  const { state: userLocation, enableLocationTracking } = useContext(LocationContext);
  const { state: { defisNearLocation } } = useContext(DefibrillatorContext);
  const [currentConfig, setCurrentConfig] = useState(defisNearLocation.length > 0 ? 'location' : 'loading');

  const locationConfig = {
    loading: {
      render: () => {
        return (
          <ActivityIndicator style={styles.spinnerStyle} size="large" />
        );
      }
    },
    locationDisabled: {
      render: () => {
        const locationIcon = !userLocation.enabled ? 'location-disabled' : !userLocation.location ? 'location-searching' : 'my-location';
        return (
          <>
            <MaterialIcons style={styles.noLocationIconStyle} name='location-disabled' />
            <Text style={styles.noLocationTextStyle}>Aktiviere deinen Standort um Defibrillatoren in deiner Nähe anzuzeigen.</Text>
            <TouchableOpacity onPress={() => enableLocationTracking(true)}>
              <MaterialIcons style={styles.actLocationIconStyle} name={locationIcon} />
            </TouchableOpacity>
          </>
        );
      }
    },
    noDefisNearYou: {
      render: () => {
        return (
          <Text style={styles.noLocationTextStyle}>Keine Defibrillatoren in deiner Nähe (2km) verfügbar.</Text>
        );
      }
    },
    location: {
      render: () => {
        return (
          <FlatList
            data={defisNearLocation}
            keyExtractor={(def) => def.id.toString()}
            renderItem={({ item }) => {
              return (
                <DefiItem defibrillator={item} />
              );
            }}
          />
        );
      }
    }
  }

  const getLocationState = () => {
    const defiNearLocCount = userLocation.location ? defisNearLocation.length : 0;
    return !userLocation.enabled ? 'locationDisabled' : !userLocation.location || defiNearLocCount < 1 ? 'noDefisNearYou' : 'location';
  };

  useEffect(() => {
    setCurrentConfig(getLocationState());
  }, [userLocation, defisNearLocation]);

  useEffect(() => {
    enableLocationTracking(true);
  }, []);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.containerStyle}>
        <Text style={styles.titleStyle}>Defibrillatoren in deiner Nähe</Text>
        <>{locationConfig[currentConfig].render()}</>
        <TouchableOpacity style={styles.buttonStyle} onPress={() => navigation.navigate('Main')}>
          <Feather name='map' style={styles.iconStyle} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  titleStyle: {
    fontSize: 25,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 30,
    marginHorizontal: 10,
    marginBottom: 10,
    alignSelf: 'center',
  },
  textStyle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  buttonStyle: {
    backgroundColor: 'green',
    padding: 5,
    bottom: 0,
    position: 'absolute',
    alignSelf: 'baseline',
    borderRadius: 5,
    margin: 5,
  },
  iconStyle: {
    alignSelf: 'center',
    fontSize: 30,
    color: 'white'
  },
  noLocationIconStyle: {
    alignSelf: 'center',
    margin: 50,
    color: 'grey',
    fontSize: 100,
  },
  noLocationTextStyle: {
    margin: 20,
    fontSize: 20,
    textAlign: 'center',
  },
  actLocationIconStyle: {
    alignSelf: 'center',
    margin: 20,
    color: '#007AFF',
    fontSize: 50,
  },
  spinnerStyle: {
    alignSelf: 'center',
    margin: 200,
  },
  containerStyle: {
    ...StyleSheet.absoluteFillObject,
  }
});

export default ListScreen;