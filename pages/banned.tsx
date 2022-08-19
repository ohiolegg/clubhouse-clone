import { Header } from '../components/Header';
import React from 'react';
import Axios from '../core/axios';
import { checkAuth } from '../server/utils/checkAuth';
import { UserApi } from '../api/UserApi';
import { Api } from '../api';

export default function BanPage({ ban }) {
  React.useEffect(() => {
    const { data } = Axios.get('/auth/banned').then((res) => console.log(res));
  }, []);
  return (
    <>
      <Header />
      <div className='container'>
        <div className=' mt-40 d-flex align-items-center justify-content-between'>
          <h1>You are banned</h1>
        </div>
      </div>
    </>
  );
}

export const getServerSideProps = async (ctx) => {
  try {
    const user = await checkAuth(ctx);
    const banned = await Api(ctx).checkBan();

    if (!banned.banned && user?.isActive === 0) {
      return {
        props: {},
        redirect: {
          permanent: false,
          destination: '/',
        },
      };
    }
  } catch (error) {}
  return {
    props: {},
  };
};
