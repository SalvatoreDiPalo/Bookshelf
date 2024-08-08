import cors from "cors";
import express, { type Express } from "express";
import helmet from "helmet";
import { pino } from "pino";

import { openAPIRouter } from "@/api-docs/openAPIRouter";
import { healthCheckRouter } from "@/modules/healthCheck/healthCheckRouter";
import errorHandler from "@/libs/middleware/errorHandler";
import rateLimiter from "@/libs/middleware/rateLimiter";
import requestLogger from "@/libs/middleware/requestLogger";
import { env } from "@/libs/utils/envConfig";
import { stateRouter } from "./modules/state/state.registry";
import { bookRouter } from "./modules/book/book.registry";
import { libraryRouter } from "./modules/library/library.registry";

const logger = pino({ name: "server start", level: env.LOG_LEVEL });
const app: Express = express();

// Set the application to trust the reverse proxy
app.set("trust proxy", true);

// Middlewares
//app.use(cors({ origin: env.CORS_ORIGIN, credentials: true }));
app.use(cors());
app.use(helmet());
app.use(express.json());
//app.use(rateLimiter);
app.use(express.static(__dirname));

// Request logging
app.use(requestLogger);

// Routes
app.use("/health-check", healthCheckRouter);
app.use("/states", stateRouter);
app.use("/books", bookRouter);
app.use("/library", libraryRouter);

// Swagger UI
//app.use(openAPIRouter);

// Error handlers
app.use(errorHandler());

export { app, logger };
