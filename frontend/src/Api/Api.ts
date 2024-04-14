import axios from 'axios';

const Api = axios.create({
  baseURL: import.meta.env.VITE_APP_API_SERVER,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default Api;

