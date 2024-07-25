import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";

extendZodWithOpenApi(z);

export const GoogleBookIdsSchema = z.array(z.string().min(1)).nonempty();

export type CheckBooksInLibrary = z.infer<typeof GoogleBookIdsSchema>;

export const CheckBookInLibraryBodySchema = z.object({
  body: GoogleBookIdsSchema,
});
