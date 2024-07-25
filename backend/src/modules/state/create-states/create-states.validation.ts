import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";
import { CreateStateSchema } from "../states.validation";

extendZodWithOpenApi(z);

export const CreateStatesSchema = z.array(CreateStateSchema).nonempty().max(10);

// Input Validation for 'POST states' endpoint
export const CreateStatesBodySchema = z.object({
  body: CreateStatesSchema,
});
