import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const MapInfoPanel = ({ text, subText }) => {
  return (
    <View style={styles.panelContainerStyle}>
      <Text style={styles.textStyle}>
        {text}
      </Text>
      <Text style={styles.subTextStyle}>{subText}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  panelContainerStyle: {
    borderRadius: 10,
    zIndex: 100,
    marginTop: 30,
    marginHorizontal: 10,
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: 'rgba(254, 254, 254, .6)',
    borderWidth: 1,
    borderColor: 'rgba(200, 200, 200, 1)',
  },
  textStyle: {
    textAlign: 'center',
    fontSize: 20,
  },
  subTextStyle: {
    textAlign: 'center',
    marginTop: 5,
  },
});

export default MapInfoPanel;