import { Router } from "express";
import { celebrate } from "celebrate";
import {
  getLocations,
  updateLocationId,
} from "../controllers/locationsController.js";
import {
  getLocationsSchema,
  updateLocationSchema,
} from "../validations/locationsValidation.js";
import { authenticate } from "../middlewares/authenticate.js";
import { upload } from "../middlewares/multer.js";

const locationsRouter = Router();

locationsRouter.get(
  "/api/locations",
  celebrate(getLocationsSchema),
  getLocations,
);

locationsRouter.patch(
  "/api/locations/:id",
  authenticate,
  upload.single("image"),
  celebrate(updateLocationSchema, { abortEarly: false }),
  updateLocationId,
);

export default locationsRouter;
