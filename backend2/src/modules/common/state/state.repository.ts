import { query } from "@/libs/utils/database";
import { State } from "./state.entity";

class StateRepository {
  async findAllByUser(idUser: number): Promise<State[]> {
    const result = await query(
      `
        SELECT st.* FROM state st WHERE st.userId = $1;
      `,
      [idUser]
    );

    return result.rows;
  }

  async findByNameAndUserId(
    userId: string,
    name: string
  ): Promise<State | undefined> {
    const result = await query(
      `
        SELECT st.* FROM state st 
        WHERE st.userId = $1 AND st."name" = $2;        
      `,
      [userId, name]
    );
    const rows: State[] = result.rows;
    return rows.length ? rows[0] : undefined;
  }

  async insert(
    name: string,
    idUser: number,
    order: number,
    editable: boolean = true
  ): Promise<State> {
    const result = await query(
      `
        INSERT INTO public.state ("name", "userId", editable, "order")
        VALUES($1, $2, $3, $4);
      `,
      [name, idUser, editable, order]
    );

    return result.rows[0];
  }

  async updateOrder(id: number, order: number): Promise<State> {
    const result = await query(
      `
        UPDATE public.state SET "order" = $1 WHERE id = $2;
      `,
      [order, id]
    );

    return result.rows[0];
  }

  async deleteById(id: number): Promise<void> {
    await query(
      `
        DELETE FROM public.state WHERE id=$1;
      `,
      [id]
    );
  }

  async deleteByIds(ids: number[]): Promise<void> {
    await query(
      `
        DELETE FROM public.state WHERE id = ANY ($1);
      `,
      [ids]
    );
  }
}

export const stateRepositoryInstance = new StateRepository();
