import { query } from "@/libs/utils/database";

class BookAuthorsRepository {
  async insert(
    authorId: number,
    bookId: number
  ): Promise<void> {
    await query(
      `
        INSERT INTO public."book_authors" ("bookId", "authorId") VALUES($1, $2);
      `,
      [bookId, authorId]
    );
  }
}

export const bookAuthorsRepositoryInstance = new BookAuthorsRepository();
