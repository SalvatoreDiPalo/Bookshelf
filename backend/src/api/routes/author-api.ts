import { NextFunction, Request, Response, Router } from "express";
import Container from "typedi";
import { Logger } from "winston";
import { Joi, celebrate } from "celebrate";
import AuthorService from "../../services/author-service";

const route = Router();

export default (app: Router) => {
  app.use("/authors", route);

  route.post(
    "/",
    celebrate({
      body: Joi.array().items(Joi.number()),
    }),
    async (req: Request, res: Response, next: NextFunction) => {
      const logger: Logger = Container.get("logger");
      logger.debug("Calling GetAuthors endpoint with body: %o", req.body);
      try {
        const authorServiceInstance = Container.get(AuthorService);
        const resultDTO = await authorServiceInstance.getAuthors(
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
