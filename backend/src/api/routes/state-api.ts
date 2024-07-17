import { NextFunction, Request, Response, Router } from "express";
import Container from "typedi";
import { Logger } from "winston";
import StateService from "../../services/state-service";
import UserService from "../../services/user-service";
import { verifyAuthFromRequest } from "../middlewares/auth_middleware";
import { StateDTO } from "../../models/dto/state-dto";
import { User } from "../../models/entity/User-entity";
import { multipleStatesBody } from "../validators/state-validators";

const route = Router();

export default (app: Router) => {
  app.use("/states", route);

  route.post(
    "/",
    verifyAuthFromRequest,
    multipleStatesBody,
    async (req: Request, res: Response, next: NextFunction) => {
      const logger: Logger = Container.get("logger");
      logger.debug("Calling AddState endpoint with body: %o", req.body);
      try {
        const userServiceInstance = Container.get(UserService);
        const user: User = await userServiceInstance.findUser(
          req.currentUser.sub
        );
        logger.debug("User %s", user.userId);
        const stateServiceInstance = Container.get(StateService);
        const createdStates: StateDTO[] = await stateServiceInstance.saveState(
          user,
          req.body as StateDTO[]
        );
        return res.status(200).json(createdStates);
      } catch (e) {
        logger.error("🔥 error: %o", e);
        return next(e);
      }
    }
  );

  route.get(
    "/",
    verifyAuthFromRequest,
    async (req: Request, res: Response, next: NextFunction) => {
      const logger: Logger = Container.get("logger");
      logger.debug("Calling GetStates endpoint");
      try {
        const userServiceInstance = Container.get(UserService);
        const user: User = await userServiceInstance.findUser(
          req.currentUser.sub
        );
        logger.debug("User %s", user.userId);
        const stateServiceInstance = Container.get(StateService);
        const resultDTO = await stateServiceInstance.getStates(user);
        return res.status(200).json(resultDTO);
      } catch (e) {
        logger.error("🔥 error: %o", e);
        return next(e);
      }
    }
  );
};
