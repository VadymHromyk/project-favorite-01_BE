import { Router } from "express";
import { celebrate } from "celebrate";
import { getLocations } from "../controllers/locationsController.js";
import { getLocationsSchema } from "../validation/locationsValidation.js";

const locationsRouter = Router();

locationsRouter.get("/locations", celebrate(getLocationsSchema), getLocations);
locationsRouter.get("/locations", getLocations);

export default locationsRouter;
