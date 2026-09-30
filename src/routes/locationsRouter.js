import { Router } from "express";
import { celebrate } from "celebrate";
import {
  getLocations,
  createLocation,
  getLocationById,
} from "../controllers/locationsController.js";
import {
  getLocationsSchema,
  createLocationSchema,
} from "../validation/locationsValidation.js";
import { authenticate } from "../middlewares/authenticate.js";
import { uploadLocationImage } from "../middlewares/uploadLocationImage.js";

const locationsRouter = Router();

locationsRouter.get("/", celebrate(getLocationsSchema), getLocations);

locationsRouter.post(
  "/",
  authenticate,
  uploadLocationImage,
  celebrate(createLocationSchema),
  createLocation,
);

locationsRouter.get("/:id", getLocationById);

export default locationsRouter;
