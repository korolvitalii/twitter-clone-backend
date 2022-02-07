import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { TweetModel } from '../models/TweetModel';
import { UserModellDocumentInterface } from '../models/UserModel';
import { isValidId } from '../utils/isValidId';

class TweetController {
  async index(req: Request, res: Response): Promise<void> {
    try {
      const tweets = await TweetModel.find({}).populate('user').sort({ createdAt: -1 }).exec();

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
      const user = req.user as any;
      if (user?._id) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          res.status(400).json({
            status: 'error',
            errors: errors.array(),
          });
          return;
        }
        const data: any = {
          text: req.body.text,
          user: user._id,
          images: req.body.images,
        };
        const tweet = await TweetModel.create(data);
        tweet.save();
        res.json({
          status: 'success',
          data: await tweet.populate('user'),
        });
        return;
      }
    } catch (error) {
      res.json({
        status: 'error from catch',
        message: JSON.stringify(error),
      });
    }
  }
  async show(req: Request, res: Response): Promise<void> {
    try {
      const tweetId = req.params.id;
      const tweet = await TweetModel.findById(tweetId).populate('user').exec();
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
      const user = req.user as UserModellDocumentInterface;
      if (user) {
        const tweetId = req.params.id;
        if (!isValidId(tweetId)) {
          res.status(403).send();
          return;
        }

        const tweet = await TweetModel.findById(tweetId);

        if (tweet) {
          if (user?._id.equals(tweet?.user._id)) {
            await TweetModel.findByIdAndRemove(tweetId);
            res.send();
          } else {
            res.status(403).send();
            return;
          }
        } else {
          res.status(404).send();
          return;
        }
      }
    } catch (error) {
      res.status(500).send();
      return;
    }
  }
  async update(req: Request, res: Response): Promise<void> {
    try {
      const user = req.user as UserModellDocumentInterface;
      if (user) {
        const tweetId = req.params.id;
        if (!isValidId(tweetId)) {
          res.status(403).send();
          return;
        }
        const tweet = await TweetModel.findById(tweetId);

        if (tweet) {
          if (user?._id.equals(tweet?.user._id)) {
            tweet.text = req.body.text;
            tweet.save();
            res.json({
              status: 'success',
              data: tweet,
            });
          } else {
            res.status(403).send();
            return;
          }
        } else {
          res.status(404).send();
          return;
        }
      }
    } catch (error) {
      res.status(500).send();
      return;
    }
  }
}

export const TweetCtrl = new TweetController();
