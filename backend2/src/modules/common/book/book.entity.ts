import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";
import { AuthorSchema } from "../author/author.entity";
import { PublisherSchema } from "../publisher/publisher.entity";
import { commonValidations } from "@/libs/utils/commonValidation";

extendZodWithOpenApi(z);

export const BookSchema = z.object({
  id: z.number().positive().optional(),
  isbn: commonValidations.isbn,
  title: z.string().min(1),
  subTitle: z.string().optional(),
  publishedDate: z.string(),
  description: z.string().optional(),
  pageCount: z.number().positive().optional(),
  language: z.string().optional(),
  createdAt: z.date().optional().readonly(),
  updatedAt: z.date().optional().readonly(),
  bookCoverUrl: z.string().optional(),
  groupId: z.number().optional(),
  stateId: z.number().positive().optional(),
  bookId: z.string().optional(),
  publisherId: z.number().optional(),
  isFavorite: z.boolean().default(false),
});

export const BookWithRelationsSchema = BookSchema.extend({
  publisher: PublisherSchema.optional(),
  authors: z.array(AuthorSchema),
});

export const IsbnParamSchema = z.object({
  params: commonValidations.isbn,
});

export type Book = z.infer<typeof BookSchema>;
export type BookWithRelations = z.infer<typeof BookWithRelationsSchema>;
