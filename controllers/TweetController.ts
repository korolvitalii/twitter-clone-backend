import { Response, Request } from 'express';
import { validationResult } from 'express-validator';
import {
  TweetModel,
  TweetModelInterface,
  TweetModellDocumentInterface,
} from '../models/TweetModel';
import { generateBcrypt, generateMDS } from '../utils/generateHash';
import { sendMail } from '../utils/sendMail';
import jwt from 'jsonwebtoken';

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

      const data: TweetModelInterface = {
        text: req.body.text,
        user: req.body.user,
      };

      const tweet = await TweetModel.create(data);
      tweet.save();
      res.json({
        status: 'success',
        data: tweet,
      });
      return;
    } catch (error) {
      res.json({
        status: 'error',
        message: JSON.stringify(error),
      });
    }
  }
  async verify(req: Request, res: Response): Promise<void> {
    try {
      const hash = req.query.hash;

      if (!hash) {
        res.status(400).send();
        return;
      }
      //@ts-ignore
      const user = await TweetModel.findOne({ confirmHash: hash }).exec();

      if (user) {
        // user.confirmed = true;
        user.save();
        res.json({
          status: 'success',
        });
      }
    } catch (error) {
      res.json({
        status: 'error',
        errors: JSON.stringify(error),
      });
    }
  }
  async show(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.params.id;
      const user = await TweetModel.findById(userId).exec();
      if (user) {
        res.json({
          status: 'success',
          data: user,
        });
      } else {
        res.status(400).send();
      }
      res.json({
        status: 'error from try',
        data: user,
      });
    } catch (error) {
      res.status(500).send();
      return;
    }
  }
  async afterLogin(req: Request, res: Response): Promise<void> {
    try {
      const user = req.user ? (req.user as TweetModellDocumentInterface).toJSON() : undefined;

      res.json({
        status: 'success',
        data: {
          ...user,
          token: jwt.sign({ data: req.user }, process.env.SECRET_KEY || '123', {
            expiresIn: '30d',
          }),
        },
      });
    } catch (error) {
      res.status(500).send();
      return;
    }
  }
  async getUserData(req: Request, res: Response): Promise<void> {
    try {
      res.json({
        status: 'success',
        data: req.user,
      });
    } catch (error) {
      res.status(500).send();
      return;
    }
  }
}

export const TweetCtrl = new TweetController();
