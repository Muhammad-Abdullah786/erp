import dotenvFlow from "dotenv-flow";

dotenvFlow.config();

export default {
  // General
  JWT_SECRET_KEY: process.env.JWT_SECRET_KEY,
  ENV: process.env.ENV,
  PORT: process.env.PORT,
  SERVER_URL: process.env.SERVER_URL,

  // Database
  DATABASE_URL: process.env.DATABASE_URL,

  //Email
  EMAIL_API_KEY: process.env.EMAIL_SERVICE_API_KEY,

  EMAIL_HOST: process.env.EMAIL_HOST,
  EMAIL_PORT: process.env.EMAIL_PORT,
  EMAIL_USER: process.env.EMAIL_USER,
  EMAIL_PASS: process.env.EMAIL_PASS,
  EMAIL_FROM: process.env.EMAIL_FROM,

  //Tokens
  TOKENS: {
    ACCESS: {
      SECRET: process.env.ACCESS_TOKEN_SECRET as string,
      EXPIRY: 3600,
    },
    REFRESH: {
      SECRET: process.env.REFRESH_TOKEN_SECRET as string,
      EXPIRY: 3600 * 24 * 365,
    },
  },
  COUDINARY: {
    CLOUD_NAME: process.env.CLOUD_NAME,
    API_KEY: process.env.API_KEY,
    SECRET_KEY: process.env.SECERET_KEY,
  },
};
