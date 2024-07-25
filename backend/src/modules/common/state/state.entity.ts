import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";

extendZodWithOpenApi(z);

export type State = z.infer<typeof StateSchema>;

export const StateSchema = z.object({
  id: z.number().positive(),
  name: z.string().min(1),
  editable: z.boolean().default(false).readonly(),
  order: z.number().optional(),
  userId: z.number().positive(),
});
