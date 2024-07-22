import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";

extendZodWithOpenApi(z);

export type UserBookStateSchema = z.infer<typeof UserBookStateSchema>;

export const UserBookStateSchema = z.object({
  id: z.number().positive(),
  userId: z.number().positive(),
  stateId: z.number().positive().optional(),
  bookId: z.number().positive(),
  isFavorite: z.boolean().default(false).readonly(),
});
