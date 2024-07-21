import { StatusCodes } from "http-status-codes";
import { ServiceResponse } from "@/libs/models/serviceResponse";
import { logger } from "@/server";
import { Book } from "../book.validation";
import { googleRepositoryInstance } from "@/modules/common/google/google.repository";
import { GoogleList } from "@/libs/models/google-list";
import { Volume } from "@/libs/models/google-volumes";
import { AxiosResponse } from "axios";
import { authorRepositoryInstance } from "@/modules/common/author/author.repository";
import { Author } from "@/modules/common/author/author.entity";
import { Publisher } from "@/modules/common/publisher/publisher.entity";
import { publisherRepositoryInstance } from "@/modules/common/publisher/publisher.repository";
import { bookMapperInstance } from "../book.mapper";
import { bookRepositoryInstance } from "../book.repository";

class GetBookService {
  // Get Book
  async getBook(isbn: string): Promise<ServiceResponse<Book | null>> {
    try {
      let book = await this.findBookByIsbn(isbn);
      if (book !== null) {
        return ServiceResponse.success<Book>(book);
      }

      const bookScraped: Book = await this.scrapeBook(isbn);

      // TODO insert should return saved book with relations (?)
      bookRepositoryInstance.insert(bookScraped);

      return ServiceResponse.success<Book>(bookScraped);
    } catch (ex) {
      const errorMessage = `Error inserting users: $${(ex as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        "An error occurred while creating user.",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  private async findBookByIsbn(isbn: string): Promise<Book | null> {
    // TODO add find book with relations
    return null;
  }

  private async scrapeBook(isbn: string): Promise<Book> {
    let bookResponse: AxiosResponse<GoogleList<Volume>, any>;
    try {
      bookResponse = await googleRepositoryInstance.scrapeBook(isbn);
    } catch (err) {
      console.error(err);
      // TODO handle error
      throw Error("Could not load data from Google API");
    }

    if (
      bookResponse.data.totalItems == 0 ||
      bookResponse.data.items.length == 0
    ) {
      //TODO handle error
      throw Error("");
      //throw new HttpException(404, "The volume could not be found.");
    }
    const volume: Volume = bookResponse.data.items[0];

    const authors: Author[] = await this.addAuthors(volume.volumeInfo.authors);

    let publisher: Publisher | undefined = await this.addPublisher(
      volume.volumeInfo.publisher
    );

    return bookMapperInstance.toPersistence(isbn, volume, authors, publisher);
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
      }
      authors.push({
        id: savedAuthor.id,
        name: savedAuthor.name,
      });
    }
    logger.debug("Returning %o", authors);

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
    logger.debug("Returning %o", existingPublisher);

    return existingPublisher;
  }
}

export const getBookServiceInstance = new GetBookService();
