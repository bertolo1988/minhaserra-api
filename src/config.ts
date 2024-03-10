import dotenv from 'dotenv';
import { Algorithm } from 'jsonwebtoken';
import CONSTANTS from './constants';

dotenv.config();

const CONFIG = {
  env: process.env.NODE_ENV,
  ui: {
    url: process.env.UI_URL,
  },
  server: {
    port: parseInt(process.env.SERVER_PORT as string),
    url: process.env.SERVER_URL,
  },
  emails: {
    noReplyMail: CONSTANTS.NO_REPLY_EMAIL_ADDRESS,
  },
  aws: {
    region: process.env.AWS_REGION,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
  database: {
    host: process.env.POSTGRES_HOST,
    database: process.env.POSTGRES_DATABASE,
    port: parseInt(process.env.POSTGRES_PORT as string),
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
  },
  authentication: {
    jwtSecret: process.env.JWT_SECRET as string,
    jwtExpirationHours: CONSTANTS.JWT_EXPIRATION_HOURS,
    algorithm: CONSTANTS.JWT_ALGORITHM as Algorithm,
  },
};

export default CONFIG;
