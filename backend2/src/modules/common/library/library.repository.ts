import { query } from "@/libs/utils/database";
import { QueryResult } from "pg";
import { BookWithRelations } from "../book/book.entity";
import { SearchLibrary } from "../../library/get-library/get-library.validation";
import { Library } from "./library.entity";
import { Stats } from "@/modules/library/get-stats-library/get-stats-library.validation";
import { BookDbWithRelations, bookMapperInstance } from "../book/book.mapper";

class LibraryRepository {
  async findAll(
    userId: number,
    searchLibrary: SearchLibrary
  ): Promise<BookWithRelations[]> {
    const offset = (searchLibrary.page - 1) * searchLibrary.pageSize;
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

    return result.rows.map((row) =>
      bookMapperInstance.toResponseWithRelations(row)
    );
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
        LEFT JOIN "library" ubs ON ubs."bookId"=b."id"  
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
        FROM library ubs  
        JOIN books b ON ubs."bookId" = b.id
        WHERE ubs."userId" = $1 AND b."bookId" = ANY($2)
      `,
      [userId, googleBookIds]
    );
    return result.rows.map((row) => row.bookId);
  }

  async findUserBookStateByBookIdAndUserId(
    bookId: number,
    userId: number
  ): Promise<Library | undefined> {
    const result = await query(
      `
        SELECT ubs.*
        FROM library ubs
        WHERE ubs."bookId" = $1 AND ubs."userId" = $2;
      `,
      [bookId, userId]
    );
    return result.rows.length ? result.rows[0] : undefined;
  }

  async existsByBookIdAndUserId(
    bookId: number,
    userId: number
  ): Promise<boolean> {
    const result = await query(
      `
        SELECT EXISTS(
          SELECT 1 FROM library ubs
          WHERE ubs."bookId" = $1 AND ubs."userId" = $2
        );
      `,
      [bookId, userId]
    );
    return result.rows.length ? result.rows[0].exists : false;
  }

  async updateStateIdToNullByStateIds(stateIds: number[]): Promise<void> {
    await query(
      `
        UPDATE public.library SET "stateId" = NULL WHERE "stateId" = ANY ($1);
      `,
      [stateIds]
    );
  }

  async updateFavorite(
    bookId: number,
    userId: number,
    isFavorite: boolean
  ): Promise<void> {
    await query(
      `
        UPDATE public.library SET "isFavorite" = $1 WHERE "bookId" = $2 AND "userId" = $3;
      `,
      [isFavorite, bookId, userId]
    );
  }

  async insert(ubs: Library): Promise<void> {
    await query(
      `
        INSERT INTO public.library ("userId", "stateId", "bookId", "isFavorite") VALUES($1, $2, $3, $4);
      `,
      [ubs.userId, ubs.stateId, ubs.bookId, ubs.isFavorite]
    );
  }

  async getStats(userId: number, finishedName: string): Promise<Stats> {
    const result: QueryResult<Stats> = await query(
      `
        SELECT COUNT(*) AS "booksAdded",
              COUNT(CASE WHEN s."name" = $1 THEN 1 END) AS "finishedBooks",
              COUNT(CASE WHEN "isFavorite" = true THEN 1 END) AS "favoriteBooks"
        FROM public."library" l
        LEFT JOIN public.states s ON l."stateId" = s.id
        WHERE l."userId" = $2
        GROUP BY l."userId";
      `,
      [finishedName, userId]
    );
    return result.rows.length ? result.rows[0] : emptyStats;
  }
}

export const libraryRepositoryInstance = new LibraryRepository();

const emptyStats: Stats = {
  booksAdded: 0,
  finishedBooks: 0,
  favoriteBooks: 0,
};
