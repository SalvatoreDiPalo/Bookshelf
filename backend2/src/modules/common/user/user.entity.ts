import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";

extendZodWithOpenApi(z);

export type User = z.infer<typeof UserSchema>;

export const UserSchema = z.object({
  id: z.number().positive(),
  userId: z.string().optional(),
  username: z.string().min(1),
  isVisibile: z.boolean().default(true),
  createdDate: z.date().optional(),
  updatedDate: z.date().optional(),
});
