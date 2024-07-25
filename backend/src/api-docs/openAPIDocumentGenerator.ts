import { OpenAPIRegistry, OpenApiGeneratorV3 } from "@asteasolutions/zod-to-openapi";

import { healthCheckRegistry } from "@/modules/healthCheck/healthCheckRouter";
import { userRegistry } from "@/modules/user/user.registry";
import { stateRegistry } from "@/modules/state/state.registry";
import { bookRegistry } from "@/modules/book/book.registry";
import { libraryRegistry } from "@/modules/library/library.registry";

export function generateOpenAPIDocument() {
  const registry = new OpenAPIRegistry([healthCheckRegistry, userRegistry, stateRegistry, bookRegistry, libraryRegistry]);
  const generator = new OpenApiGeneratorV3(registry.definitions);

  return generator.generateDocument({
    openapi: "3.0.0",
    info: {
      version: "1.0.0",
      title: "Swagger API",
    },
    externalDocs: {
      description: "View the raw OpenAPI Specification in JSON format",
      url: "/swagger.json",
    },
  });
}