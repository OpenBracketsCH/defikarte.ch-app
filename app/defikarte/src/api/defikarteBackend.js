import axios from 'axios';
import Constants from 'expo-constants';

export default axios.create({
  baseURL: Constants.manifest.extra.backendBaseUrl,
  headers: {
    'x-functions-clientid': 'defikarte-app',
    'x-functions-key': Constants.manifest.extra.backendApiKey,
  }
})