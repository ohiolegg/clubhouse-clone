import { Button } from '../components/Button';
import { Header } from '../components/Header';
import { ConversationCard } from '../components/ConversationCard';
import Link from 'next/link';
import React from 'react';
import { UserApi } from '../api/UserApi';
import { checkAuth } from '../helpers/checkAuth';
import { redirect } from 'next/dist/server/api-utils';
import Axios from '../core/axios';

export default function RoomsPage({ rooms = [] }) {
  return (
    <>
      <Header />
      <div className='container'>
        <div className=' mt-40 d-flex align-items-center justify-content-between'>
          <h1>All conversations</h1>
          <Button color='green'>+ Start room</Button>
        </div>
        <div className='grid mt-30'>
          {rooms.map((obj) => (
            <Link key={obj._id} href={`/rooms/${obj._id}`}>
              <a className='d-flex'>
                <ConversationCard
                  title={obj.title}
                  avatars={obj.avatars}
                  guests={obj.guests}
                  guestsCount={obj.guestsCount}
                  speakersCount={obj.speakersCount}
                />
              </a>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}

export const getServerSideProps = async (ctx) => {
  try {
    const user = await checkAuth(ctx);
    console.log(user);

    if (!user || user.isActive === 0) {
      return {
        props: {},
        redirect: {
          permanent: false,
          destination: '/',
        },
      };
    }

    return {
      props: {
        user,
        rooms: [],
      },
    };
  } catch (error) {
    console.log(error);
    return {
      props: {
        rooms: [],
      },
    };
  }
};
