import axios from 'axios';

export default axios.create({
  baseURL: process.env['REACT_NATIVE_BASE_URL'] //?? 'https://defikarte-backend-staging.azurewebsites.net/api',
})