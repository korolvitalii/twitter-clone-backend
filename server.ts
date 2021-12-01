import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import { UserCtrl } from './controllers/UserController';
import { registerValidation } from './validators/register';
import './core/db';
import { passport } from './core/passport';

/*
TODO:
1. 

*/
const app = express();

app.use(express.json());
app.use(passport.initialize());

app.get('/users', UserCtrl.index);
app.get(
  '/users/me',
  passport.authenticate('jwt', {
    session: false,
  }),
  UserCtrl.getUserData,
);
app.get('/users/:id', UserCtrl.show);
app.get('/auth/verify', registerValidation, UserCtrl.verify);
app.post('/auth/signup', registerValidation, UserCtrl.create);
app.post('/auth/signin', passport.authenticate('local'), UserCtrl.afterLogin);

app.listen(process.env.PORT, () => {
  console.log('SERVER is RUNNING  ');
});
