import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";
import { AuthorSchema } from "../common/author/author.entity";
import { PublisherSchema } from "../common/publisher/publisher.entity";
import { commonValidations } from "@/libs/utils/commonValidation";

extendZodWithOpenApi(z);

export const BookSchema = z.object({
  isbn: commonValidations.isbn,
  title: z.string().min(1),
  subTitle: z.string().optional(),
  publishedDate: z.string(),
  description: z.string().optional(),
  pageCount: z.number().positive().optional(),
  language: z.string().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  publisher: PublisherSchema.optional(),
  bookCoverUrl: z.string().optional(),
  authors: z.array(AuthorSchema),
  groupId: z.number().optional(),
  stateId: z.number().positive().optional(),
  bookId: z.string().optional(),
  isFavorite: z.boolean().default(false),
});

export const IsbnParamSchema = z.object({
  params: commonValidations.isbn,
});

export type Book = z.infer<typeof BookSchema>;
