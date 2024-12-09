<<<<<<< HEAD
import express from "express";
=======
import express from 'express';
>>>>>>> main
import {
  login,
  logout,
  signup,
  forgotPassword,
  resetPassword,
  checkAuth,
<<<<<<< HEAD
} from "../Controllers/auth.controller";
import { verifyToken } from "../middleware/verifyToken";
=======
} from '../Controllers/auth.controller';
import { verifyToken } from '../middleware/verifyToken';
>>>>>>> main

const router = express.Router();

// Define routes with appropriate TypeScript typings
<<<<<<< HEAD
router.get("/check-auth", verifyToken, checkAuth);

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);

// router.post("/verify-email", verifyEmail);
router.post("/forgot-password", forgotPassword);

router.post("/reset-password/:id/:token", resetPassword);
=======
router.get('/check-auth', verifyToken, checkAuth);

router.post('/signup', signup);
router.post('/login', login);
router.post('/logout', logout);

// router.post("/verify-email", verifyEmail);
router.post('/forgot-password', forgotPassword);

router.post('/reset-password/:id/:token', resetPassword);
>>>>>>> main

export default router;
