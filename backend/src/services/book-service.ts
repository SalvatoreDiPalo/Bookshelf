import { AppDataSource } from "../data-source";
import { BookDTO } from "../models/dto/book-dto";
import { Author } from "../models/entity/Author";
import { Book } from "../models/entity/Book";
import { Publisher } from "../models/entity/Publisher";
import { scrapeBookByIsbn } from "./google";

const authorRepository = AppDataSource.getRepository(Author);
const publisherRepository = AppDataSource.getRepository(Publisher);
const bookRepository = AppDataSource.getRepository(Book);

export const getBookByIsbn = async (isbn: string) => {
  const book = await bookRepository.findOne({
    relations: {
      publisher: true,
      authors: true,
    },
    where: {
      isbn: isbn,
    },
  });
  if (book === null) {
    // TODO throw exception
    return null;
  }

  console.log("Book ", book);
  // TODO handle date
  // TODO handle isFavorite and groupId
  return {
    isbn: isbn,
    title: book.title,
    subtitle: book.subTitle,
    publishedDate: book.publishedDate,
    description: book.description,
    pageCount: book.pageCount,
    createdAt: "",
    updatedAt: "",
    publisher: {
      id: book.publisher.id,
      name: book.publisher.name,
    },
    bookCoverUrl: book.bookCoverId,
    authors: book.authors.map((author) => {
      return {
        id: author.id,
        name: author.name,
      };
    }),
  } as BookDTO;
};

export async function scrapeBook(isbn: string, res: any) {
  let bookResponse;
  try {
    bookResponse = await scrapeBookByIsbn(isbn);
  } catch (err) {
    console.error(err);
    return res.status(404).send({
      code: 500,
      message: "Could not load data from Google API",
    });
  }

  if (
    bookResponse.data.totalItems == 0 ||
    bookResponse.data.items.length == 0
  ) {
    // TODO create an error handler and dto
    return res.status(404).send({
      code: 404,
      message: "The volume could not be found.",
    });
  }

  console.log("Founded elements", bookResponse.data.items.length);
  const firstItem = bookResponse.data.items[0];

  const authors: Author[] = firstItem.volumeInfo.authors.map((author) => {
    return {
      name: author,
    };
  });
  await authorRepository.upsert(authors, ["name"]);
  console.log("authors", authors);

  let publisher: Publisher = {
    name: firstItem.volumeInfo.publisher,
  };
  await publisherRepository.upsert(publisher, ["name"]);
  console.log("publisher", publisher);

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

  await bookRepository.save(bookInfo);
}
