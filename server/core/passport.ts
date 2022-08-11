import { userAgent } from 'next/server';
import passport from 'passport';
import { Strategy as GithubStrategy } from 'passport-github';
import { ExtractJwt } from 'passport-jwt';
import { Strategy as JWTstrategy } from 'passport-jwt';
import { User } from '../../models';
import { TUserData } from '../../pages';
import { createJwtTocken } from '../utils/createJwtTocken';

passport.use(
  'github',
  new GithubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
      callbackURL: 'http://localhost:3004/auth/github/callback',
    },
    async (_: unknown, __: unknown, profile, done) => {
      try {
        let UserData: TUserData;
        const obj: Omit<TUserData, 'id'> = {
          fullname: profile.displayName,
          avatarUrl: profile.photos?.[0].value,
          username: profile.username,
          isActive: 0,
          phone: '',
        };
        UserData = await User.findOne({
          where: {
            username: obj.username,
          },
        });

        if (!UserData) {
          const user = await User.create(obj);
          UserData = user.toJSON();
          done(null, user.toJSON());
        }

        done(null, {
          ...UserData,
          token: createJwtTocken(UserData),
        });
      } catch (error) {
        done(error as Error);
      }
    },
  ),
);

passport.use(
  new JWTstrategy(
    {
      secretOrKey: process.env.SECRET_JWT_KEY || '123',
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    },
    (payload, done) => {
      done(null, payload.data);
    },
  ),
);

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  User.findById(id, function (err, user) {
    err ? done(err) : done(null, user);
  });
});

export { passport };
