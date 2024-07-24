import { commonValidations } from "@/libs/utils/commonValidation";
import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";

extendZodWithOpenApi(z);

export const UpdateFavoriteSchema = z
  .object({
    isFavorite: z.boolean(),
  })
  .strict();

export const UpdateFavoriteBookIdSchema = z.object({
  bookId: commonValidations.id,
});

export const UpdateFavoriteBookIdParamsSchema = z.object({
  params: UpdateFavoriteBookIdSchema,
});

export const UpdateFavoriteBodySchema = z.object({
  body: UpdateFavoriteSchema,
});
