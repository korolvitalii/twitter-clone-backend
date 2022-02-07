import { Response, Request } from 'express';
import { validationResult } from 'express-validator';
import { UserModel, UserModelInterface, UserModellDocumentInterface } from '../models/UserModel';
import { generateBcrypt, generateMDS } from '../utils/generateHash';
import { sendMail } from '../utils/sendMail';
import jwt from 'jsonwebtoken';
import { isValidId } from '../utils/isValidId';

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
        confirmHash: generateMDS(Math.random().toString()),
        bigAvatar: req.body.bigAvatar,
        smallAvatar: req.body.smallAvatar,
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
      //@ts-ignore
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
  async afterLogin(req: Request, res: Response): Promise<void> {
    try {
      const user = req.user ? (req.user as UserModellDocumentInterface).toJSON() : undefined;

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
  async updateData(req: Request, res: Response): Promise<void> {
    try {
      const updatedUser = req.user ? (req.user as UserModellDocumentInterface) : undefined;
      let userId;
      if (updatedUser) {
        userId = updatedUser._id;
        if (!isValidId(userId)) {
          res.status(403).send();
          return;
        }
      }
      const user = await UserModel.findById(userId);
      if (user) {
        user.username = req.body.user.username;
        user.fullname = req.body.user.fullname;
        user.bigAvatar = req.body.user.bigAvatar;
        user.smallAvatar = req.body.user.smallAvatar;
        user.save();
      }

      res.json({
        status: 'success',
        data: {
          user,
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

export const UserCtrl = new UserController();
