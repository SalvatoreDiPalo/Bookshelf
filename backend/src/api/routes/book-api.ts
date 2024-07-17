import { NextFunction, Request, Response, Router } from "express";
import { verifyAuthFromRequest } from "../middlewares/auth_middleware";
import Container from "typedi";
import BookService from "../../services/book-service";
import { Logger } from "winston";
import {
  isbnAndStateIdParams,
  isbnParam,
  isFavoriteQuery,
  searchQuery,
} from "../validators/book-validators";

const route = Router();

export default (app: Router) => {
  app.use("/books", route);

  route.get(
    "/isbn/:isbn",
    isbnParam,
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
    "/isbn/:isbn",
    isbnParam,
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
    searchQuery,
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
          String(req.query.sortBy),
          req.query.isFavorite
            ? Boolean(req.query.isFavorite ?? "false")
            : undefined,
          req.query.stateId ? Number(req.query.stateId ?? "0") : undefined
        );
        return res.status(200).json(bookDto);
      } catch (e) {
        logger.error("🔥 error: %o", e);
        return next(e);
      }
    }
  );

  route.get(
    "/stats",
    verifyAuthFromRequest,
    async (req: Request, res: Response, next: NextFunction) => {
      const logger: Logger = Container.get("logger");
      logger.debug("Calling getPersonalShelfStats endpoint");
      try {
        const bookServiceInstance = Container.get(BookService);
        const statsDTO = await bookServiceInstance.getPersonalShelfStats(
          req.currentUser
        );
        return res.status(200).json(statsDTO);
      } catch (e) {
        logger.error("🔥 error: %o", e);
        return next(e);
      }
    }
  );

  route.get(
    "/isbn/:isbn/check-shelf",
    isbnParam,
    verifyAuthFromRequest,
    async (req: Request, res: Response, next: NextFunction) => {
      const logger: Logger = Container.get("logger");
      logger.debug("Calling checkIsbnInPersonalShelf endpoint");
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

  route.patch(
    "/isbn/:isbn/favorite",
    isbnParam,
    isFavoriteQuery,
    verifyAuthFromRequest,
    async (req: Request, res: Response, next: NextFunction) => {
      const logger: Logger = Container.get("logger");
      logger.debug(
        "Calling updateFavoriteBookFlag endpoint with param: %o",
        req.params.isbn
      );
      try {
        const bookServiceInstance = Container.get(BookService);
        const book = await bookServiceInstance.updateFavoriteBookFlag(
          req.currentUser,
          req.params.isbn,
          Boolean(req.query.isFavorite)
        );
        return res.status(200).json(book);
      } catch (e) {
        logger.error("🔥 error: %o", e);
        return next(e);
      }
    }
  );

  route.patch(
    "/isbn/:isbn/state/:stateId",
    isbnAndStateIdParams,
    verifyAuthFromRequest,
    async (req: Request, res: Response, next: NextFunction) => {
      const logger: Logger = Container.get("logger");
      logger.debug(
        "Calling updateBookStatusInShelf endpoint with params: %o",
        req.params
      );
      try {
        const bookServiceInstance = Container.get(BookService);
        const book = await bookServiceInstance.updateBookStatusInShelf(
          req.currentUser,
          req.params.isbn,
          Number(req.params.stateId ?? "-1")
        );
        return res.status(200).json(book);
      } catch (e) {
        logger.error("🔥 error: %o", e);
        return next(e);
      }
    }
  );

  route.patch(
    "/isbn/:isbn/state",
    isbnParam,
    verifyAuthFromRequest,
    async (req: Request, res: Response, next: NextFunction) => {
      const logger: Logger = Container.get("logger");
      logger.debug(
        "Calling removeBookStatusInShelf endpoint with param: %o",
        req.params.isbn
      );
      try {
        const bookServiceInstance = Container.get(BookService);
        const book = await bookServiceInstance.removeBookStatusInShelf(
          req.currentUser,
          req.params.isbn
        );
        return res.status(200).json(book);
      } catch (e) {
        logger.error("🔥 error: %o", e);
        return next(e);
      }
    }
  );
};
