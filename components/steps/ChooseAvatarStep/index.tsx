import React from 'react';
import clsx from 'clsx';
import { WhiteBlock } from '../../WhiteBlock';
import { Button } from '../../Button';
import { StepInfo } from '../../StepInfo';
import { Avatar } from '../../Avatar';

import styles from './ChooseAvatarStep.module.scss';
import { MainContext } from '../../../pages';
import uploadImage from '../../../server/utils/uploadImage';

export interface fileObj {
  file?: File;
  avatarUrl: string;
}

export const ChooseAvatarStep: React.FC = () => {
  const { onNextStep, userData, setFieldValue } = React.useContext(MainContext);
  const [avatar, setAvatar] = React.useState<fileObj>({ avatarUrl: userData.avatarUrl });
  const [isLoading, setLoading] = React.useState<boolean>(false);
  const letters = userData.fullname
    .split(' ')
    .map((s) => s[0])
    .join('');
  const inputFileRef = React.useRef<HTMLInputElement>(null);

  const handleChangeImage = (event: Event): void => {
    const file = (event.target as HTMLInputElement).files[0];
    if (file) {
      const obj = {
        avatarUrl: URL.createObjectURL(file),
        file,
      };
      setAvatar(obj);
    }
  };

  const nextStepHandler = async () => {
    setLoading(true);
    if (avatar.file) {
      const data = await uploadImage(avatar.file);
      setFieldValue('avatarUrl', data);
    }
    setLoading(false);
    onNextStep();
  };

  React.useEffect(() => {
    if (inputFileRef.current) {
      inputFileRef.current.addEventListener('change', handleChangeImage);
    }
  }, []);

  return (
    <div className={styles.block}>
      <StepInfo
        icon='/static/celebration.png'
        title={`Okay, ${userData.fullname}!`}
        description='How’s this photo?'
      />
      <WhiteBlock className={clsx('m-auto mt-40', styles.whiteBlock)}>
        <div className={styles.avatar}>
          <Avatar width='120px' height='120px' src={avatar.avatarUrl} letters={letters} />
        </div>
        <div className='mb-30'>
          <label htmlFor='image' className='link cup'>
            Choose a different photo
          </label>
        </div>
        <input id='image' ref={inputFileRef} type='file' hidden />
        <Button disabled={isLoading} onClick={nextStepHandler}>
          Next
          <img className='d-ib ml-10' src='/static/arrow.svg' />
        </Button>
      </WhiteBlock>
    </div>
  );
};
