import React from 'react';
import { ScrollView, Image, Text, StyleSheet } from 'react-native';

const AboutScreen = ({ navigation }) => {
  return (
    <ScrollView style={styles.containerStyle}>
      <Image style={styles.imageStyle} source={require('../../assets/logo_defikarte.png')} />
      <Text style={styles.titleStyle}>Das Projekt</Text>
      <Text style={styles.textStyle}>Diese App sollte helfen, den nächsten Defibrillator in der näheren Umgebung zu finden. Dies um möglichst rasch, einer Person in Not oder einer Reanimation helfen zu können.Die Daten sind komplett Open Source und kommen von OpenStreetMap. Mit Hilfe der App sollte jede Person zum nächst besten Defi navigiert werden über die Navigations-App des jeweiligen Handys. Die Karte zeigt nicht alle Standorte an, sondenr nur diese die auf OpenStreetMap bekannt sind, und die App sollte helfen, den Weg einen Defi zu melden, zu erleichtern.</Text>
      <Text style={styles.titleStyle}>Webseite</Text>
      <Text style={styles.textStyle}>https://www.defikarte.ch</Text>
      <Text style={styles.titleStyle}>Lizenz</Text>
      <Text style={styles.textStyle}>MIT-Lizenz (https://opensource.org/licenses/MIT)</Text>
      <Text style={styles.titleStyle}>Mitmachen & Fehler melden auf Github</Text>
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