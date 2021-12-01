import crypto from 'crypto';
import bcrypt from 'bcrypt';

export const generateMDS = (value: string): string => {
  return crypto.createHash('md5').update(value).digest('hex');
};

export const generateBcrypt = (value: string): string => bcrypt.hashSync(value, 5);

export const comparePassword = (password: string, password2: string): boolean => {
  let isValid = false;
  bcrypt.compare(password2, password, function (_, result) {
    if (result) {
      isValid = true;
    }
  });
  return isValid;
};
