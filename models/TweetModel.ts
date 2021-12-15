import { Schema, model, Document } from 'mongoose';
import { UserModelInterface, UserModellDocumentInterface } from './UserModel';

export interface TweetModelInterface {
  _id?: string;
  text: string;
  user: UserModelInterface;
}

export type TweetModellDocumentInterface = TweetModelInterface & Document;

const TweetSchema = new Schema<any>(
  {
    text: {
      required: true,
      type: String,
      minlength: 1,
      maxLength: 280,
    },
    user: {
      required: true,
      ref: 'User',
      type: Schema.Types.ObjectId,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
  },
);

export const TweetModel = model<any>('Tweet', TweetSchema);
