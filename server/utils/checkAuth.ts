import GetServerSidePropsContext from 'next-redux-wrapper';
import { TUserData } from '../../pages';
import { Api } from '../../api';
import { setUserData } from '../../redux/slices/userSlice';
import { AnyAction, Store } from '@reduxjs/toolkit';
import { RootState } from '../../redux/types';
/* import { GetServerSidePropsContext } from 'next'; */

export const checkAuth = async (ctx: any): Promise<TUserData | null> => {
  try {
    return await Api(ctx).getMe();
  } catch (error) {
    return null;
  }
};
