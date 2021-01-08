import axios from 'axios';

export default axios.create({
  baseURL: 'https://defikarte-backend.azurewebsites.net/api',
})