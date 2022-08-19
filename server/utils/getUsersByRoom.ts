import { TUserData } from '../../pages';

export const getUsersByRoom = (
  rooms: Record<string, { roomId: string; user: TUserData }>,
  roomId: string,
) =>
  Object.values(rooms)
    .filter((obj) => obj.roomId === roomId)
    .map((obj) => ({ ...obj.user, roomId: Number(roomId) }));
