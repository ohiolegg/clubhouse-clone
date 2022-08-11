import { TUserData } from '../../pages';
import jwt from 'jsonwebtoken';

export const createJwtTocken = (user: TUserData): string => {
  const token = jwt.sign(
    {
      data: user,
    },
    process.env.SECRET_JWT_KEY || '',
    {
      expiresIn: '30d',
      algorithm: 'HS256',
    },
  );

  return token;
};
