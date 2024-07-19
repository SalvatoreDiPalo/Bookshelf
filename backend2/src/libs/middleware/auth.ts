import { NextFunction } from "express";
import { createRemoteJWKSet, jwtVerify } from "jose";
import { StatusCodes } from "http-status-codes";
import { ServiceResponse } from "../models/serviceResponse";
import { env } from "../utils/envConfig";
import { type Request, type Response } from "express";
import { UserJwt } from "../models/userJwt";
import { logger } from "@/server";
import { handleServiceResponse } from "../utils/httpHandlers";

export const verifyAuthFromRequest = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Extract the token

  logger.debug("Check whether the user is authenticated correctly");
  console.log("Porcodediooo");
  if (!req.header("Authorization")) {
    return handleServiceResponse(
      ServiceResponse.failure(
        "auth.authorization_header_missing",
        null,
        StatusCodes.UNAUTHORIZED
      ),
      res
    );
  }
  console.log("Calcolo header");
  const authorizationHeader = req.header("Authorization")!;
  console.log("Header Auth", authorizationHeader);

  const bearerTokenIdentifier = "Bearer";

  if (!authorizationHeader.startsWith(bearerTokenIdentifier)) {
    return handleServiceResponse(
      ServiceResponse.failure(
        "auth.authorization_token_type_not_supported",
        null,
        StatusCodes.UNAUTHORIZED
      ),
      res
    );
  }

  const token = authorizationHeader.slice(bearerTokenIdentifier.length + 1);
  console.log("Token", token);

  try {
    //Payload contiene il jt decodificato
    const { payload } = await jwtVerify(
      token, // The raw Bearer Token extracted from the request header
      createRemoteJWKSet(new URL(env.LOGTO_JWKS)), // generate a jwks using jwks_uri inquired from Logto server
      {
        // expected issuer of the token, should be issued by the Logto server
        issuer: env.LOGTO_ISSUER,
        // expected audience token, should be the resource indicator of the current API
        audience: env.LOGTO_BASE_URL,
      }
    );
    const userJwt = {
      id: payload.sub,
      ...payload,
    } as UserJwt;
    req.currentUser = userJwt;
  } catch (err) {
    console.error("Error", err);
    let errorMessage =
      err instanceof Error ? err.message : "Could not validate the JWT!";

    return handleServiceResponse(
      ServiceResponse.failure(errorMessage, null, StatusCodes.UNAUTHORIZED),
      res
    );
  }

  return next();
};
