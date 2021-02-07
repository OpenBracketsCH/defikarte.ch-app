import React from 'react';
import { ScrollView, Image, Text, StyleSheet } from 'react-native';

const AboutScreen = ({ navigation }) => {
  return (
    <ScrollView style={styles.containerStyle}>
      <Image style={styles.imageStyle} source={require('../../assets/logo_defikarte.png')} />
      <Text style={styles.titleStyle}>Das Projekt</Text>
      <Text style={styles.textStyle}>Die Defikarte.ch-App hilft dabei, den nächsten Defibrillator in deiner Nähe zu finden. Über die Navigations-App des jeweiligen Gerätes, kannst du dich zu diesem navigieren lassen. So kann möglichst rasch einer Person in Not geholfen werden. Die Daten sind Open Source und werden von der Community in OpenStreetMaps (OSM) gepflegt und verwaltet. Da es in der Schweiz keinen kompletten Datensatz und auch keine Meldepflicht für Defibrillatoren gibt, sind nicht alle erfasst und somit auch nicht in der App ersichtlich. Die OSM-Community ist bemüht sich, die Daten aktuell und vollständig zu halten. Bemerkst du also, dass ein Defibrillator nicht eingetragen ist, unterstütze die Community und den guten Zweck indem du den fehlenden Defibrillator mithilfe dieser App mit Leichtigkeit erfasst.</Text>
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