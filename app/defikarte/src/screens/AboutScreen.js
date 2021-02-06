import React from 'react';
import { ScrollView, Image, Text, StyleSheet } from 'react-native';

const AboutScreen = ({ navigation }) => {
  return (
    <ScrollView style={styles.containerStyle}>
      <Image style={styles.imageStyle} source={require('../../assets/logo_defikarte.png')} />
      <Text style={styles.titleStyle}>Das Projekt</Text>
      <Text style={styles.textStyle}>This App should help find the next AED (Defibrillator) to the person searching for help or willing to reanimate a person in need. The data is ioen source and hosted on openstreetmap. Everyone should be able to reach the next defi with the app. The app gives the next position of a defi to the navigation app you already use.</Text>
      <Text style={styles.titleStyle}>Lizenz</Text>
      <Text style={styles.textStyle}>MIT</Text>
      <Text style={styles.titleStyle}>GitHub</Text>
      <Text style={styles.textStyle}>https://github.com/chnuessli/defikarte.ch-app</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  containerStyle: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'white'
  },
  titleStyle: {
    fontSize: 20,
    alignSelf: 'center',
    fontWeight: '500',
    marginTop: 10,
  },
  textStyle: {
    fontSize: 16,
    alignSelf: 'center',
    marginHorizontal: 10,
  },
  imageStyle: {
    height: 150,
    width: '100%',
    alignSelf: 'center',
  }
});

export default AboutScreen;