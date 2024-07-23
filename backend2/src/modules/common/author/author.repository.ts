import { query } from "@/libs/utils/database";
import { Author } from "./author.entity";

class AuthorRepository {
  async findAllByNameIn(names: string[]): Promise<Author[]> {
    const result = await query(
      `
        SELECT au.* FROM public.authors au WHERE au."name" = ANY ($1);
      `,
      [names]
    );

    return result.rows;
  }

  async findAllByBookId(bookId: number): Promise<Author[]> {
    const result = await query(
      `
        SELECT au.* FROM public.authors au
        JOIN book_authors bks ON bks."authorId" = au."id"
        where bks."bookId" = $1;
      `,
      [bookId]
    );

    return result.rows;
  }

  async insert(name: string): Promise<Author> {
    const result = await query(
      `
        INSERT INTO public."authors" ("name") VALUES($1) RETURNING *;
      `,
      [name]
    );

    return result.rows[0];
  }
}

export const authorRepositoryInstance = new AuthorRepository();
