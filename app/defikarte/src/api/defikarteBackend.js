import axios from 'axios';
import Constants from 'expo-constants';

export default axios.create({
  baseURL: Constants.expoConfig.extra.backendBaseUrl,
  headers: {
    'x-functions-clientid': 'defikarte-app',
    'x-functions-key': Constants.expoConfig.extra.backendApiKey,
  }
})