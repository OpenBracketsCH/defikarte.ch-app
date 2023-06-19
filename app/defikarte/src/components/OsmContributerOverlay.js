import React from 'react';
import { View, Text, StyleSheet, Linking } from 'react-native';

const OsmContributerOverlay = ({ show }) => {
  if (show) {
    return (
      <View style={styles.overlayContainerStyle}>
        <Text style={styles.textStyle}>© <Text style={styles.linkStyle} onPress={() => Linking.openURL('https://www.openstreetmap.org/copyright')}>OpenStreetMap</Text> contributors</Text>
      </View>
    );
  }
  return null;
};

const styles = StyleSheet.create({
  overlayContainerStyle: {
    alignSelf: 'flex-end',
    bottom: 0,
    position: 'absolute',
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    zIndex: 100,
    right: 42,
    bottom: 6,
    paddingHorizontal: 4,
    paddingVertical: 3,
    borderRadius: 4,
  },
  textStyle: {
    fontSize: 9,
    color: 'rgb(30, 30, 30)'
  },
  linkStyle: {
    alignSelf: 'center',
    color: 'blue',
    textDecorationLine: 'underline',
  },
});

export default OsmContributerOverlay;