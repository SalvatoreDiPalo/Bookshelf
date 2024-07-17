import { NextFunction, Request, Response, Router } from "express";
import Container from "typedi";
import { Logger } from "winston";
import PublisherService from "../../services/publisher-service";
import { publishersIdBody } from "../validators/publisher-validators";

const route = Router();

export default (app: Router) => {
  app.use("/publishers", route);

  route.post(
    "/",
    publishersIdBody,
    async (req: Request, res: Response, next: NextFunction) => {
      const logger: Logger = Container.get("logger");
      logger.debug("Calling GetPublishers endpoint with body: %o", req.body);
      try {
        const publisherServiceInstance = Container.get(PublisherService);
        const resultDTO = await publisherServiceInstance.getPublishers(
          req.body as number[]
        );
        return res.status(200).json(resultDTO);
      } catch (e) {
        logger.error("🔥 error: %o", e);
        return next(e);
      }
    }
  );
};
