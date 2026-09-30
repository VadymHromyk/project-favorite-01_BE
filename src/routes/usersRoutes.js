import { Router } from "express";
import {
  getCurrentUser,
  getUserById,
  getUserLocations,
} from "../controllers/usersController.js";
import { getUserByIdSchema } from "./../validations/userValidation.js";

const router = Router();

import { authenticate } from "../middlewares/authenticate.js";
import { celebrate } from "celebrate";

router.get("/me", authenticate, getCurrentUser);

router.get("/:userId", celebrate(getUserByIdSchema), getUserById);

router.get(
  "/:userId/locations",
  celebrate(getUserByIdSchema),
  getUserLocations,
);

export default router;
