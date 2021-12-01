import { body } from 'express-validator';

export const createTweetValidation = [
  body('text', 'Set text')
    .isString()
    .isLength({
      max: 280,
    })
    .withMessage('wrong email length'),
];
