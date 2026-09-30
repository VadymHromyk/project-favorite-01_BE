import { Router } from "express";
import {
  getCurrentUser,
  getUserById,
  getUserLocations,
  editProfileController,
} from "../controllers/usersController.js";
import {
  getUserByIdSchema,
  userUpdateSchema,
} from "./../validations/userValidation.js";

const router = Router();

import { authenticate } from "../middlewares/authenticate.js";
import { celebrate } from "celebrate";
import { upload } from "../middlewares/multer.js";

router.get("/me", authenticate, getCurrentUser);

router.patch(
  "/me",
  authenticate,
  upload.single("avatar"),
  celebrate(userUpdateSchema),
  editProfileController,
);

router.get("/:userId", celebrate(getUserByIdSchema), getUserById);

router.get(
  "/:userId/locations",
  celebrate(getUserByIdSchema),
  getUserLocations,
);

export default router;
