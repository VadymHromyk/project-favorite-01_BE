import { Router } from "express";
import { celebrate } from "celebrate";

import { upload } from "../middlewares/multer.js";

import {
  createLocation,
  getLocations,
  getLocationById,
  updateLocationId,
} from "../controllers/locationsController.js";
import {
  getLocationsSchema,
  createLocationSchema,
} from "../validation/locationsValidation.js";
import { authenticate } from "../middlewares/authenticate.js";
import { uploadLocationImage } from "../middlewares/uploadLocationImage.js";
import { updateLocationSchema } from "../validations/locationsValidation.js";

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

locationsRouter.post(
  "/locations",
  authenticate,
  uploadLocationImage,
  celebrate(createLocationSchema),
  createLocation,
);

locationsRouter.get("/locations/:id", getLocationById);

export default locationsRouter;
