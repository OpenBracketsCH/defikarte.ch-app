import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { AntDesign, Feather } from '@expo/vector-icons';

const WarningInfoPanel = ({ text, onButtonClick }) => {
  return (
    <View style={styles.panelContainerStyle}>
      <Feather name='info' color='white' size={42} />
      <Text style={styles.textStyle}>
        {text}
      </Text>
      <TouchableOpacity onPress={() => onButtonClick(false)}>
        <AntDesign name='closecircleo' color='white' size={24} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  panelContainerStyle: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    paddingVertical: 10,
    backgroundColor: 'rgba(255, 20, 40, 0.7)',
    bottom: 0,
  },
  textStyle: {
    fontSize: 14,
    color: 'white',
    paddingHorizontal: 5,
    width: '75%',
  },
});

export default WarningInfoPanel;