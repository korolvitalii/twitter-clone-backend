import { Response, Request } from 'express';
import { validationResult } from 'express-validator';
import { UserModel, UserModelInterface } from '../models/UserModel';
import { generateBcrypt, generateMDS } from '../utils/generateHash';
import { sendMail } from '../utils/sendMail';

class UserController {
  async index(req: Request, res: Response): Promise<void> {
    try {
      const users = await UserModel.find({}).exec();

      res.json({
        status: 'success',
        data: users,
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

      const data: UserModelInterface = {
        email: req.body.email,
        fullname: req.body.fullname,
        username: req.body.username,
        password: generateBcrypt(req.body.password),
        confirmHash: generateMDS(process.env.SECRET_KEY || Math.random().toString()),
      };

      const user = await UserModel.create(data);
      sendMail(
        {
          emailFrom: 'admin@twitter-clone.com',
          emailTo: data.email,
          subject: 'Confirm your email twitter-clone pet project',
          html: `To confirm your mail, go <a href="http://localhost:${
            process.env.PORT || 8888
          }/auth/verify?hash=${data.confirmHash}">this link</a>`,
        },
        (err: Error | null) => {
          if (err) {
            res.json({
              status: 'error',
              message: JSON.stringify(err),
            });
          } else {
            res.json({
              status: 'success',
              data: user,
            });
          }
        },
      );
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
      const user = await UserModel.findOne({ confirmHash: hash }).exec();

      if (user) {
        user.confirmed = true;
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
      const user = await UserModel.findById(userId).exec();
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
}

export const UserCtrl = new UserController();
