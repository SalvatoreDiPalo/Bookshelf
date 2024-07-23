import { query } from "@/libs/utils/database";
import { Publisher } from "./publisher.entity";

class PublisherRepository {
  async findByName(name: string): Promise<Publisher | undefined> {
    const result = await query(
      `
        SELECT pu.* FROM public.publishers pu WHERE pu."name" = $1;
      `,
      [name]
    );

    const rows: Publisher[] = result.rows;
    return rows.length ? rows[0] : undefined;
  }

  async insert(name: string): Promise<Publisher> {
    const result = await query(
      `
        INSERT INTO public.publishers ("name") VALUES($1) RETURNING *;
      `,
      [name]
    );

    return result.rows[0];
  }
}

export const publisherRepositoryInstance = new PublisherRepository();
