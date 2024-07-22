import { query } from "@/libs/utils/database";
import { Book, BookWithRelations } from "./book.validation";
import { QueryResult } from "pg";
import { BookFindColumns } from "@/libs/models/book-publisher-columns";
import { bookMapperInstance } from "./book.mapper";

class BookRepository {
  async findOneByIsbn(isbn: string): Promise<Book | undefined> {
    const result = await query(
      `
        SELECT bo.* FROM public."book" bo WHERE bo."isbn" = $1;
      `,
      [isbn]
    );

    const rows: Book[] = result.rows;
    return rows.length ? rows[0] : undefined;
  }

  async findOneWithRelationsByIsbn(
    isbn: string
  ): Promise<BookWithRelations | undefined> {
    const result: QueryResult<BookFindColumns> = await query(
      `
        SELECT bo.*, p.name as "publisherName"
        FROM public."book" bo
        LEFT JOIN publisher p ON bo."publisherId" = p.id
        WHERE bo."isbn" = $1;
      `,
      [isbn]
    );

    const rows: BookFindColumns[] = result.rows;
    if (!rows.length) {
      return undefined;
    }
    return bookMapperInstance.toResponseWithRelations(rows[0]);
  }

  async insert(book: BookWithRelations): Promise<Book> {
    const result = await query(
      `
        INSERT INTO public.book ("bookId", isbn, title, "subTitle", description, "publishedDate", "bookCoverId", "pageCount", "createdDate", "updatedDate", "publisherId")
        VALUES($1, $2, $3, $4, $5, $6, $7, $8, now(), now(), $9) RETURNING *;
      `,
      [
        book.bookId,
        book.isbn,
        book.title,
        book.subTitle,
        book.description,
        book.publishedDate,
        null,
        book.pageCount,
        book.publisher ? book.publisher.id : null,
      ]
    );

    return result.rows[0];
  }
}

export const bookRepositoryInstance = new BookRepository();
