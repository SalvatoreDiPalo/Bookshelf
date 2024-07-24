import { commonValidations } from "@/libs/utils/commonValidation";
import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";

extendZodWithOpenApi(z);

export const LibrarySchema = z.object({
  page: commonValidations.page,
  pageSize: commonValidations.pageSize,
  sortBy: z.enum(["title", "createdDate"]).optional().default("title"),
  isFavorite: z
    .string()
    .transform(Boolean)
    .refine((val) => val, "isFavorite must be true")
    .optional(),
  stateId: z
    .string()
    .refine(
      (data) => !Number.isNaN(Number(data)),
      "stateId must be a numeric value"
    )
    .transform(Number)
    .refine((num) => num > 0, "stateId must be a positive number")
    .optional(),
});

export const BookIdSchema = z.object({
  bookId: commonValidations.id,
});

export const BookIdSchemaParamsSchema = z.object({
  params: BookIdSchema,
});
