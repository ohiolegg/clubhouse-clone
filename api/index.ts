import Cookies from 'nookies';
import axios from 'axios';
import { UserApi } from './UserApi';
import { RoomApi } from './RoomApi';
import { GetServerSidePropsContext } from 'next';

type ApiReturnType = ReturnType<typeof UserApi> & ReturnType<typeof RoomApi>;

export const Api = (ctx: any): ApiReturnType => {
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
    ...RoomApi(instance),
  };
};
