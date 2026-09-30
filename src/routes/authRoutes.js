import { Router } from "express";
import { celebrate } from "celebrate";
import {
  registerUserSchema,
  loginUserSchema,
} from "../validations/authValidation.js";
import {
  registerUser,
  loginUser,
  logoutUser,
  refreshUserSession,
} from "../controllers/authController.js";
import { authenticate } from "../middlewares/authenticate.js";

const router = Router();

router.post("/auth/register", celebrate(registerUserSchema), registerUser);

router.post("/auth/login", celebrate(loginUserSchema), loginUser);

router.post("/auth/logout", authenticate, logoutUser);

router.post("/auth/refresh", refreshUserSession);

export default router;
