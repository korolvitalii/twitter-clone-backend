import { Schema, model, Document } from 'mongoose';

export interface UserModelInterface {
  _id?: string;
  email: string;
  username: string;
  fullname: string;
  password: any;
  confirmed?: boolean;
  confirmHash: string;
  location?: string;
  about?: string;
  website?: string;
  bigAvatar?: string;
  smallAvatar?: string;
}

export type UserModellDocumentInterface = UserModelInterface & Document;

const UserSchema = new Schema<UserModelInterface>(
  {
    email: {
      unique: true,
      required: true,
      type: String,
    },
    username: {
      unique: true,
      required: true,
      type: String,
    },
    fullname: {
      unique: true,
      required: true,
      type: String,
    },
    bigAvatar: {
      type: String,
    },
    smallAvatar: {
      type: String,
    },
    password: {
      required: true,
      type: String,
    },
    confirmed: {
      type: Boolean,
      default: false,
    },
    confirmHash: {
      required: true,
      type: String,
    },
    location: String,
    about: String,
    website: String,
  },
  {
    timestamps: true,
  },
);

UserSchema.methods.toJSON = function () {
  var obj = this.toObject();
  delete obj.password;
  delete obj.confirmHash;
  return obj;
};
export const UserModel = model<UserModellDocumentInterface>('User', UserSchema);
