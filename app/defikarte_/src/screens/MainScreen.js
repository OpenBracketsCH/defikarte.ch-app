import React from 'react';
import {View, StyleSheet} from 'react-native';
import { Feather } from '@expo/vector-icons';
import Map from '../components/Map';

const MainScreen = () => {
  return (
    <View style={styles.containerStyle} >
      <Map />
      <View style={styles.bottomBar}>
        <Feather name='list' style={styles.iconStyle}/>
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