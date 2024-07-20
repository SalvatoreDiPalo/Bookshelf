import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";
import { CreateStateSchema } from "../states.validation";

extendZodWithOpenApi(z);

// Input Validation for 'GET users/:id' endpoint
export const CreateStatesSchema = z.object({
  body: z.array(CreateStateSchema),
});
