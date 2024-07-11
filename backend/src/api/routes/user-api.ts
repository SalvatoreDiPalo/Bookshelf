import { NextFunction, Request, Response, Router } from "express";
import { verifyAuthFromRequest } from "../middlewares/auth_middleware";
import Container from "typedi";
import { Logger } from "winston";
import UserService from "../../services/user-service";

const route = Router();

export default (app: Router) => {
  app.use("/users", route);

  route.get(
    "/profile",
    verifyAuthFromRequest,
    async (req: Request, res: Response, next: NextFunction) => {
      const logger: Logger = Container.get("logger");
      logger.debug("Calling GetUser endpoint");
      try {
        const userServiceInstance = Container.get(UserService);
        const userDto = await userServiceInstance.getUser(req.currentUser);
        return res.status(200).json(userDto);
      } catch (e) {
        logger.error("🔥 error: %o", e);
        return next(e);
      }
    }
  );
};
