import { query } from "@/libs/utils/database";
import { Book } from "./book.validation";

class BookRepository {
  async findOneByIsbn(isbn: string): Promise<Book | undefined> {
    const result = await query(
      `
        SELECT bo.* FROM public."book" bo WHERE bo."isbn" = $1
      `,
      [isbn]
    );

    const rows: Book[] = result.rows;
    return rows.length ? rows[0] : undefined;
  }

  async insert(book: Book): Promise<Book> {
    const result = await query(
      `
        INSERT INTO public.book ("bookId", isbn, title, "subTitle", description, "publishedDate", "bookCoverId", "pageCount", "createdDate", "updatedDate", "publisherId")
        VALUES($1, $2, $3, $4, $5, $6, $7, $8, now(), now(), $9);
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
