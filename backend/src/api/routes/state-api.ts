import { NextFunction, Request, Response, Router } from "express";
import Container from "typedi";
import { Logger } from "winston";
import { Joi, celebrate } from "celebrate";
import StateService from "../../services/state-service";
import UserService from "../../services/user-service";
import { User } from "../../models/entity/User";
import { verifyAuthFromRequest } from "../middlewares/auth_middleware";
import { StateDTO } from "../../models/dto/state-dto";

const route = Router();

export default (app: Router) => {
  app.use("/states", route);

  route.post(
    "/",
    verifyAuthFromRequest,
    celebrate({
      query: {
        name: Joi.string().required(),
      },
    }),
    async (req: Request, res: Response, next: NextFunction) => {
      const logger: Logger = Container.get("logger");
      logger.debug("Calling AddState endpoint with query: %o", req.query.name);
      try {
        const userServiceInstance = Container.get(UserService);
        const user: User = await userServiceInstance.findUser(
          req.currentUser.sub
        );
        logger.debug("User %s", user.userId);
        const stateServiceInstance = Container.get(StateService);
        const createdState: StateDTO = await stateServiceInstance.saveState(
          user,
          String(req.query.name)
        );
        return res.status(200).json(createdState);
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

  route.delete(
    "/:id",
    verifyAuthFromRequest,
    celebrate({
      params: {
        id: Joi.number().positive().required(),
      },
    }),
    async (req: Request, res: Response, next: NextFunction) => {
      const logger: Logger = Container.get("logger");
      logger.debug("Calling GetStates endpoint with id: %o", req.params.id);
      try {
        const userServiceInstance = Container.get(UserService);
        const user: User = await userServiceInstance.findUser(
          req.currentUser.sub
        );
        logger.debug("User %s", user.userId);
        const stateServiceInstance = Container.get(StateService);
        await stateServiceInstance.deleteState(user, Number(req.params.id));
        return res.status(204).json();
      } catch (e) {
        logger.error("🔥 error: %o", e);
        return next(e);
      }
    }
  );
};
