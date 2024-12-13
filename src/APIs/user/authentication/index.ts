import { Router } from "express";
import authenticationController from "./authentication.controller";
import authenticate from "../../../middlewares/authenticate";

const router = Router();

router.route("/register").post(authenticationController.register);
router
  .route("/registeration/confirm/:token")
  .patch(authenticationController.confirmRegistration);

router.route("/login").post(authenticationController.login);
router.route("/logout").put(authenticate, authenticationController.logout);
router
  .route("/role/:id")
  .patch(authenticate, authenticationController.editUserRole);

export default router;
