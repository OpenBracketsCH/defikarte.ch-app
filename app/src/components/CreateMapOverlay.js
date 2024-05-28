import { AntDesign } from '@expo/vector-icons';
import { t } from 'i18next';
import React from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { withNavigation } from 'react-navigation';
import MapInfoPanel from './MapInfoPanel';

const CreateMapOverlay = ({ setIsCreateMode, newDefiCoords, navigation, isTopView }) => {
  const ApprovePosition = () => {
    Alert.alert(
      t('check_position'),
      t('is_marker_position_correct'),
      [
        {
          text: t('yes'),
          onPress: () => {
            navigation.navigate('Create', { latlon: newDefiCoords });
            setIsCreateMode(false);
          },
        },
        {
          text: t('no'),
          style: 'destructive',
        },
      ],
      { cancelable: false }
    );
  };

  return (
    <>
      <MapInfoPanel isTopView={isTopView} text={t('move_marker_to_position')} subText={`(${t('hold_marker_to_move')})`} />
      <View style={styles.createIconsContainerStyle}>
        <TouchableOpacity
          style={styles.iconStyle}
          onPress={async () => {
            ApprovePosition();
          }}
        >
          <AntDesign name="checkcircleo" size={48} color="white" />
          <Text style={styles.descriptionTextStyle}>{t('confirm_position')}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setIsCreateMode(false)} style={styles.iconStyle}>
          <AntDesign name="closecircleo" size={48} color="white" />
          <Text style={styles.descriptionTextStyle}>{t('cancel')}</Text>
        </TouchableOpacity>
      </View>
    </>
  );
};

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
  },
});

export default withNavigation(CreateMapOverlay);
