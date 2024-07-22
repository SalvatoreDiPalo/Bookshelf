import { query } from "@/libs/utils/database";
import { UserBookStateSchema } from "./userBookState.entity";

class UserBookStateRepository {
  async findUserBookStateByBookIdAndUserId(
    bookId: number,
    userId: number
  ): Promise<UserBookStateSchema | undefined> {
    const result = await query(
      `
        SELECT ubs.*
        FROM user_book_state ubs
        WHERE ubs."bookId" = $1 AND ubs."userId" = $2;
      `,
      [bookId, userId]
    );
    return result.rows.length ? result.rows[0] : undefined;
  }

  async updateStateIdToNullByStateIds(stateIds: number[]): Promise<void> {
    await query(
      `
        UPDATE public.user_book_state SET "stateId" = NULL WHERE "stateId" = ANY ($1);
      `,
      [stateIds]
    );
  }
}

export const userBookStateRepositoryInstance = new UserBookStateRepository();
