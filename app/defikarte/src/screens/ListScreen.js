import React from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Feather } from '@expo/vector-icons';
import DefiItem from '../components/DefiItem';
import defi from '../api/backendDefis';

const ListScreen = ({navigation}) => {
  return (
    <View style={styles.containerStyle}>
      <Text style={styles.titleStyle}>Defis near you</Text>
      <FlatList 
        data={defi().elements}
        keyExtractor={(def) => def.id.toString()}
        renderItem={({item}) => {
          return (
          <DefiItem defibrillator={item} />
          );
        }}
      />
      <TouchableOpacity style={styles.buttonStyle} onPress={() => navigation.navigate('Main')}>
        <Feather name='map' style={styles.iconStyle}/>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  titleStyle: {
    fontSize: 25,
    fontWeight: 'bold',
    marginTop: 20,
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
  containerStyle: {
    ...StyleSheet.absoluteFillObject,
  }
});

export default ListScreen;