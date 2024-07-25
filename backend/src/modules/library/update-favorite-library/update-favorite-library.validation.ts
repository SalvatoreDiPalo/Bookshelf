import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";

extendZodWithOpenApi(z);

export const UpdateFavoriteSchema = z
  .object({
    isFavorite: z.boolean(),
  })
  .strict();

export const UpdateFavoriteBodySchema = z.object({
  body: UpdateFavoriteSchema,
});
