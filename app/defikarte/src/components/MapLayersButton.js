import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const LocationButton = ({ setLayerActive, layerIsActive }) => {

  const layerIcon = layerIsActive ? 'ios-layers' : 'ios-layers-outline';

  return (
    <TouchableOpacity style={styles.layerButtonStyle} onPress={async () => {
      setLayerActive(!layerIsActive)
    }}>
      <Ionicons name={layerIcon} style={styles.iconStyle} />
      <Text style={styles.textStyle}>OSM</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  iconStyle: {
    top: 0,
    fontSize: 27,
    color: 'white',
  },
  layerButtonStyle: {
    zIndex: 100,
    alignSelf: 'flex-end',
    marginTop: 10,
    marginRight: 8,
    paddingTop: 7,
    paddingHorizontal: 7,
    borderRadius: 5,
    backgroundColor: 'rgba(40, 40, 40, 0.7)',
    shadowColor: 'black',
  },
  textStyle: {
    position: 'relative',
    alignSelf: 'center',
    bottom: 1,
    color: 'white',
    fontSize: 8,
    fontWeight: '400',
  }
});

export default LocationButton;