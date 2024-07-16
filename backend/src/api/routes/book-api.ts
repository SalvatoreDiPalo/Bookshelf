import { NextFunction, Request, Response, Router } from "express";
import { verifyAuthFromRequest } from "../middlewares/auth_middleware";
import Container from "typedi";
import BookService from "../../services/book-service";
import { Logger } from "winston";
import { Joi, celebrate } from "celebrate";

const route = Router();

export default (app: Router) => {
  app.use("/books", route);

  route.get(
    "/:isbn",
    celebrate({
      params: {
        isbn: Joi.string().required(),
      },
    }),
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
    celebrate({
      params: {
        isbn: Joi.string().required(),
      },
    }),
    verifyAuthFromRequest,
    async (req: Request, res: Response, next: NextFunction) => {
      const logger: Logger = Container.get("logger");
      logger.debug(
        "Calling AddBookToShelf endpoint with param: %o",
        req.params.isbn
      );
      try {
        const bookServiceInstance = Container.get(BookService);
        const book = await bookServiceInstance.addBookToShelf(
          req.currentUser,
          req.params.isbn
        );
        return res.status(201).json(book);
      } catch (e) {
        logger.error("🔥 error: %o", e);
        return next(e);
      }
    }
  );

  route.get(
    "/",
    celebrate({
      query: {
        page: Joi.number().positive().default(1),
        pageSize: Joi.number().positive().default(20),
        sortBy: Joi.string().default("title"),
      },
    }),
    verifyAuthFromRequest,
    async (req: Request, res: Response, next: NextFunction) => {
      const logger: Logger = Container.get("logger");
      logger.debug("Calling GetPersonalShelf endpoint");
      try {
        const bookServiceInstance = Container.get(BookService);
        const bookDto = await bookServiceInstance.getPersonalShelf(
          req.currentUser,
          {
            page: Number(req.query.page),
            pageSize: Number(req.query.pageSize),
          },
          String(req.query.sortBy)
        );
        return res.status(200).json(bookDto);
      } catch (e) {
        logger.error("🔥 error: %o", e);
        return next(e);
      }
    }
  );

  route.get(
    "/:isbn/check-shelf",
    celebrate({
      params: {
        isbn: Joi.string().required(),
      },
    }),
    verifyAuthFromRequest,
    async (req: Request, res: Response, next: NextFunction) => {
      const logger: Logger = Container.get("logger");
      logger.debug("Calling CheckPersonalShelf endpoint");
      try {
        const bookServiceInstance = Container.get(BookService);
        const existsBookInUserShelf: boolean =
          await bookServiceInstance.checkIsbnInPersonalShelf(
            req.currentUser,
            req.params.isbn
          );
        return res.status(200).json({ exists: existsBookInUserShelf });
      } catch (e) {
        logger.error("🔥 error: %o", e);
        return next(e);
      }
    }
  );
};
