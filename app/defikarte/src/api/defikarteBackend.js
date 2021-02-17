import axios from 'axios';

export default axios.create({
  baseURL: process.env['REACT_NATIVE_BASE_URL'] ?? '',
  headers: {
    'x-functions-clientid': 'defikarte-app',
    'x-functions-key': process.env['REACT_NATIVE_API_KEY'] ?? '',
  }
})