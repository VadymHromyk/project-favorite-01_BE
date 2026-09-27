import { Region } from "../models/region.js";
import { LocationType } from "../models/locationType.js";

export const getCategories = async (req, res) => {
  const [regions, locationTypes] = await Promise.all([
    Region.find(),
    LocationType.find(),
  ]);

  res.status(200).json({
    regions,
    locationTypes,
  });
};
