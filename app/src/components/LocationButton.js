import React, { useContext } from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Context as LocationContext } from '../context/LocationContext';

const LocationButton = ({ isTopView, animateToRegion }) => {
  const insets = useSafeAreaInsets();
  const { state: userLocation, enableLocationTracking } = useContext(LocationContext);

  const locationIcon = !userLocation.enabled ? 'location-disabled' : !userLocation.location ? 'location-searching' : 'my-location';

  let locationButtonStyle = { ...styles.locationButtonStyle };
  if (isTopView) {
    locationButtonStyle.marginTop = insets.top + locationButtonStyle.marginTop;
  }

  return (
    <TouchableOpacity style={locationButtonStyle} onPress={async () => {
      enableLocationTracking(true)
      if (userLocation.location) {
        animateToRegion(userLocation.location);
      }
    }}>
      <MaterialIcons name={locationIcon} style={styles.iconStyle} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  iconStyle: {
    alignSelf: 'center',
    fontSize: 27,
    color: 'white',
  },
  locationButtonStyle: {
    zIndex: 100,
    alignSelf: 'flex-end',
    marginTop: 20,
    marginRight: 8,
    padding: 7,
    borderRadius: 5,
    backgroundColor: 'rgba(40, 40, 40, 0.7)',
    shadowColor: 'black',
  }
});

export default LocationButton;