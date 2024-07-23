import { query } from "@/libs/utils/database";
import { UserBookState } from "./userBookState.entity";
import { logger } from "@/server";

class UserBookStateRepository {
  async findUserBookStateByBookIdAndUserId(
    bookId: number,
    userId: number
  ): Promise<UserBookState | undefined> {
    const result = await query(
      `
        SELECT ubs.*
        FROM user_book_states ubs
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
          SELECT 1 FROM user_book_states ubs
          WHERE ubs."bookId" = $1 AND ubs."userId" = $2
        );
      `,
      [bookId, userId]
    );
    logger.debug("Result exists %o", result.rows);
    return result.rows.length ? result.rows[0].exists : false;
  }

  async updateStateIdToNullByStateIds(stateIds: number[]): Promise<void> {
    await query(
      `
        UPDATE public.user_book_states SET "stateId" = NULL WHERE "stateId" = ANY ($1);
      `,
      [stateIds]
    );
  }

  async insert(ubs: UserBookState): Promise<void> {
    await query(
      `
        INSERT INTO public.user_book_states ("userId", "stateId", "bookId", "isFavorite") VALUES($1, $2, $3, $4);
      `,
      [ubs.userId, ubs.stateId, ubs.bookId, ubs.isFavorite]
    );
  }
}

export const userBookStateRepositoryInstance = new UserBookStateRepository();
