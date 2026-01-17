import React, { useState } from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { Marker } from 'react-native-maps';

const markerImage = require('../../assets/marker.png');

const DefiMarker = ({ defibrillator, coordinate }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const tags = defibrillator.tags;
  const dayNightStyle = !tags || !tags.opening_hours || tags.opening_hours !== '24/7' ? styles.markerDayStyle : styles.markerDayNightStyle;

  return (
    <Marker coordinate={coordinate || { latitude: defibrillator.lat, longitude: defibrillator.lon }} tracksViewChanges={true}>
      <View style={styles.markerOutsideStyle}>
        <View style={dayNightStyle}>
          <Image style={styles.imageStyle} source={markerImage} onLoadEnd={() => setImageLoaded(true)} />
        </View>
      </View>
      <View style={styles.markerPointerStyle} />
    </Marker>
  );
};

const styles = StyleSheet.create({
  imageStyle: {
    width: 38,
    height: 38,
    margin: 4,
    alignSelf: 'center',
    zIndex: 200,
  },
  markerOutsideStyle: {
    borderRadius: 15,
    borderColor: 'green',
    backgroundColor: '#009a3b',
    height: 54,
    width: 54,
  },
  markerPointerStyle: {
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: '#009a3b',
    borderLeftWidth: 12,
    borderRightWidth: 12,
    borderTopWidth: 20,
    borderStyle: 'solid',
    width: 0,
    height: 0,
    alignSelf: 'center',
    zIndex: 50,
  },
  markerDayStyle: {
    borderColor: 'orange',
    borderRadius: 15,
    borderWidth: 4,
  },
  markerDayNightStyle: {
    borderColor: '#009a3b',
    borderRadius: 15,
    borderWidth: 4,
  },
});

export default DefiMarker;
