import { Inject, Service } from "typedi";
import { BookDTO } from "../models/dto/book-dto";
import { Author } from "../models/entity/Author-entity";
import { Publisher } from "../models/entity/Publisher-entity";
import { In, Repository } from "typeorm";
import { CurrentUser } from "../models/current-user";
import GoogleService from "./google";
import { ResultDTO } from "../models/dto/result-dto";
import { HttpException } from "../models/exceptions/http-exception";
import { PaginateDTO } from "../models/dto/paginate-dto";
import { Volume } from "../models/google-volumes";
import { User } from "../models/entity/User-entity";
import { Book } from "../models/entity/Book-entity";
import { UserBookState } from "../models/entity/UserBookState-entity";

@Service()
export default class BookService {
  constructor(
    @Inject("BookRepository") private readonly bookRepository: Repository<Book>,
    @Inject("AuthorRepository")
    private readonly authorRepository: Repository<Author>,
    @Inject("PublisherRepository")
    private readonly publisherRepository: Repository<Publisher>,
    @Inject("UserRepository")
    private readonly userRepository: Repository<User>,
    @Inject("UserBookStateRepository")
    private readonly userBookStateRepository: Repository<UserBookState>,
    @Inject() private readonly googleService: GoogleService,
    @Inject("logger") private readonly logger
  ) {}

  public async getPersonalShelf(
    user: CurrentUser,
    paginate: PaginateDTO,
    sort: string = "title"
  ): Promise<ResultDTO<BookDTO>> {
    const skip = (paginate.page - 1) * paginate.pageSize;
    let books: [Book[], number] = await this.bookRepository.findAndCount({
      where: {
        userBookStates: {
          user: {
            userId: user.sub,
          },
        },
      },
      relations: {
        authors: true,
        publisher: true,
      },
      take: paginate.pageSize,
      skip,
      order: {
        [sort]: "asc",
      },
    });
    this.logger.debug(
      "Founded %d books associated to user %s",
      books[1],
      user.sub
    );
    const resultDTO: ResultDTO<BookDTO> = {
      totalItems: books[1],
      items: books[0].map((book) => this.mapBook(book)),
    };

    return resultDTO;
  }

  public async checkIsbnInPersonalShelf(
    user: CurrentUser,
    isbn: string
  ): Promise<boolean> {
    let exists: boolean = await this.bookRepository.exists({
      where: {
        userBookStates: {
          user: {
            userId: user.sub,
          },
        },
        isbn: isbn,
      },
    });
    this.logger.debug(
      "Exists book with isbn=%s books associated to user %s",
      isbn,
      user.sub
    );

    return exists;
  }

  public async addBookToShelf(
    user: CurrentUser,
    isbn: string
  ): Promise<BookDTO> {
    let book = await this.findBookByIsbn(isbn);
    if (book === null) {
      throw new HttpException(404, "The book could not be found.");
    }
    this.logger.debug("Book founded: %s", book.title);
    const dbUser: User = await this.userRepository.findOneBy({
      userId: user.sub,
    });
    if (!dbUser) {
      this.logger.error("Could not found the user");
      throw new HttpException(404, "The user could not be found.");
    }
    this.logger.debug("User founded: %o", dbUser.username);

    this.logger.debug(
      "Current users associated to this book: %s",
      book.userBookStates ?? [].length
    );

    const alreadyExistsInShelf = await this.userBookStateRepository.exists({
      where: {
        userId: dbUser.id,
        bookId: book.id,
      },
    });

    if (alreadyExistsInShelf) {
      this.logger.error("Book already exists in shelf");
      throw new HttpException(400, "Book already exists in shelf");
    }

    const userBookState = await this.userBookStateRepository.save({
      bookId: book.id,
      book: book,
      isFavorite: false,
      userId: dbUser.id,
    });
    this.logger.debug("Added Book to the shelf %o", userBookState);
    return this.mapBook(book);
  }

  public async getBook(isbn: string): Promise<BookDTO> {
    let book = await this.findBookByIsbn(isbn);
    if (book !== null) return this.mapBook(book);

    await this.scrapeBook(isbn);

    return await this.getBookByIsbn(isbn);
  }

