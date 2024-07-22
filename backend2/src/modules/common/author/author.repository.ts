import { query } from "@/libs/utils/database";
import { Author } from "./author.entity";

class AuthorRepository {
  async findAllByNameIn(names: string[]): Promise<Author[]> {
    const result = await query(
      `
        SELECT au.* FROM public.author au WHERE au."name" = ANY ($1);
      `,
      [names]
    );

    return result.rows;
  }

  async findAllByBookId(bookId: number): Promise<Author[]> {
    const result = await query(
      `
        SELECT au.* FROM public.author au
        JOIN book_authors_author bks ON bks."authorId" = au."id"
        where bks."bookId" = $1;
      `,
      [bookId]
    );

    return result.rows;
  }

  async insert(name: string): Promise<Author> {
    const result = await query(
      `
        INSERT INTO public."author" ("name") VALUES($1) RETURNING *;
      `,
      [name]
    );

    return result.rows[0];
  }
}

export const authorRepositoryInstance = new AuthorRepository();
