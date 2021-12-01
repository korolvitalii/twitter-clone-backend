import passport from 'passport';
import { Strategy as LocalStraregy } from 'passport-local';
import { Strategy as JWTstrategy, ExtractJwt } from 'passport-jwt';
import { UserModel, UserModelInterface } from '../models/UserModel';
import bcrypt from 'bcrypt';

passport.use(
  new LocalStraregy(
    {
      usernameField: 'email',
      passwordField: 'password',
    },
    async (email, password, done): Promise<void> => {
      try {
        const user = await UserModel.findOne({ email }).exec();
        if (!user) {
          return done(null, false, { message: 'User not found' });
        }

        bcrypt.compare(password, user.password, function (err, result) {
          if (result) {
            return done(null, user);
          } else {
            return done(null, false, { message: 'Wrong Password' });
          }
        });
      } catch (error) {
        return done(error);
      }
    },
  ),
);

passport.use(
  new JWTstrategy(
    {
      secretOrKey: process.env.SECRET_KEY || '123',
      jwtFromRequest: ExtractJwt.fromHeader('token'),
    },
    async (payload: { data: UserModelInterface }, done) => {
      try {
        const user = await UserModel.findById(payload.data._id).exec();
        if (user) {
          return done(null, user);
        }
        return done(null, false);
      } catch (error) {
        done(error);
      }
    },
  ),
);
passport.serializeUser((user: any, done) => {
  done(null, user?._id);
});

passport.deserializeUser((id: string, done) => {
  UserModel.findById(id, (err: string, user: UserModelInterface) => {
    done(err, user);
  });
});

export { passport };
