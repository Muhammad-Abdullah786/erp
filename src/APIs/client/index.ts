import express from "express";
import {
  createClient,
  loginClientController,
  resetPassword,
  updatePassword,
} from "./controllers/clientControllers";

const router = express.Router();

// Register route
router.route("/register").post(createClient);

// Login route
router.route("/login").post(loginClientController);

// Password reset request route
router.route("/reset-password").post(resetPassword);

// Update password after reset
router.route("/update-password").post(updatePassword);

export default router;
