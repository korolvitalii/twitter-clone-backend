import passport from 'passport';
import { Strategy as LocalStraregy } from 'passport-local';
import { UserModel } from '../models/UserModel';
import { generateBcrypt } from '../utils/generateHash';

passport.use(
  new LocalStraregy(
    {
      usernameField: 'email',
      passwordField: 'password',
    },
    async (email, password, done): Promise<void> => {
      try {
        console.log('I am here, catch>passport');

        //   const user = await UserModel.findOne({ $or: [{ email } , { username }] }).exec();
        const user = await UserModel.findOne({ email }).exec();

        if (!user) {
          return done(null, false, { message: 'User not found' });
        }

        const validate = user.password === generateBcrypt(password);

        if (!validate) {
          return done(null, false, { message: 'Wrong Password' });
        }

        return done(null, user, { message: 'Logged in Successfully' });
      } catch (error) {
        console.log('I am here, catch>passport');
        return done(error);
      }
    },
  ),
);

export { passport };
