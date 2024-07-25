import { UserJwt } from "../../models/userJwt";

declare global {
  namespace Express {
    export interface Request {
      currentUser: UserJwt;
    }
  }
}
