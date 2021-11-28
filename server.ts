import dotenv from 'dotenv';
dotenv.config();

import express, { RequestHandler } from 'express';
import { UserCtrl } from './controllers/UserController';
import { registerValidation } from './validators/register';
import './core/db';

/*
1. app.get show - показати юзера по ід

*/
const app = express();

app.use(express.json());

app.get('/users', UserCtrl.index);
app.post('/users', registerValidation, UserCtrl.create);
app.get('/users/verify', registerValidation, UserCtrl.verify);
app.get('/users/:id', registerValidation, UserCtrl.show);

app.listen(process.env.PORT, () => {
  console.log('SERVER is RUNNING  ');
});
