import crypto from 'crypto';
import bcrypt from 'bcrypt';

export const generateMDS = (value: string): string => {
  return crypto.createHash('md5').update(value).digest('hex');
};

export const generateBcrypt = (value: string): string => bcrypt.hashSync(value, 5);

const saltRounds = process.env.SALT_ROUNT || 5;

export const comparePassword = (password: any, password2: any): boolean => {
  let isValid = false;
  bcrypt.compare(password2, password, function (err, result) {
    if (result) {
      isValid = true;
      console.log('It matches!');
    } else {
      console.log('Invalid password!');
    }
  });
  return isValid;
};
