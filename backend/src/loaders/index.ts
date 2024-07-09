import Logger from "./logger";
import { dependencyInjectorLoader } from "./dependencyInjector";
import { dataSource } from "./data-source";
import { expressLoader } from "./express";

export default async ({ expressApp }) => {
  const dbConnection = await dataSource();
  Logger.info("✌️ DB loaded and connected!");

  await dependencyInjectorLoader(dbConnection);

  await expressLoader({ app: expressApp });
  Logger.info("✌️ Express loaded");
};
