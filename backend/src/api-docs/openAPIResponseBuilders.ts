import { StatusCodes } from "http-status-codes";
import { z } from "zod";

import { ZodRequestBody } from "@asteasolutions/zod-to-openapi";

export function createApiResponse(
  schema: z.ZodTypeAny,
  description: string,
  statusCode = StatusCodes.OK
) {
  return {
    [statusCode]: {
      description,
      content: {
        "application/json": {
          schema: schema,
        },
      },
    },
  };
}

export function createApiRequestBody(
  schema: z.ZodTypeAny,
  description: string,
  required: boolean = true
): ZodRequestBody {
  return {
    description: description,
    content: {
      "application/json": {
        schema: schema,
      },
    },
    required: required,
  };
}

export function createPaginatedResponseSchema<ItemType extends z.ZodTypeAny>(
  itemSchema: ItemType
) {
  return z.object({
    totalItems: z.number(),
    items: z.array(itemSchema),
  });
}
