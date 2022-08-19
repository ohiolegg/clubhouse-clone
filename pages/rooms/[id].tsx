import React from 'react';
import { Api } from '../../api';
import { BackButton } from '../../components/BackButton';
import { Header } from '../../components/Header';
import { Room } from '../../components/Room';
import { checkAuth } from '../../server/utils/checkAuth';
import { setUserData } from '../../redux/slices/userSlice';
import { wrapper } from '../../redux/store';
import { Room as TRoom } from '../../api/RoomApi';
import { TUserData } from '..';

interface RoomPageProps {
  room: TRoom;
  user: TUserData;
}

export default function RoomPage({ room, user }: RoomPageProps) {
  return (
    <>
      <Header />
      <div className='container mt-40'>
        <BackButton title='All rooms' href='/rooms' />
      </div>
      <Room title={room.title} />
    </>
  );
}

export const getServerSideProps = wrapper.getServerSideProps((store) => async (ctx) => {
  try {
    const user = await checkAuth(ctx);

    if (!user) {
      return {
        props: {},
        redirect: {
          permanent: false,
          destination: '/',
        },
      };
    }
    const roomId = ctx.query.id;
    if (!roomId) {
      return {
        props: {},
        redirect: {
          permanent: false,
          destination: '/rooms',
        },
      };
    }

    store.dispatch(setUserData(user));
    const room = await Api(ctx).getOneRoom(roomId as string);

    return {
      props: {
        room,
      },
    };
  } catch (error) {
    console.log(error);
    return {
      props: {},
      redirect: {
        permanent: false,
        destination: '/rooms',
      },
    };
  }
});
