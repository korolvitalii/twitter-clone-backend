import mongoose from 'mongoose';

export const isValidId = (id: string): boolean => {
  return mongoose.Types.ObjectId.isValid(id);
};
