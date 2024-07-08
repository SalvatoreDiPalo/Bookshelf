import { NextFunction } from "express";
import { createRemoteJWKSet, jwtVerify } from "jose";

const extractBearerTokenFromHeaders = (authorization: string) => {
  const bearerTokenIdentifier = "Bearer";

  if (!authorization) {
    //throw new Error({ code: 'auth.authorization_header_missing', status: 401 });
    throw new Error("auth.authorization_header_missing");
  }

  if (!authorization.startsWith(bearerTokenIdentifier)) {
    //throw new Error({ code: 'auth.authorization_token_type_not_supported', status: 401 });
    throw new Error("auth.authorization_token_type_not_supported");
  }

  return authorization.slice(bearerTokenIdentifier.length + 1);
};

export const verifyAuthFromRequest = async (
  req: any,
  res: any,
  next: NextFunction
) => {
  console.log("Headers", req.headers);
  // Extract the token
  const token = extractBearerTokenFromHeaders(req.get("Authorization") ?? "");

  
  //Payload contiene il jt decodificato
  const { payload } = await jwtVerify(
    token, // The raw Bearer Token extracted from the request header
    createRemoteJWKSet(
      new URL(process.env.LOGTO_JWKS || "https://<your-logto-domain>/oidc/jwks")
    ), // generate a jwks using jwks_uri inquired from Logto server
    {
      // expected issuer of the token, should be issued by the Logto server
      issuer: process.env.LOGTO_ISSUER || "https://<your-logto-domain>/oidc",
      // expected audience token, should be the resource indicator of the current API
      audience:
        process.env.LOGTO_BASEURL ||
        "<your request listener resource indicator>",
    }
  );

  return next();
};