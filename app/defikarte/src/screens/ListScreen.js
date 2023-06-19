import React, { useEffect, useContext, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Context as LocationContext } from '../context/LocationContext';
import { Context as DefibrillatorContext } from '../context/DefibrillatorContext';
import { Context as InfoContext } from '../context/InfoContext';
import DefiItem from '../components/DefiItem';
import WarningInfoPanel from '../components/WarningInfoPanel';

const ListScreen = () => {
  const { state: userLocation, enableLocationTracking } = useContext(LocationContext);
  const { state: { defisNearLocation, loading } } = useContext(DefibrillatorContext);
  const { state: { showInfo }, updateShowInfo } = useContext(InfoContext);
  const [currentConfig, setCurrentConfig] = useState(defisNearLocation.length > 0 ? 'location' : 'loading');

  const locationConfig = {
    loading: {
      render: () => {
        return (
          <ActivityIndicator style={styles.spinnerStyle} size="large" color="green" />
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
        const infoPanel = showInfo ?
          <WarningInfoPanel
            onButtonClick={updateShowInfo}
            text="Achtung: Nicht alle Defibrillatoren in der Schweiz sind erfasst, möglicherweise gibt es Defibrillatoren die näher sind als die hier angezeigten." />
          : null;
        return (
          <>
            <FlatList
              data={defisNearLocation}
              keyExtractor={(def) => def.id.toString()}
              renderItem={({ item }) => {
                return (
                  <View style={styles.itemBorderStyle} >
                    <DefiItem defibrillator={item} />
                  </View>
                );
              }}
            />
            {infoPanel}
          </>
        );
      }
    }
  }

  const getLocationState = () => {
    const defiNearLocCount = userLocation.location ? defisNearLocation.length : 0;
    return !userLocation.enabled ? 'locationDisabled' : loading ? 'loading' : !userLocation.location || defiNearLocCount < 1 ? 'noDefisNearYou' : 'location';
  };

  useEffect(() => {
    setCurrentConfig(getLocationState());
  }, [userLocation, defisNearLocation]);

  useEffect(() => {
    enableLocationTracking(true);
  }, []);

  return (
    <View style={styles.containerStyle}>
      <>{locationConfig[currentConfig].render()}</>
    </View>
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
  itemBorderStyle: {
    borderColor: 'grey',
    borderBottomWidth: 0.5,
  },
  spinnerStyle: {
    alignSelf: 'center',
    margin: 200,
  },
  containerStyle: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'white'
  }
});

export default ListScreen;