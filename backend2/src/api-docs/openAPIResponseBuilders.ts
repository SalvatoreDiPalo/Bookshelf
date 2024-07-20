import { StatusCodes } from "http-status-codes";
import type { z } from "zod";

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

export function createApiRequest(
  schema: z.ZodTypeAny,
  description: string,
  required: boolean = true
) {
  const body: ZodRequestBody = {
    description: description,
    content: {
      "application/json": {
        schema: schema,
      },
    },
    required: required,
  };
  return {
    body: body,
  };
}
