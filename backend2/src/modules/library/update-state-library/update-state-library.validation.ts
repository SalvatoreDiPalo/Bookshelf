import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";

extendZodWithOpenApi(z);

export const UpdateStateIdSchema = z
  .object({
    stateId: z.number().positive().nullable(),
  })
  .strict();

export const UpdateStateIdBodySchema = z.object({
  body: UpdateStateIdSchema,
});
