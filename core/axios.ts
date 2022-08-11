import Axios from 'axios';

const instance = Axios.create({
  baseURL: 'http://localhost:3004/',
});

export default instance;
