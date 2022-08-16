import { GetServerSidePropsContext } from 'next';
import { useRouter } from 'next/router';
import React from 'react';
import { Api } from '../../api';
import { BackButton } from '../../components/BackButton';
import { Header } from '../../components/Header';
import { Room } from '../../components/Room';
import Axios from '../../core/axios';

export default function RoomPage({ room }) {
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

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  try {
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
};
