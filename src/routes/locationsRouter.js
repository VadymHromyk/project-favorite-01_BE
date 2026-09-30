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

locationsRouter.get("/locations", celebrate(getLocationsSchema), getLocations);
locationsRouter.get("/locations", getLocations);

locationsRouter.post(
  "/locations",
  authenticate,
  uploadLocationImage,
  celebrate(createLocationSchema),
  createLocation,
);

locationsRouter.get("/locations/:id", getLocationById);

export default locationsRouter;
