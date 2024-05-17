import { t } from 'i18next';
import { Alert, StyleSheet } from 'react-native';

const LocationError = ({ title, message }) => {
  return Alert.alert(title, message, [{ text: t('ok') }], { cancelable: false });
};

const styles = StyleSheet.create({});

export default LocationError;
