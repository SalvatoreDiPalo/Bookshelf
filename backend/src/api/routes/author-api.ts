import { NextFunction, Request, Response, Router } from "express";
import Container from "typedi";
import { Logger } from "winston";
import AuthorService from "../../services/author-service";
import { authorsIdBody } from "../validators/author-validators";

const route = Router();

export default (app: Router) => {
  app.use("/authors", route);

  route.get(
    "/",
    authorsIdBody,
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
