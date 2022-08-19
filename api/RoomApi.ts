import { AxiosInstance } from 'axios';
import { TUserData } from '../pages';

export type UserWithRoomId = TUserData & { roomId: number };

export interface Room {
  id: number;
  title: string;
  listenersCount: number;
  speakers: UserWithRoomId[];
  type: string;
}

export type RoomType = 'open' | 'social' | 'closed';

export const RoomApi = (instance: AxiosInstance) => {
  return {
    getAllRooms: async (): Promise<Room[]> => {
      const { data } = await instance.get('/rooms');
      return data;
    },

    getOneRoom: async (id: string): Promise<Room> => {
      const { data } = await instance.get(`/rooms/${id}`);
      return data;
    },

    createRoom: async (form: { type: RoomType; title: string }): Promise<Room> => {
      const { data } = await instance.post('/rooms', form);
      return data;
    },

    deleteRoom: async (id: string): Promise<void> => {
      await instance.delete(`/rooms/${id}`);
    },
  };
};
