import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import mongoose from 'mongoose';
import { TweetModel, TweetModelInterface } from '../models/TweetModel';
import { UserModelInterface } from '../models/UserModel';

class TweetController {
  async index(req: Request, res: Response): Promise<void> {
    try {
      const tweets = await TweetModel.find({}).exec();

      res.json({
        status: 'success',
        data: tweets,
      });
    } catch (error) {
      res.json({
        status: 'error',
        errors: JSON.stringify(error),
      });
    }
  }
  async create(req: Request, res: Response): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({
          status: 'error',
          errors: errors.array(),
        });
        return;
      }
      const user = req.user as UserModelInterface;
      if (user?._id) {
        const data: TweetModelInterface = {
          text: req.body.text,
          user: user._id,
        };

        const tweet = await TweetModel.create(data);
        tweet.save();
        res.json({
          status: 'success',
          data: tweet,
        });
        return;
      }
    } catch (error) {
      res.json({
        status: 'error',
        message: JSON.stringify(error),
      });
    }
  }
  async show(req: Request, res: Response): Promise<void> {
    try {
      const tweetId = req.params.id;
      const tweet = await TweetModel.findById(tweetId).exec();
      if (tweet) {
        res.json({
          status: 'success',
          data: tweet,
        });
      } else {
        res.status(400).send();
      }
    } catch (error) {
      res.status(500).send();
      return;
    }
  }
  async delete(req: Request, res: Response): Promise<void> {
    try {
      const user = req.user;
      console.log(user);
      if (user) {
        const tweetId = req.params.id;
        const isValid = mongoose.Types.ObjectId.isValid(tweetId);
        if (!isValid) {
          res.status(400).send();
          return;
        }
        const tweet = await TweetModel.findById(tweetId);
        console.log(tweet && tweetId === tweet.user);
        console.log(`tweet.user ==> ${tweet?.user}`);
        console.log(`tweetId ==> ${tweetId}`);

        if (tweet && tweetId === tweet.user) {
          TweetModel.findByIdAndRemove(tweetId, (err: string) => {
            if (err) {
              res.status(400).send();
              return;
            } else {
              res.send();
            }
          });
        }
        res.status(400).send();
        return;
      }
    } catch (error) {
      res.status(500).send();
      return;
    }
  }
}

export const TweetCtrl = new TweetController();
