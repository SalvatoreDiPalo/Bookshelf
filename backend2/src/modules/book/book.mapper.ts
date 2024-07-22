import { Book, BookSchema, BookWithRelations, BookWithRelationsSchema } from "./book.validation";
import { Author } from "../common/author/author.entity";
import { BookFindColumns } from "@/libs/models/book-publisher-columns";

class BookMapper {
  toResponseWithRelations(book: BookFindColumns, authors: Author[] = []): BookWithRelations {
    const bookInfo: BookWithRelations = {
      authors: authors,
      publisher: book.publisherId
        ? { id: book.publisherId, name: book.publisherName }
        : undefined,

      id: book.id,
      isbn: book.isbn,
      title: book.title,
      subTitle: book.subTitle??undefined,
      publishedDate: book.publishedDate,
      description: book.description??undefined,
      pageCount: book.pageCount??undefined,
      language: book.language??undefined,
      createdAt: book.createdAt,
      updatedAt: book.updatedAt,
      bookCoverUrl: book.bookCoverUrl??undefined,
      groupId: book.groupId,
      stateId: book.stateId,
      bookId: book.bookId,
      isFavorite: book.isFavorite??false,
    };
    return BookWithRelationsSchema.parse(bookInfo);
  }
}

export const bookMapperInstance = new BookMapper();
