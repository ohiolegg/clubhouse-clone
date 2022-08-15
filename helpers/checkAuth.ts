import { GetServerSidePropsContext } from 'next';
import { TUserData } from '../pages';
import { Api } from '../api';

export const checkAuth = async (ctx: GetServerSidePropsContext): Promise<TUserData | null> => {
  try {
    return await Api(ctx).getMe();
  } catch (error) {
    return null;
  }
};
