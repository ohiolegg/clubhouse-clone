import { AxiosInstance } from 'axios';
import { TUserData } from '../pages';

export const UserApi = (instance: AxiosInstance) => {
  return {
    getMe: async (): Promise<TUserData> => {
      const { data } = await instance.get('/auth/me');
      return data;
    },

    checkBan: async (): Promise<{ banned: boolean; banTime: number }> => {
      const { data } = await instance.get('/auth/banned');
      return data;
    },

    getUserInfo: async (userId: number): Promise<TUserData> => {
      const { data } = await instance.get(`user/${userId}`);
      return data;
    },
  };
};
