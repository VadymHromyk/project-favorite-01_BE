import { Router } from "express";
import { celebrate } from "celebrate";
import { registerUserSchema } from "../validations/authValidation.js";
import { registerUser } from "../controllers/authController.js";

const router = Router();

router.post("/auth/register", celebrate(registerUserSchema), registerUser);

export default router;
