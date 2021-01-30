import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';

const MapInfoPanel = ({ text, subText, showLoading }) => {
  const loadingAnimation = showLoading ? <ActivityIndicator style={styles.spinnerStyle} size="small" /> : null;
  const subTextComp = subText ? <Text style={styles.subTextStyle}>{subText}</Text> : null;
  return (
    <View style={styles.panelContainerStyle}>
      <View style={styles.inlineStyle}>
        {loadingAnimation}
        <Text style={styles.textStyle}>
          {text}
        </Text>
      </View>
      {subTextComp}
    </View>
  );
};

const styles = StyleSheet.create({
  panelContainerStyle: {
    zIndex: 100,
    width: '100%',
    paddingVertical: 10,
    backgroundColor: 'rgba(40, 40, 40, 0.7)',
  },
  inlineStyle: {
    flexDirection: 'row',
    justifyContent: 'center'
  },
  textStyle: {
    textAlign: 'center',
    fontSize: 20,
    color: 'white',
  },
  subTextStyle: {
    textAlign: 'center',
    fontSize: 14,
    marginTop: 5,
    color: 'white',
  }
});

export default MapInfoPanel;