import axios from 'axios';

const client = axios.create({
  baseURL: process.env.API_BASE_URL,

  timeout: 10000,
  
  headers: {
    'Content-Type': 'application/json',
  },
});

export default client;