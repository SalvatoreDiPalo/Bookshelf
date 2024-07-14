import { NextFunction } from "express";
import { createRemoteJWKSet, jwtVerify } from "jose";
import { config } from "../../config";
import Container from "typedi";
import { Logger } from "winston";
import { HttpException } from "../../models/exceptions/http-exception";

const extractBearerTokenFromHeaders = (authorization: string) => {
  const bearerTokenIdentifier = "Bearer";

  if (!authorization) {
    throw new HttpException(401, "auth.authorization_header_missing");
  }

  if (!authorization.startsWith(bearerTokenIdentifier)) {
    throw new HttpException(
      401,
      "auth.authorization_token_type_not_supported"
    );
  }

  return authorization.slice(bearerTokenIdentifier.length + 1);
};

export const verifyAuthFromRequest = async (req, res, next: NextFunction) => {
  const Logger: Logger = Container.get("logger");
  // Extract the token
  try {
    const token = extractBearerTokenFromHeaders(req.get("Authorization") ?? "");
    //Payload contiene il jt decodificato
    const { payload } = await jwtVerify(
      token, // The raw Bearer Token extracted from the request header
      createRemoteJWKSet(new URL(config.logto.jwks)), // generate a jwks using jwks_uri inquired from Logto server
      {
        // expected issuer of the token, should be issued by the Logto server
        issuer: config.logto.issuer,
        // expected audience token, should be the resource indicator of the current API
        audience: config.logto.baseUrl,
      }
    );
    Logger.debug("Payload:\n%o", payload);
    req.currentUser = {
      ...payload,
    };
  } catch (err) {
    Logger.error("Error while verifying the jwt %o", err.message);
    res.status(401);
    return next(new HttpException(401, err.message));
  }

  return next();
};
