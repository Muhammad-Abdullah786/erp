import { Router } from "express";
import {
  registerEmployee,
  loginEmployee,
  getAllEmployees,
  getEmployeeById,
  updateEmployeeById,
  deleteEmployeeById,
  UserPasswordResetEmail,
  userPasswordReset,
  // sendVerificationEmail,

  // sendWelcomeEmail,
} from "../controller";

const router = Router();

router.route("/employee").post(registerEmployee);
router.route("/login").post(loginEmployee);
router.route("/getallemployee").get(getAllEmployees);
router.route("/getemployee/:id").get(getEmployeeById);
router.route("/getemployee/:id").get(getEmployeeById);
router.route("/employee/:id").put(updateEmployeeById);
router.route("/employee/:id").delete(deleteEmployeeById);

router.route("/reset").post(UserPasswordResetEmail);
router.route("/resetpassword/:id").post(userPasswordReset);

// router.route("/sendwelcomeemail").post(sendWelcomeEmail);

// router.route("/register").post(upload.single("profile"), registerEmployee);

export default router;
