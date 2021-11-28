import crypto from 'crypto';
import bcrypt from 'bcrypt';

export const generateMDS = (value: string): string => {
  return crypto.createHash('md5').update(value).digest('hex');
};

export const generateBcrypt = (value: string): string => bcrypt.hashSync(value, 5);
