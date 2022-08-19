import { Button } from '../components/Button';
import { Header } from '../components/Header';
import { ConversationCard } from '../components/ConversationCard';
import Link from 'next/link';
import React from 'react';
import { checkAuth } from '../server/utils/checkAuth';
import { StartRoomModal } from '../components/StartRoomModal';
import { Api } from '../api';
import { Room } from '../api/RoomApi';
import { GetServerSideProps, NextPage } from 'next';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { wrapper } from '../redux/store';
import { setRooms, setRoomSpeakers } from '../redux/slices/roomSlice';
import { setUserData } from '../redux/slices/userSlice';
import { useSocket } from '../hooks/useSocket';
import { io, Socket } from 'socket.io-client';

const RoomsPage: NextPage = () => {
  const [visibleModal, setVisibleModal] = React.useState<boolean>(false);
  const rooms = useAppSelector((state) => state.rooms.items);
  const socketRef = React.useRef<Socket>();
  const dispatch = useAppDispatch();

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      socketRef.current = io('http://localhost:3004');
      socketRef.current.on('SERVER@ROOMS:HOME', ({ users, roomId }) => {
        dispatch(setRoomSpeakers({ speakers: users, roomId: Number(roomId) }));
      });
    }
  }, []);
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
            <Link key={obj.id} href={`/rooms/${obj.id}`}>
              <a className='d-flex'>
                <ConversationCard
                  title={obj.title}
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

export const getServerSideProps: GetServerSideProps = wrapper.getServerSideProps(
  (store) => async (ctx) => {
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

      const rooms = await Api(ctx).getAllRooms();

      store.dispatch(setRooms(rooms));
      store.dispatch(setUserData(user));

      return {
        props: {},
      };
    } catch (error) {
      console.log('ERROR!');
      return {
        props: {},
      };
    }
  },
);

export default RoomsPage;
