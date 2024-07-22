import dotenv from "dotenv";
import { cleanEnv, host, num, port, str, testOnly, url } from "envalid";

dotenv.config();

export const env = cleanEnv(process.env, {
  NODE_ENV: str({
    devDefault: testOnly("test"),
    choices: ["development", "production", "test"],
  }),
  LOG_LEVEL: str({
    devDefault: testOnly("debug"),
    choices: ["fatal", "error", "warn", "info", "debug", "trace"],
  }),
  HOST: host({ devDefault: testOnly("localhost") }),
  PORT: port({ devDefault: testOnly(3000) }),
  CORS_ORIGIN: str({ devDefault: testOnly("http://localhost:3000") }),
  COMMON_RATE_LIMIT_MAX_REQUESTS: num({ devDefault: testOnly(1000) }),
  COMMON_RATE_LIMIT_WINDOW_MS: num({ devDefault: testOnly(1000) }),

  // Database
  DB_HOST: host({ devDefault: testOnly("localhost") }),
  DB_PORT: port({ devDefault: testOnly(5432) }),
  DB_USERNAME: str({ devDefault: testOnly("postgres") }),
  DB_PASSWORD: str({ devDefault: testOnly("admin") }),
  DB_NAME: str({ devDefault: testOnly("postgres") }),

  // Google Books
  GOOGLE_BOOKS_URL: url(),

  // LogTo
  LOGTO_JWKS: url(),
  LOGTO_ISSUER: url(),
  LOGTO_BASE_URL: url(),

  // Default States
  DEFAULT_IN_PROGRESS: str({ default: "In Progress" }),
  DEFAULT_FINISHED: str({ default: "Finished" }),
});
