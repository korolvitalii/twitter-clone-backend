import { Schema, model, Document } from 'mongoose';

export interface TopicModelInterface {
  _id?: string;
  topicName: string;
  content: string;
}

export type TopicModellDocumentInterface = TopicModelInterface & Document;

const TopicSchema = new Schema<any>({
  topicName: {
    required: true,
    type: String,
    minlength: 1,
    maxLength: 100,
  },
  content: {
    required: true,
    type: String,
    minlength: 1,
    maxLength: 100,
  },
});

export const TopicModel = model<any>('Topic', TopicSchema);
