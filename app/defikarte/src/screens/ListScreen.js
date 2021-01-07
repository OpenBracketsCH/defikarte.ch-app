import React, { useEffect, useContext } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Feather, MaterialIcons } from '@expo/vector-icons';
import distanceBetweenPoints from '../helpers/coordinateCalc.js'
import useLocation from '../hooks/useLocation'
import useDefibrillators from '../hooks/useDefibrillators';
import DefiItem from '../components/DefiItem';

const ListScreen = ({ navigation }) => {
  const [defibrillators] = useDefibrillators(navigation);
  const [state, getUserLocation] = useLocation();

  const defisNearLocation = () => {
    return defibrillators
      .filter(d => {
        const dist = distanceBetweenPoints(d.lat, d.lon, state.location.latitude, state.location.longitude);
        if (dist < 2000) {
          d.distance = dist;
          return true;
        }

        return false;
      })
      .sort((d1, d2) => {
        return d1.distance - d2.distance;
      });
  };

  useEffect(() => {
    getUserLocation();
  }, []);

  const getContent = () => {
    const defiNearLocCount = state.location ? defisNearLocation().length : 0;
    if (defiNearLocCount > 0) {
      return (
        <FlatList
          data={defisNearLocation()}
          keyExtractor={(def) => def.id.toString()}
          renderItem={({ item }) => {
            return (
              <DefiItem defibrillator={item} />
            );
          }}
        />
      );
    }
    else if (defiNearLocCount <= 0 && state.location) {
      return (
        <Text style={styles.noLocationTextStyle}>Keine Defibrillatoren in deiner Nähe (2km) verfügbar .</Text>
      );
    }
    else {
      // ToDo: Probably change text, while searching
      const locationIcon = !state.enabled ? 'location-disabled' : !state.location ? 'location-searching' : 'my-location';

      return (
        <>
          <MaterialIcons style={styles.noLocationIconStyle} name='location-disabled' />
          <Text style={styles.noLocationTextStyle}>Aktiviere deinen Standort um Defibrillatoren in deiner Nähe anzuzeigen.</Text>
          <TouchableOpacity onPress={() => getUserLocation()}>
            <MaterialIcons style={styles.actLocationIconStyle} name={locationIcon} />
          </TouchableOpacity>
        </>
      )
    }
  }

  return (
    <View style={styles.containerStyle}>
      <Text style={styles.titleStyle}>Defibrillatoren in deiner Nähe</Text>
      {getContent()}
      <TouchableOpacity style={styles.buttonStyle} onPress={() => navigation.navigate('Main')}>
        <Feather name='map' style={styles.iconStyle} />
      </TouchableOpacity>
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
  containerStyle: {
    ...StyleSheet.absoluteFillObject,
  }
});

export default ListScreen;