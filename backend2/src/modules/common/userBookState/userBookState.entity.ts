import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";

extendZodWithOpenApi(z);

export type UserBookState = z.infer<typeof UserBookStateSchema>;

export const UserBookStateSchema = z.object({
  id: z.number().positive().optional(),
  userId: z.number().positive(),
  stateId: z.number().positive().nullable(),
  bookId: z.number().positive(),
  isFavorite: z.boolean().default(false).readonly(),
});
