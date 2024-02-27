import dotenv from 'dotenv';
import { Algorithm } from 'jsonwebtoken';

dotenv.config();

const CONFIG = {
  env: process.env.NODE_ENV,
  server: {
    port: 8085,
    url: process.env.SERVER_URL,
  },
  emails: {
    noReplyMail: 'no-reply@minhaserra.com',
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
    jwtExpirationHours: 6,
    algorithm: 'HS512' as Algorithm,
  },
};

export default CONFIG;
