import { Inject, Service } from "typedi";
import { BookDTO } from "../models/dto/book-dto";
import { Author } from "../models/entity/Author";
import { Book } from "../models/entity/Book";
import { Publisher } from "../models/entity/Publisher";
import { Repository } from "typeorm";
import { User } from "../models/entity/User";
import { CurrentUser } from "../models/current-user";
import GoogleService from "./google";
import { ResultDTO } from "../models/dto/result-dto";
import { HttpException } from "../models/exceptions/http-exception";

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
    @Inject() private readonly googleService: GoogleService,
    @Inject("logger") private readonly logger
  ) {}

  public async getPersonalShelf(
    user: CurrentUser
  ): Promise<ResultDTO<BookDTO>> {
    let books: [Book[], number] = await this.bookRepository.findAndCount({
      where: {
        users: {
          userId: user.sub,
        },
      },
      relations: {
        authors: true,
        publisher: true
      }
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

  public async addBookToShelf(user: CurrentUser, isbn: string): Promise<void> {
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
    const bookUsers: User[] = book.users || [];
    this.logger.debug(
      "Current users associated to this book: %s",
      bookUsers.length
    );
    bookUsers.push(dbUser);
    book.users = bookUsers;
    await this.bookRepository.save(book);
    this.logger.debug("User x Book done");
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
    const firstItem = bookResponse.data.items[0];

    const authors: Author[] = firstItem.volumeInfo.authors.map((author) => {
      return {
        name: author,
      };
    });
    console.log("authors", authors);
    await this.authorRepository.upsert(authors, ["name"]);

    let publisher: Publisher = {
      name: firstItem.volumeInfo.publisher,
    };
    console.log("publisher", publisher);
    if (firstItem.volumeInfo.publisher) {
      await this.publisherRepository.upsert(publisher, ["name"]);
    }

    // TODO handle cover id
    const bookInfo: Book = {
      isbn: isbn,
      bookId: firstItem.id,
      title: firstItem.volumeInfo.title,
      subTitle: firstItem.volumeInfo.subtitle,
      publishedDate: firstItem.volumeInfo.publishedDate,
      description: firstItem.volumeInfo.description,
      pageCount: firstItem.volumeInfo.pageCount,
      publisher: firstItem.volumeInfo.publisher ? publisher : undefined,
      authors: authors,
    };

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
}
