import { query } from "@/libs/utils/database";
import { QueryResult } from "pg";
import { Book, BookWithRelations } from "../book/book.validation";
import { SearchLibrary } from "./get-library/get-library.validation";
import {
  getLibraryMapperInstance,
  LibraryBookIn,
} from "./get-library/get-library.mapper";

class LibraryRepository {
  async findAll(
    userId: number,
    searchLibrary: SearchLibrary
  ): Promise<BookWithRelations[]> {
    const offset = (searchLibrary.page - 1) * searchLibrary.pageSize;
    const result: QueryResult<LibraryBookIn> = await query(
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
        LEFT JOIN "user_book_states" ubs ON ubs."bookId"=b."id"  
        WHERE  (ubs."userId" = $1) AND ($2::int IS NULL OR $2 = ubs."stateId") AND ($3::bool IS NULL OR ubs."isFavorite" IS TRUE)
        ORDER BY b."${searchLibrary.sortBy}" ASC LIMIT $4 OFFSET $5;
      `,
      [
        userId,
        searchLibrary.stateId ?? null,
        searchLibrary.isFavorite ?? null,
        searchLibrary.pageSize,
        offset,
      ]
    );

    return result.rows.map((row) => getLibraryMapperInstance.toResponse(row));
  }

  async countAll(
    userId: number,
    searchLibrary: SearchLibrary
  ): Promise<number> {
    const result = await query(
      `
        SELECT COUNT(DISTINCT(b."id")) AS "cnt" 
        FROM "books" b 
        LEFT JOIN "book_authors" bAut ON bAut."bookId"=b."id" 
        LEFT JOIN "authors" aut ON aut."id"=bAut."authorId"  
        LEFT JOIN "publishers" pub ON pub."id"=b."publisherId"  
        LEFT JOIN "user_book_states" ubs ON ubs."bookId"=b."id"  
        WHERE ("ubs"."userId" = $1) AND ($2::int IS NULL OR $2 = ubs."stateId") AND ($3::bool IS NULL OR ubs."isFavorite" IS TRUE)
      `,
      [userId, searchLibrary.stateId ?? null, searchLibrary.isFavorite ?? null]
    );

    const row = result.rowCount == 1 ? result.rows[0].cnt : 0;

    return row;
  }

  /**
   * Checks whether the google books ids received as input are already associated with the current user
   * @param userId id of the current user
   * @param googleBookIds id of the google books
   * @returns ID of Google books in the library
   */
  async getBooksInLibraryByGoogleIds(
    userId: number,
    googleBookIds: string[]
  ): Promise<string[]> {
    const result = await query(
      `
        SELECT b."bookId"
        FROM user_book_states ubs  
        JOIN books b ON ubs."bookId" = b.id
        WHERE ubs."userId" = $1 AND b."bookId" = ANY($2)
      `,
      [userId, googleBookIds]
    );
    return result.rows.map((row) => row.bookId);
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

export const libraryRepositoryInstance = new LibraryRepository();
