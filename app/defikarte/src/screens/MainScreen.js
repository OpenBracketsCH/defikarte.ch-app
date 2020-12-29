import React from 'react';
import {View, TouchableOpacity, StyleSheet} from 'react-native';
import { Feather } from '@expo/vector-icons';
import Map from '../components/Map';

const MainScreen = ({navigation}) => {
  const latlng = navigation.getParam('latlng');
  console.log(latlng)
  const coords = latlng ?? {latitude: 47, longitude: 7};
  return (
    <View style={styles.containerStyle} >
      <Map initCoords={coords}/>
      <View style={styles.bottomBar}>
        <TouchableOpacity onPress={() => navigation.navigate('List')}>
          <Feather name='list' style={styles.iconStyle}/>
        </TouchableOpacity>
        <Feather name='heart' style={styles.iconStyle}/>
        <Feather name='plus-circle' style={styles.iconStyle}/>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  containerStyle: {
    ...StyleSheet.absoluteFillObject,
    flex: 1,
  },
  titleStyle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  bottomBar: {
    padding: 10,
    justifyContent: 'space-between',
    flexDirection: 'row',
    bottom: 0,
    height: 50,
    backgroundColor: 'green'
  },
  iconStyle: {
    alignSelf: 'center',
    fontSize: 30,
    color: 'white'
  }
});

export default MainScreen;