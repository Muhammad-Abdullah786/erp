import { Request, Response, NextFunction } from "express";
import { EUserRoles } from "../constant/users";
import httpError from "../handlers/errorHandler/httpError";
import responseMessage from "../constant/responseMessage";
import logger from "../handlers/logger";

export const authorize = (...allowedRoles: EUserRoles[]) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    const userRole = req.authenticatedUser?.role;

    // Check if user role is available
    if (!userRole) {
      logger.error(`this is commign from role check`);
      return httpError(next, new Error(responseMessage.UNAUTHORIZED), req, 401);
    }

    // Check if user's role is allowed
    if (!allowedRoles.includes(userRole)) {
      return httpError(next, new Error(responseMessage.FORBIDDEN), req, 403);
    }

    // Role is valid; proceed to the next middleware or route handler
    next();
  };
};
