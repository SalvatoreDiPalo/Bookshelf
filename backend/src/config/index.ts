import * as dotenv from "dotenv";

// Set the NODE_ENV to 'development' by default
process.env.NODE_ENV = process.env.NODE_ENV || "development";

const envFound = dotenv.config();
if (envFound.error) {
  // This error should crash whole process

  throw new Error("⚠️  Couldn't find .env file  ⚠️");
}
export const config = {
  /**
   * Your favorite port
   */
  port: process.env.SERVER_PORT || 3000,

  /**
   * Database stuff
   */
  database: {
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT) || 5432,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    databaseName: process.env.DB_NAME,
  },

  /**
   * Your secret sauce
   */
  googleUrl: process.env.GOOGLE_BOOKS_URL,

  /**
   * Used by winston logger
   */
  logs: {
    level: process.env.LOG_LEVEL || "silly",
  },

  /**
   * Logto.io stuff
   */
  logto: {
    jwks: process.env.LOGTO_JWKS || "",
    issuer: process.env.LOGTO_ISSUER || "",
    baseUrl: process.env.LOGTO_BASEURL || "",
  },

  /**
   * API configs
   */
  api: {
    prefix: "/api",
  },
};
