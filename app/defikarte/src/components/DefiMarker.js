import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {Marker, Callout} from 'react-native-maps';

const DefiMarker = ({defibrillator}) => {
  const tags = defibrillator.tags;

  return (
    <>
      <Marker 
        coordinate={{latitude: defibrillator.lat, longitude: defibrillator.lon}}
        >
          <Callout>
            <View>
              <Text>Verfügbarkeit: {tags.opening_hours}</Text>
              <Text>Ort: {tags['defibrillator:location']}</Text>
              <Text>Besonderes: {tags.description}</Text>
              <Text>Zugang: {tags.access}</Text>
              <Text>Nortrufnummer: {tags['emergency:phone']}</Text>
            </View>          
          </Callout>       
      </Marker>
    </>
  );
};

const styles = StyleSheet.create({});

export default DefiMarker;