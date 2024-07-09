import { CurrentUser } from "../../models/current-user";

declare global {
  namespace Express {
    export interface Request {
      currentUser: CurrentUser;
    }    
  }
}