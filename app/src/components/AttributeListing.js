import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';

const AttributeListing = ({ title, iconName, value }) => {
  const icon = iconName == 'stairs' ? <MaterialCommunityIcons style={styles.iconStyle} name={iconName} /> : <Feather style={styles.iconStyle} name={iconName} />;
  return (
    <View style={styles.containerStyle} >
      {icon}
      <View style={styles.innerContainerStyle}>
        <Text style={styles.titleStyle}>{title}</Text>
        <Text style={styles.valueStyle}>{value ?? 'n/A'}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  titleStyle: {
    fontSize: 18,
  },
  valueStyle: {
    fontSize: 14,
    flexWrap: 'wrap',
  },
  iconStyle: {
    fontSize: 30,
    color: 'grey'
  },
  innerContainerStyle: {
    flex: 1,
    marginLeft: 20,
  },
  containerStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 2,
    padding: 10,
  }
});

export default AttributeListing;