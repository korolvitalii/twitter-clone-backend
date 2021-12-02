import { Schema, model, Document } from 'mongoose';

export interface TweetModelInterface {
  _id?: string;
  text: string;
  user?: string;
}

export type TweetModellDocumentInterface = TweetModelInterface & Document;

const TweetSchema = new Schema<TweetModelInterface>({
  text: {
    required: true,
    type: String,
    minlength: 1,
    maxLength: 280,
  },
  user: {
    // required: true,
    ref: 'User',
    type: Schema.Types.ObjectId,
  },
});

export const TweetModel = model<TweetModellDocumentInterface>('Tweet', TweetSchema);
