import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";

extendZodWithOpenApi(z);

export const StatsSchema = z.object({
  booksAdded: z.number().nonnegative(),
  finishedBooks: z.number().nonnegative(),
  favoriteBooks: z.number().nonnegative(),
});

export type Stats = z.infer<typeof StatsSchema>;
