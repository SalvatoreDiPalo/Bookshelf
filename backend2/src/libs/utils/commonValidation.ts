import { z } from "zod";
import * as ISBN from "isbn3";

export const commonValidations = {
  id: z
    .string()
    .refine((data) => !Number.isNaN(Number(data)), "ID must be a numeric value")
    .transform(Number)
    .refine((num) => num > 0, "ID must be a positive number"),
  // ... other common validations
  isbn: z.string().refine(
    (val) => {
      if (typeof val !== "string") {
        return false;
      }
      const parsedIsbn: ISBN | null = ISBN.parse(val);
      return parsedIsbn && parsedIsbn.isValid;
    },
    { message: "Value must be a valid ISBN" }
  ),
};
