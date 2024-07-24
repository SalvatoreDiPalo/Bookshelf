import { query } from "@/libs/utils/database";
import { Book, BookWithRelations } from "./book.entity";
import { QueryResult } from "pg";
import { BookDbWithRelations, bookMapperInstance } from "./book.mapper";

class BookRepository {
  async findOneByIsbn(isbn: string): Promise<Book | undefined> {
    const result = await query(
      `
        SELECT bo.* FROM public."books" bo WHERE bo."isbn" = $1;
      `,
      [isbn]
    );

    const rows: Book[] = result.rows;
    return rows.length ? rows[0] : undefined;
  }

  async findOneWithRelationsById(
    id: number,
    userId?: number
  ): Promise<BookWithRelations | undefined> {
    const result: QueryResult<BookDbWithRelations> = await query(
      `
        SELECT 
        b."id" AS "id", 
        b."isbn" AS "isbn", 
        b."title" AS "title", 
        b."subTitle" AS "subTitle", 
        b."description" AS "description",
        b."publishedDate" AS "publishedDate", 
        b."bookCoverId" AS "Book_bookCoverId", 
        b."pageCount" AS "pageCount", 
        b."createdDate" AS "createdAt",
        b."updatedDate" AS "updatedAt", 
        b."publisherId" AS "publisherId", 
        pub."id" AS "publisherId", 
        pub."name" AS "publisherName", 
        ubs."id" AS "ubsId",
        ubs."userId" AS "userId", 
        ubs."stateId" AS "stateId",
        ubs."isFavorite" AS "isFavorite",
        ARRAY(
              SELECT json_build_object('id', aut."id", 'name', aut."name")
              FROM "authors" aut
              INNER JOIN "book_authors" bAut ON aut."id" = bAut."authorId"
              WHERE bAut."bookId" = b."id"
            ) AS "authors"
        FROM "books" b 
        LEFT JOIN "publishers" pub ON pub."id"=b."publisherId"  
        LEFT JOIN "library" ubs ON ubs."bookId"=b."id"  
        WHERE b."id" = $1 AND ($2::int IS NULL OR ubs."userId" = $2);
      `,
      [id, userId ?? null]
    );

    const rows: BookDbWithRelations[] = result.rows;
    if (!rows.length) {
      return undefined;
    }
    return bookMapperInstance.toResponseWithRelations(rows[0]);
  }

  async findOneWithRelationsByIsbn(
    isbn: string,
    userId?: number
  ): Promise<BookWithRelations | undefined> {
    const result: QueryResult<BookDbWithRelations> = await query(
      `
        SELECT 
        b."id" AS "id", 
        b."isbn" AS "isbn", 
        b."title" AS "title", 
        b."subTitle" AS "subTitle", 
        b."description" AS "description",
        b."publishedDate" AS "publishedDate", 
        b."bookCoverId" AS "Book_bookCoverId", 
        b."pageCount" AS "pageCount", 
        b."createdDate" AS "createdAt",
        b."updatedDate" AS "updatedAt", 
        b."publisherId" AS "publisherId", 
        pub."id" AS "publisherId", 
        pub."name" AS "publisherName", 
        ubs."id" AS "ubsId",
        ubs."userId" AS "userId", 
        ubs."stateId" AS "stateId",
        ubs."isFavorite" AS "isFavorite",
        ARRAY(
              SELECT json_build_object('id', aut."id", 'name', aut."name")
              FROM "authors" aut
              INNER JOIN "book_authors" bAut ON aut."id" = bAut."authorId"
              WHERE bAut."bookId" = b."id"
            ) AS "authors"
        FROM "books" b 
        LEFT JOIN "publishers" pub ON pub."id"=b."publisherId"  
        LEFT JOIN "library" ubs ON ubs."bookId"=b."id"  
        WHERE b."isbn" = $1 AND ($2::int IS NULL OR ubs."userId" = $2);
      `,
      [isbn, userId ?? null]
    );

    const rows: BookDbWithRelations[] = result.rows;
    if (!rows.length) {
      return undefined;
    }
    return bookMapperInstance.toResponseWithRelations(rows[0]);
  }

  async insert(book: BookWithRelations): Promise<Book> {
    const result = await query(
      `
        INSERT INTO public.books ("bookId", isbn, title, "subTitle", description, "publishedDate", "bookCoverId", "pageCount", "createdDate", "updatedDate", "publisherId")
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
