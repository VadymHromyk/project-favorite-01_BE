import { Router } from "express";
import {
  getCurrentUser,
  getUserById,
  getUserLocations,
} from "../controllers/usersController.js";

const router = Router();

import { authenticate } from "../middlewares/authenticate.js";

router.get("/me", authenticate, getCurrentUser);

router.get("/:userId", getUserById);

router.get("/:userId/locations", getUserLocations);

export default router;
