import { Router } from "express";
import managementController from "./management.controller";
import rateLimiter from "../../../middlewares/rateLimiter";
import { authorize } from "../../../middlewares/roleCheck";
import { EUserRoles } from "../../../constant/users";
import authenticate from "../../../middlewares/authenticate";
const router = Router();

router
  .route("/me")
  .get(
    rateLimiter,
    authenticate,
    authorize(EUserRoles.USER),
    managementController.me
  );

export default router;
