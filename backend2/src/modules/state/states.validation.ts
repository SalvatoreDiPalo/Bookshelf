import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";

extendZodWithOpenApi(z);

export const CreateStateSchema = z.object({
  id: z.number().optional(),
  name: z.string(),
  isEditable: z.boolean().default(false),
});

export type CreateStates = z.infer<typeof CreateStateSchema>;
