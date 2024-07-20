import { StatusCodes } from "http-status-codes";
import { z } from "zod";

export class ServiceResponse<T = null> {
  readonly success: boolean;
  readonly message?: string;
  readonly responseObject: T;
  readonly statusCode: number;

  private constructor(
    success: boolean,
    responseObject: T,
    statusCode: number,
    message?: string
  ) {
    this.success = success;
    this.message = message;
    this.responseObject = responseObject;
    this.statusCode = statusCode;
  }

  static success<T>(responseObject: T, statusCode: number = StatusCodes.OK) {
    return new ServiceResponse(true, responseObject, statusCode);
  }

  static failure<T>(
    message: string,
    responseObject: T,
    statusCode: number = StatusCodes.BAD_REQUEST
  ) {
    return new ServiceResponse(false, responseObject, statusCode, message);
  }
}

export const ServiceResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
  z.object({
    success: z.boolean(),
    message: z.string().optional(),
    responseObject: dataSchema.optional(),
    statusCode: z.number(),
  });
