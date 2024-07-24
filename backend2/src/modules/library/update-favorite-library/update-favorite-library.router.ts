import {
  createApiRequestBody,
  createApiResponse,
} from "@/api-docs/openAPIResponseBuilders";
import { verifyAuthFromRequest } from "@/libs/middleware/auth";

import express, { Router } from "express";
import { RouteConfig } from "@asteasolutions/zod-to-openapi";
import { validateRequest } from "@/libs/utils/httpHandlers";
import {
  UpdateFavoriteBodySchema,
  UpdateFavoriteBookIdParamsSchema,
  UpdateFavoriteBookIdSchema,
  UpdateFavoriteSchema,
} from "./update-favorite-library.validation";
import { updateFavoriteToLibraryController } from "./update-favorite-library.controller";
import { BookWithRelationsSchema } from "@/modules/common/book/book.entity";

export const updateFavoriteLibraryRouteConfig: RouteConfig = {
  method: "patch",
  path: "/library/book/{bookId}/favorite",
  tags: ["Library"],
  request: {
    body: createApiRequestBody(UpdateFavoriteSchema, "Favorite body"),
    params: UpdateFavoriteBookIdSchema,
  },
  responses: createApiResponse(BookWithRelationsSchema, "Success"),
};

export const updateFavoriteLibraryRouter: Router = express.Router();
updateFavoriteLibraryRouter.patch(
  "/book/:bookId/favorite",
  validateRequest(
    UpdateFavoriteBodySchema.merge(UpdateFavoriteBookIdParamsSchema)
  ),
  verifyAuthFromRequest,
  updateFavoriteToLibraryController.updateFavorite
);
