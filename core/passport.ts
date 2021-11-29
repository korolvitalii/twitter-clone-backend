import passport from 'passport';
import { Strategy as LocalStraregy } from 'passport-local';
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
        console.log(user);
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

passport.serializeUser((user: any, done) => {
  done(null, user?._id);
});

passport.deserializeUser((id, done) => {
  UserModel.findById(id, (err: any, user: UserModelInterface) => {
    done(err, user);
  });
});

export { passport };
