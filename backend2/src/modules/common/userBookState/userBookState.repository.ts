import { query } from "@/libs/utils/database";

class UserBookStateRepository {
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
