import axios from 'axios';

const client = axios.create({
  baseURL: 'http://15.164.113.103', //  서버 IP
  headers: {
    'Content-Type': 'application/json',
  },
});

export default client;