import { Request, Response } from 'express';
import { TopicModel } from '../models/TopicModel';

class TopicController {
  async index(req: Request, res: Response): Promise<void> {
    try {
      const Topics = await TopicModel.find({}).exec();

      res.json({
        status: 'success',
        data: Topics,
      });
    } catch (error) {
      res.json({
        status: 'error',
        errors: JSON.stringify(error),
      });
    }
  }
}

export const TopicCtrl = new TopicController();
