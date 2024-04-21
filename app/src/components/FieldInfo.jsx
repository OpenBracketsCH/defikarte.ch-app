import { FontAwesome6 } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Button, Linking, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const FieldInfo = ({ titel, text, link }) => {
  const [modalVisible, setModalVisible] = useState(false);

  const handlePress = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  return (
    <View>
      <TouchableOpacity onPress={handlePress}>
        <FontAwesome6 name="circle-question" size={24} color="rgba(70, 70, 70, 1)" />
      </TouchableOpacity>
      <Modal
        visible={modalVisible}
        animationType="none"
        onRequestClose={closeModal}
        transparent={true}
      >
        <View style={styles.container}>
          <View style={styles.modalView}>
            {titel && <Text style={styles.titelStyle}>{titel}</Text>}
            <View>
              {text.map((x, i) => <View style={styles.contentContainer} kex={i}>
                <Text key={i + 'title'} style={styles.contentTitelStyle}>{x.titel}</Text>
                <Text key={i + 'text'} style={styles.contentTextStyle}>{x.text}</Text>
              </View>)}
              {link && <Button title="Weiterführende Informationen" onPress={() => Linking.openURL(link)} />}
            </View>
            <Button onPress={closeModal} title='Schliessen' />
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default FieldInfo;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 5,
    padding: 20,
    gap: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  titelStyle: {
    fontSize: 24,
    fontWeight: '500',
    textAlign: 'center',
  },
  contentTitelStyle: {
    fontSize: 20,
    fontWeight: '500',
    textAlign: 'left',
    marginBottom: 5,
  },
  contentTextStyle: {
    fontSize: 18,
    textAlign: 'left',
  },
  contentContainer: {
    marginBottom: 10,
  },
});