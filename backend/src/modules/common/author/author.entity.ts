import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";

extendZodWithOpenApi(z);

export type Author = z.infer<typeof AuthorSchema>;

export const AuthorSchema = z.object({
  id: z.number().positive().optional(),
  name: z.string().min(1),
});
