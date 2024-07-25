import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";

extendZodWithOpenApi(z);

export type Publisher = z.infer<typeof PublisherSchema>;

export const PublisherSchema = z.object({
  id: z.number().positive().optional(),
  name: z.string().min(1),
});
