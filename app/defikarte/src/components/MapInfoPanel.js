import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const MapInfoPanel = ({ text, subText, showLoading, isTopView }) => {
  const insets = useSafeAreaInsets();

  const loadingAnimation = showLoading ? <ActivityIndicator style={styles.spinnerStyle} size="small" color="white" /> : null;
  const subTextComp = subText ? <Text style={styles.subTextStyle}>{subText}</Text> : null;

  let containerStyle = { ...styles.panelContainerStyle };
  if (isTopView) {
    containerStyle.marginTop = insets.top;
  }

  return (
    <View style={containerStyle}>
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