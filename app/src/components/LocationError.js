import { Alert, StyleSheet } from 'react-native';

const LocationError = ({ title, message }) => {
  return (
    Alert.alert(
      title,
      message,
      [
        { text: "OK" }
      ],
      { cancelable: false }
    )
  );
}

const styles = StyleSheet.create({});

export default LocationError;