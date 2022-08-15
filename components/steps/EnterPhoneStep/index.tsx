import React from 'react';
import clsx from 'clsx';
import NumberFormat from 'react-number-format';
import { WhiteBlock } from '../../WhiteBlock';
import { Button } from '../../Button';
import { StepInfo } from '../../StepInfo';

import styles from './EnterPhoneStep.module.scss';
import { MainContext } from '../../../pages';
import Axios from '../../../core/axios';
import { useRouter } from 'next/router';
import { checkAuth } from '../../../helpers/checkAuth';

function getRandomInt(min: number, max: number) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; //Максимум не включается, минимум включается
}

const questions = [
  {
    text: 'Чей крым?',
    answer: 'украинский',
  },
  {
    text: 'Продолжите фразу: Путин...',
    answer: 'Хуйло',
  },
];

interface TQuestion {
  text: string;
  answer: string;
}

export const EnterPhoneStep: React.FC = ({ lol }) => {
  const router = useRouter();
  const { userData, setFieldValue } = React.useContext(MainContext);
  const [inputValue, setInputValue] = React.useState<string>('');

  const [question, setQuestion] = React.useState<TQuestion>({} as TQuestion);

  React.useEffect(() => {
    const questionId = getRandomInt(0, questions.length);
    setQuestion(questions[questionId]);
  }, []);

  const onSubmit = async () => {
    const userAnswer = inputValue.toLocaleLowerCase();
    const answer = question.answer.toLocaleLowerCase();

    if (userAnswer === answer) {
      setFieldValue('isActive', 1);
      await Axios.post('/auth/activate', {
        user: userData,
      });
      router.push('/rooms');
    } else {
      const currentDate = new Date().getTime();
      const unBannedDate = currentDate + 30 * 1000;
      const ban: { unBannedTime: number; userId: number } = await Axios.post(
        `/auth/banned?banTime=${unBannedDate}`,
      );
      router.push('/banned');
    }
  };

  return (
    <div className={styles.block}>
      <StepInfo
        icon='/static/phone.png'
        title='Answer the question below'
        description={question.text}
      />
      <WhiteBlock className={clsx('m-auto mt-30', styles.whiteBlock)}>
        <div className={clsx('mb-30', styles.input)}>
          <img src='/static/ukrainian-flag.png' alt='flag' width={24} />
          <div className='mb-30'>
            <input
              onChange={(e) => setInputValue(e.target.value)}
              value={inputValue}
              className='field'
              placeholder='Answer here. Fast.'
            />
          </div>
        </div>
        <Button disabled={!inputValue} onClick={onSubmit}>
          Next
          <img className='d-ib ml-10' src='/static/arrow.svg' />
        </Button>
        <p className={clsx(styles.policyText, 'mt-30')}>
          By entering your number, you’re agreeing to our Terms of Service and Privacy Policy.
          Thanks!
        </p>
      </WhiteBlock>
    </div>
  );
};
