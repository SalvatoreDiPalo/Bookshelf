import { NextFunction, Request, Response, Router } from "express";
import Container from "typedi";
import { Logger } from "winston";
import { Joi, celebrate } from "celebrate";
import PublisherService from "../../services/publisher-service";

const route = Router();

export default (app: Router) => {
  app.use("/publishers", route);

  route.post(
    "/",
    celebrate({
      body: Joi.array().items(Joi.number()),
    }),
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
