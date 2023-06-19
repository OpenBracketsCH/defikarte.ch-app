import React from 'react';
import { Alert, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { withNavigation } from 'react-navigation';
import { AntDesign } from '@expo/vector-icons';
import MapInfoPanel from './MapInfoPanel';

const CreateMapOverlay = ({ setIsCreateMode, newDefiCoords, navigation, isTopView }) => {
  const ApprovePosition = () => {
    Alert.alert(
      'Position überprüfen',
      'Ist der rote Marker korrekt positioniert?',
      [
        {
          text: 'Ja',
          onPress: () => {
            navigation.navigate('Create', { latlon: newDefiCoords });
            setIsCreateMode(false);
          },
        },
        {
          text: 'Nein',
          style: 'destructive'
        },
      ],
      { cancelable: false },
    )
  };

  return (
    <>
      <MapInfoPanel
        isTopView={isTopView}
        text='Ziehe den Marker an den Standort des neuen Defibrillators'
        subText='(Marker halten und verschieben)' />
      <View style={styles.createIconsContainerStyle}>
        <TouchableOpacity
          style={styles.iconStyle}
          onPress={async () => {
            ApprovePosition();
          }} >
          <AntDesign name="checkcircleo" size={48} color="white" />
          <Text style={styles.descriptionTextStyle}>Position wählen</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setIsCreateMode(false)}
          style={styles.iconStyle}>
          <AntDesign name="closecircleo" size={48} color="white" />
          <Text style={styles.descriptionTextStyle}>Abbrechen</Text>
        </TouchableOpacity>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  createIconsContainerStyle: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    width: '100%',
    zIndex: 100,
    paddingHorizontal: 20,
    backgroundColor: 'rgba(40, 40, 40, 0.7)',
    position: 'absolute',
    bottom: 0,
  },
  iconStyle: {
    marginVertical: 10,
    alignItems: 'center',
  },
  descriptionTextStyle: {
    color: 'white',
    marginTop: 5,
  }
});

export default withNavigation(CreateMapOverlay);