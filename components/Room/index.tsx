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
import Peer from 'simple-peer';

import styles from './Room.module.scss';

interface RoomProps {
  title: string;
}

type User = {
  fullname: string;
  avatarUrl: string;
};

let peers = [];

export const Room: React.FC<RoomProps> = ({ title }) => {
  const [users, setUsers] = React.useState<TUserData[]>([]);
  const user = useAppSelector((state) => state.user.data);
  const router = useRouter();
  const roomId = router.query.id;
  const socketRef = React.useRef<Socket>();

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      socketRef.current = io('http://localhost:3004');
      navigator.mediaDevices
        .getUserMedia({
          audio: true,
        })
        .then((stream) => {
          socketRef.current.emit('CLIENT@ROOMS:JOIN', {
            roomId,
            user,
          });

          socketRef.current.on('SERVER@ROOMS:JOIN', (allUsers) => {
            setUsers(allUsers);

            allUsers.forEach((speaker) => {
              if (user.id !== speaker.id && !peers.find((obj) => obj.userId === speaker.id)) {
                const peerIncome = new Peer({
                  initiator: true,
                  trickle: false,
                  stream,
                });

                peerIncome.on('signal', (signal) => {
                  console.log(`1. Signal was created, asking user ${speaker.fullname} to call us`);
                  socketRef.current?.emit('CLIENT@ROOMS:CALL', {
                    targetUserId: speaker.id,
                    callerUserId: user?.id,
                    roomId,
                    signal,
                  });
                });

                peers.push({ userId: speaker.id, peer: peerIncome });
              }
            });
          });

          socketRef.current.on(
            'SERVER@ROOMS:CALL',
            ({ targetUserId, callerUserId, signal: callerSignal }) => {
              console.log(
                `2. Got signal from ${callerUserId} and calling him from ${targetUserId}`,
              );
              const peerOutcome = new Peer({
                initiator: false,
                trickle: false,
                stream,
              });

              peerOutcome.signal(callerSignal);

              peerOutcome
                .on('signal', (signal) => {
                  console.log(`3. Got our signal, send it to ${callerUserId}`);
                  socketRef.current?.emit('CLIENT@ROOMS:ANSWER', {
                    targetUserId: callerUserId,
                    callerUserId: targetUserId,
                    roomId,
                    signal,
                  });
                })
                .on('stream', (stream) => {
                  const audio = document.querySelector('audio');
                  if (audio) {
                    audio.srcObject = stream;
                  }
                });
            },
          );

          socketRef.current.on('SERVER@ROOMS:ANSWER', ({ callerUserId, signal }) => {
            console.log(`4. Recieved call from ${callerUserId}, answering it`);
            const obj = peers.find((obj) => Number(obj.userId) === Number(callerUserId));
            if (obj) {
              obj.peer.signal(signal);
            }
          });
        })
        .catch(() => console.error('You must give us access to yout micro'));

      socketRef.current.on('SERVER@ROOMS:DISCONNECT', (user: TUserData) => {
        setUsers((prev) => prev.filter((obj) => obj.id !== user.id));
        const peerObj = peers.find((obj) => obj.userId === user.id);
        if (peerObj) {
          peerObj.peer.destroy();
        }
      });
    }

    return () => {
      socketRef.current.disconnect();
      peers.forEach((obj) => {
        obj.peer.destroy();
      });
    };
  }, []);
  return (
    <div className={styles.wrapper}>
      <audio controls />
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
          <Speaker key={obj.fullname} {...obj} />
        ))}
      </div>
    </div>
  );
};
