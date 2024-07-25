import { StatusCodes } from "http-status-codes";
import { ServiceResponse } from "@/libs/models/serviceResponse";
import { logger } from "@/server";
import { Book, BookWithRelations } from "../../common/book/book.entity";
import { authorRepositoryInstance } from "@/modules/common/author/author.repository";
import { Author } from "@/modules/common/author/author.entity";
import { Publisher } from "@/modules/common/publisher/publisher.entity";
import { publisherRepositoryInstance } from "@/modules/common/publisher/publisher.repository";
import { bookRepositoryInstance } from "../../common/book/book.repository";
import { CreateBook } from "./create-book.validation";
import { userRepositoryInstance } from "@/modules/common/user/user.repository";
import { getClient } from "@/libs/utils/database";
import { bookAuthorsRepositoryInstance } from "@/modules/common/bookAuthors/bookAuthors.repository";

class CreateBookService {
  // Create Book
  // Probabilmente la transaction non funziona!
  async createBook(
    bookToCreate: CreateBook,
    userJwtId: string
  ): Promise<ServiceResponse<BookWithRelations | null>> {
    const client = await getClient();
    try {
      let user = await userRepositoryInstance.findOneByUserId(userJwtId);
      if (!user) {
        logger.error("User not found");
        return ServiceResponse.failure(
          "User not found",
          null,
          StatusCodes.UNAUTHORIZED
        );
      }

      let book = await bookRepositoryInstance.findOneWithRelationsByIsbn(
        bookToCreate.isbn
      );
      logger.debug("Isbn %o", bookToCreate.isbn);
      if (book) {
        logger.debug("Book already present, returning it");
        return ServiceResponse.success<BookWithRelations>(book);
      }
      logger.debug("Init transaction");
      await client.query("BEGIN");

      const authors: Author[] = await this.addAuthors(
        bookToCreate.authors.map((author) => author.name)
      );
      logger.debug("Authors added %o", authors);

      let publisher: Publisher | undefined = await this.addPublisher(
        bookToCreate.publisher?.name
      );
      logger.debug("Publisher added %o", publisher);

      bookToCreate.publisherId = publisher?.id;
      logger.debug("Adding book %o", bookToCreate as BookWithRelations);
      const savedBook: Book = await bookRepositoryInstance.insert(
        bookToCreate as BookWithRelations
      );
      logger.debug("Book added %o", savedBook.id);

      this.addAuthorsRelationToBook(authors, savedBook.id!);

      const finalBook: BookWithRelations = {
        ...savedBook,
        authors: authors,
        publisher: publisher,
      };
      await client.query("COMMIT");
      return ServiceResponse.success<BookWithRelations>(finalBook);
    } catch (ex) {
      await client.query("ROLLBACK");
      const errorMessage = `Error inserting book: ${(ex as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        "An error occurred while creating book.",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  private async addAuthors(authorsToAdd: string[]) {
    logger.debug("Moved to addAuthors %o", authorsToAdd);
    const existingAuthors = await authorRepositoryInstance.findAllByNameIn(
      authorsToAdd
    );

    const authors: Author[] = [];
    for (let author of authorsToAdd) {
      let savedAuthor = existingAuthors.find((a) => a.name === author);

      // Se l'autore non esiste, crealo
      if (!savedAuthor) {
        logger.debug("No author named %s inside database. Adding it", author);
        savedAuthor = await authorRepositoryInstance.insert(author);
        logger.debug("Added author -> id: %d", savedAuthor.id);
      }
      authors.push({
        id: savedAuthor.id,
        name: savedAuthor.name,
      });
    }

    return authors;
  }

  private async addPublisher(
    publisherName?: string
  ): Promise<Publisher | undefined> {
    logger.debug("Moved to addPublisher %s", publisherName);
    if (!publisherName) {
      logger.debug("Empty value, so return undefined");
      return;
    }
    let existingPublisher = await publisherRepositoryInstance.findByName(
      publisherName
    );

    if (!existingPublisher) {
      logger.debug(
        "No publisher named %s inside database. Adding it",
        publisherName
      );
      existingPublisher = await publisherRepositoryInstance.insert(
        publisherName
      );
    }

    return existingPublisher;
  }

  private async addAuthorsRelationToBook(
    authors: Author[],
    bookId: number
  ): Promise<void> {
    logger.debug(
      "Moved to addAuthorsRelationToBook with authors=%o , bookId=%d",
      authors,
      bookId
    );
    for (let author of authors) {
      await bookAuthorsRepositoryInstance.insert(author.id!, bookId);
    }
    logger.debug("Added Author x Book relation");
  }
}

export const createBookServiceInstance = new CreateBookService();
