import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";
import { commonValidations } from "@/libs/utils/commonValidation";

extendZodWithOpenApi(z);

export const AddBookToLibrarySchema = z.object({
  bookId: commonValidations.id,
});

export const AddBookToLibraryParamSchema = z.object({
  params: AddBookToLibrarySchema,
});
