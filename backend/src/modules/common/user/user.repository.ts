import { query } from "@/libs/utils/database";
import type { User } from "@/modules/common/user/user.entity";

class UserRepository {
  async findOneByUserId(userId: string): Promise<User | undefined> {
    const result = await query(
      `
        SELECT us.* FROM public."users" us WHERE us."userId" = $1
      `,
      [userId]
    );

    const rows: User[] = result.rows;
    return rows.length ? rows[0] : undefined;
  }

  async insert(
    userId: string,
    username: string,
    isVisibile: boolean = true
  ): Promise<User> {
    const result = await query(
      `
        INSERT INTO public."users" ("userId", username, "isVisibile") 
        VALUES($1, $2, $3) RETURNING *;
      `,
      [userId, username, isVisibile]
    );

    return result.rows[0];
  }

  async existsByUserId(userId: string): Promise<User> {
    const result = await query(
      `
        SELECT EXISTS(SELECT 1 FROM users WHERE userId = $1);
      `,
      [userId]
    );
    return result.rows[0];
  }
}

export const userRepositoryInstance = new UserRepository();
