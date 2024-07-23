import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";
import { LibrarySchema } from "../library.validation";

extendZodWithOpenApi(z);

export const LibraryQuerySchema = z.object({
  query: LibrarySchema.strict(),
});

export type SearchLibrary = z.infer<typeof LibrarySchema>;
