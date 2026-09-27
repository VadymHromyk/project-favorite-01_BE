import { Router } from "express";
import {
  getPublicUserById,
  getUserLocations,
} from "../controllers/usersController.js";

const router = Router();

router.get("/:userId", getPublicUserById);

router.get("/:userId/locations", getUserLocations);

export default router;