  public async getBookByIsbn(isbn: string): Promise<BookDTO> {
    const book = await this.findBookByIsbn(isbn);
    if (book === null) {
      throw new HttpException(404, "The volume could not be found.");
    }

    // TODO handle isFavorite and groupId
    return this.mapBook(book);
  }

  public async scrapeBook(isbn: string): Promise<void> {
    let bookResponse;
    try {
      bookResponse = await this.googleService.scrapeBookByIsbn(isbn);
    } catch (err) {
      console.error(err);
      throw Error("Could not load data from Google API");
    }

    if (
      bookResponse.data.totalItems == 0 ||
      bookResponse.data.items.length == 0
    ) {
      throw new HttpException(404, "The volume could not be found.");
    }

    console.log("Founded elements", bookResponse.data.items.length);
    const firstItem: Volume = bookResponse.data.items[0];

    const authors: Author[] = await this.addAuthors(
      firstItem.volumeInfo.authors
    );

    let publisher: Publisher = await this.addPublisher(
      firstItem.volumeInfo.publisher
    );

    // TODO handle cover id
    const bookInfo: Book = {
      isbn: isbn,
      bookId: firstItem.id,
      title: firstItem.volumeInfo.title,
      subTitle: firstItem.volumeInfo.subtitle,
      publishedDate: firstItem.volumeInfo.publishedDate,
      description: firstItem.volumeInfo.description,
      pageCount: firstItem.volumeInfo.pageCount,
      publisher: publisher,
      authors: authors,
    };
    this.logger.debug("Adding book %o", bookInfo);
    await this.bookRepository.save(bookInfo);
  }

  private async findBookByIsbn(isbn: string): Promise<Book | null> {
    return await this.bookRepository.findOne({
      relations: {
        publisher: true,
        authors: true,
      },
      where: {
        isbn: isbn,
      },
    });
  }

  private mapBook(book: Book): BookDTO {
    return {
      isbn: book.isbn,
      title: book.title,
      subtitle: book.subTitle,
      publishedDate: book.publishedDate,
      description: book.description,
      pageCount: book.pageCount,
      createdAt: book.createdDate,
      updatedAt: book.updatedDate,
      publisher: book.publisher
        ? {
            id: book.publisher.id,
            name: book.publisher.name,
          }
        : undefined,
      bookCoverUrl: book.bookCoverId,
      authors: book.authors.map((author) => {
        return {
          id: author.id,
          name: author.name,
        };
      }),
    } as BookDTO;
  }

  private async addPublisher(
    publisherName?: string
  ): Promise<Publisher | undefined> {
    this.logger.debug("Moved to addPublisher %s", publisherName);
    if (!publisherName) {
      this.logger.debug("Empty value, so return undefined");
      return;
    }
    let existingPublisher = await this.publisherRepository.findOne({
      where: { name: publisherName },
    });

    if (!existingPublisher) {
      this.logger.debug(
        "No publisher named %s inside database. Adding it",
        publisherName
      );
      existingPublisher = await this.publisherRepository.save({
        name: publisherName,
      });
    }
    this.logger.debug("Returning %o", existingPublisher);

    return existingPublisher;
  }

  private async addAuthors(authorsToAdd: string[]): Promise<Author[]> {
    this.logger.debug("Moved to addAuthors %o", authorsToAdd);
    const existingAuthors = await this.authorRepository.find({
      where: { name: In(authorsToAdd) },
    });

    const authors: Author[] = [];
    for (let author of authorsToAdd) {
      let savedAuthor = existingAuthors.find((a) => a.name === author);

      // Se l'autore non esiste, crealo
      if (!savedAuthor) {
        this.logger.debug(
          "No author named %s inside database. Adding it",
          author
        );
        savedAuthor = await this.authorRepository.save({
          name: author,
        });
      }
      authors.push({
        id: savedAuthor.id,
        name: savedAuthor.name,
      });
    }
    this.logger.debug("Returning %o", authors);

    return authors;
  }
}
