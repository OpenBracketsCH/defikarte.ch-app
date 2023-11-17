import axios from 'axios';

export default axios.create({
  baseURL: process.env.EXPO_PUBLIC_BASE_URL || 'https://defikarte-backend-staging.azurewebsites.net/api',
  headers: {
    'x-functions-clientid': 'defikarte-app',
    'x-functions-key': process.env.EXPO_PUBLIC_API_KEY || '', // create AED will not work without an api key
  },
});
