import React from 'react';
import { Avatar } from '../Avatar';

import styles from './ConversationCard.module.scss';
import whiteBlockStyles from '../WhiteBlock/WhiteBlock.module.scss';
import clsx from 'clsx';
import { TUserData } from '../../pages';

export interface ConversationCard {
  _id?: string;
  title: string;
  speakers: TUserData[];
  listenersCount: number;
}

export const ConversationCard: React.FC<ConversationCard> = ({
  title,
  speakers = [],
  listenersCount,
}) => {
  return (
    <div className={clsx(whiteBlockStyles.block, styles.card, 'mb-30')}>
      <h4 className={styles.title}>{title}</h4>
      <div className={clsx('d-flex mt-10', styles.content)}>
        <div className={styles.avatars}>
          {speakers.map((user, i) => (
            <Avatar
              key={user.avatarUrl}
              width='45px'
              height='45px'
              src={user.avatarUrl}
              className={speakers.length > 1 && i === speakers.length - 1 ? 'lastAvatar' : ''}
            />
          ))}
        </div>
        <div className={clsx(styles.info, 'ml-10')}>
          <ul className={styles.users}>
            {speakers.map((obj, i) => (
              <li key={obj.fullname + i}>
                {obj.fullname} <img src='/static/cloud.png' alt='Cloud' width={14} height={14} />
              </li>
            ))}
          </ul>
          <ul className={styles.details}>
            <li>
              {listenersCount}{' '}
              <img src='/static/user.svg' alt='Users count' width={12} height={12} />
            </li>
            <li>
              {speakers.length}
              <img
                className='ml-5'
                src='/static/message.svg'
                alt='Users count'
                width={12}
                height={12}
              />
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
