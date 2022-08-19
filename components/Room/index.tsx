import clsx from 'clsx';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';
import { Socket } from 'socket.io-client';
import { io } from 'socket.io-client';
import { TUserData } from '../../pages';
import { useAppSelector } from '../../redux/hooks';
import { Button } from '../Button';
import { Speaker } from '../Speaker';

import styles from './Room.module.scss';

interface RoomProps {
  title: string;
}

type User = {
  fullname: string;
  avatarUrl: string;
};

export const Room: React.FC<RoomProps> = ({ title }) => {
  const [users, setUsers] = React.useState<TUserData[]>([]);
  const user = useAppSelector((state) => state.user.data);
  const router = useRouter();
  const roomId = router.query.id;
  const socketRef = React.useRef<Socket>();

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      socketRef.current = io('http://localhost:3004');
      socketRef.current.emit('CLIENT@ROOMS:JOIN', {
        roomId,
        user,
      });

      socketRef.current.on('SERVER@ROOMS:DISCONNECT', (users: TUserData[]) => {
        setUsers([...users]);
      });

      socketRef.current.on('SERVER@ROOMS:JOIN', (allUsers) => {
        setUsers((prev) => [...prev, ...allUsers]);
      });
    }

    return () => {
      socketRef.current.disconnect();
    };
  }, []);
  return (
    <div className={styles.wrapper}>
      <div className='d-flex align-items-center justify-content-between'>
        <h2>{title}</h2>
        <div className={clsx('d-flex align-items-center', styles.actionButtons)}>
          <Link href='/rooms'>
            <Button color='gray' className={styles.leaveButton}>
              <img width={18} height={18} src='/static/peace.png' alt='Hand black' />
              Leave quietly
            </Button>
          </Link>
        </div>
      </div>

      <div className='users d-flex' style={{ flexWrap: 'wrap' }}>
        {/* {isLoading && <div className="loader"></div>} */}
        {users.map((obj) => (
          <Speaker {...obj} />
        ))}
      </div>
    </div>
  );
};
