import { Router } from "express";
import { celebrate } from "celebrate";

import {
  createLocation,
  getLocations,
  getLocationById,
  updateLocationId,
} from "../controllers/locationsController.js";
import { authenticate } from "../middlewares/authenticate.js";
import { uploadLocationImage } from "../middlewares/uploadLocationImage.js";
import {
  getLocationsSchema,
  createLocationSchema,
  updateLocationSchema,
  updateLocationByIdSchema,
} from "../validations/locationsValidation.js";

const locationsRouter = Router();

locationsRouter.get("/", celebrate(getLocationsSchema), getLocations);

locationsRouter.patch(
  "/:id",
  authenticate,
  uploadLocationImage,
  celebrate(updateLocationSchema, { abortEarly: false }),
  updateLocationId,
);

locationsRouter.post(
  "/",
  authenticate,
  uploadLocationImage,
  celebrate(createLocationSchema, { abortEarly: false }),
  createLocation,
);

locationsRouter.get(
  "/:id",
  celebrate(updateLocationByIdSchema),
  getLocationById,
);

export default locationsRouter;
