import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";
import { BookWithRelationsSchema } from "../book.validation";

extendZodWithOpenApi(z);

export const CreateBookSchema = BookWithRelationsSchema.omit({ id: true });

export type CreateBook = z.infer<typeof CreateBookSchema>;

export const CreateBookBodySchema = z.object({
  body: BookWithRelationsSchema.strict(),
});
