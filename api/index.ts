import Cookies from 'nookies';
import axios from 'axios';
import { UserApi } from './UserApi';

export const Api = (ctx) => {
  const cookies = Cookies.get(ctx);
  const token = cookies.token;

  const instance = axios.create({
    baseURL: 'http://localhost:3004',
    headers: {
      Authorization: 'Bearer' + ' ' + token,
    },
  });

  return {
    ...UserApi(instance),
  };
};
