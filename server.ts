import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import multer from 'multer';
import { UserCtrl } from './controllers/UserController';
import { registerValidation } from './validators/register';
import './core/db';
import { passport } from './core/passport';
import { TweetCtrl } from './controllers/TweetController';
import { createTweetValidation } from './validators/createTweet';
import { TopicCtrl } from './controllers/TopicController';
import { UploadFileCtrl } from './controllers/UploadFileController';

/*
TODO:

*/

const app = express();
const storage = multer.memoryStorage();
const upload = multer({ storage });

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
app.patch('/auth/update', passport.authenticate('jwt'), UserCtrl.updateData);
app.post('/auth/signin', passport.authenticate('local'), UserCtrl.afterLogin);

app.get('/tweets', TweetCtrl.index);
app.get('/tweet/:id', TweetCtrl.show);
app.post('/tweet', passport.authenticate('jwt'), createTweetValidation, TweetCtrl.create);
app.patch('/tweet/:id', passport.authenticate('jwt'), createTweetValidation, TweetCtrl.update);
app.delete('/tweet/:id', passport.authenticate('jwt'), TweetCtrl.delete);

app.post('/upload', upload.single('image'), UploadFileCtrl.upload);

app.get('/topics', TopicCtrl.index);

app.listen(process.env.PORT, () => {
  console.log('SERVER is RUNNING');
});
