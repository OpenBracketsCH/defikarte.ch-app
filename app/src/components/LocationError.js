import { t } from 'i18next';
import { Alert } from 'react-native';

const LocationError = ({ title, message }) => {
  return Alert.alert(title, message, [{ text: t('ok') }], { cancelable: false });
};

export default LocationError;
