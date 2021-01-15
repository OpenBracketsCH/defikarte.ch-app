import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { withNavigation } from 'react-navigation';
import { AntDesign } from '@expo/vector-icons';
import MapInfoPanel from './MapInfoPanel';

const CreateMapOverlay = ({ createMode, setIsCreateMode, newDefiCoords, navigation }) => {
  if (createMode) {
    return (
      <>
        <MapInfoPanel
          text='Ziehe den Marker an den Standort des neuen Defibrillators'
          subText='(Marker halten und verschieben)' />
        <View style={styles.createIconsContainerStyle}>
          <TouchableOpacity onPress={() => {
            navigation.navigate('Create', { latlon: newDefiCoords });
            setIsCreateMode(false);
          }} >
            <AntDesign name="checkcircleo" size={48} color="green" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setIsCreateMode(false)} style={styles.createIconsStyle}>
            <AntDesign name="closecircleo" size={48} color="red" />
          </TouchableOpacity>
        </View>
      </>
    );
  }

  return null;
}

const styles = StyleSheet.create({
  createIconsContainerStyle: {
    flexDirection: 'row',
    height: 70,
    borderRadius: 10,
    zIndex: 100,
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: 'rgba(254, 254, 254, .6)',
    borderWidth: 1,
    borderColor: 'rgba(200, 200, 200, 1)',
    position: 'absolute',
    bottom: 20,
  },
  createIconsStyle: {
    paddingLeft: 20,
  },
});

export default withNavigation(CreateMapOverlay);