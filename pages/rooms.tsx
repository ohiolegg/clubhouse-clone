import { Button } from '../components/Button';
import { Header } from '../components/Header';
import { ConversationCard } from '../components/ConversationCard';
import Link from 'next/link';
import React from 'react';
import { checkAuth } from '../helpers/checkAuth';
import { StartRoomModal } from '../components/StartRoomModal';
import { Api } from '../api';
import { Room } from '../api/RoomApi';
import { GetServerSideProps, NextPage } from 'next';

interface RoomPageProps {
  rooms: Room[];
}

const RoomsPage: NextPage<RoomPageProps> = ({ rooms = [] }) => {
  const [visibleModal, setVisibleModal] = React.useState<boolean>(false);

  return (
    <>
      <Header />
      <div className='container'>
        <div className=' mt-40 d-flex align-items-center justify-content-between'>
          <h1>All conversations</h1>
          <Button onClick={() => setVisibleModal(true)} color='green'>
            + Start room
          </Button>
        </div>
        {visibleModal && <StartRoomModal onClose={() => setVisibleModal(false)} />}
        <div className='grid mt-30'>
          {rooms.map((obj) => (
            <Link key={obj._id} href={`/rooms/${obj._id}`}>
              <a className='d-flex'>
                <ConversationCard
                  title={obj.title}
                  avatars={obj.avatars}
                  speakers={obj.speakers}
                  listenersCount={obj.listenersCount}
                />
              </a>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
};

export const getServerSideProps: GetServerSideProps<RoomPageProps> = async (ctx) => {
  try {
    const user = await checkAuth(ctx);
    const rooms = await Api(ctx).getAllRooms();

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
        rooms: rooms,
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

export default RoomsPage;
