import { NextFunction, Request, Response, Router } from "express";
import { verifyAuthFromRequest } from "../middlewares/auth_middleware";
import Container from "typedi";
import BookService from "../../services/book-service";
import { Logger } from "winston";

const route = Router();

export default (app: Router) => {
  app.use("/books", route);

  route.get(
    "/:isbn",
    verifyAuthFromRequest,
    async (req: Request, res: Response, next: NextFunction) => {
      const logger: Logger = Container.get("logger");
      logger.debug("Calling GetBook endpoint with param: %o", req.params.isbn);
      try {
        const bookServiceInstance = Container.get(BookService);
        const bookDto = await bookServiceInstance.getBook(req.params.isbn);
        return res.status(200).json(bookDto);
      } catch (e) {
        logger.error("🔥 error: %o", e);
        return next(e);
      }
    }
  );

  route.post(
    "/:isbn",
    verifyAuthFromRequest,
    async (req: Request, res: Response, next: NextFunction) => {
      const logger: Logger = Container.get("logger");
      logger.debug(
        "Calling AddBookToShelf endpoint with param: %o",
        req.params.isbn
      );
      try {
        const bookServiceInstance = Container.get(BookService);
        await bookServiceInstance.addBookToShelf(
          req.currentUser,
          req.params.isbn
        );
        return res.status(201).json();
      } catch (e) {
        logger.error("🔥 error: %o", e);
        return next(e);
      }
    }
  );

  route.get(
    "/",
    verifyAuthFromRequest,
    async (req: Request, res: Response, next: NextFunction) => {
      const logger: Logger = Container.get("logger");
      logger.debug("Calling GetPersonalShelf endpoint");
      try {
        const bookServiceInstance = Container.get(BookService);
        const bookDto = await bookServiceInstance.getPersonalShelf(
          req.currentUser
        );
        return res.status(200).json(bookDto);
      } catch (e) {
        logger.error("🔥 error: %o", e);
        return next(e);
      }
    }
  );
};
