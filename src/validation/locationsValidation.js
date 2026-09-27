import { Segments, Joi } from "celebrate";
import { locationsSortFields } from "../constants/locationsConstants.js";

export const getLocationsSchema = {
  [Segments.QUERY]: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    perPage: Joi.number().integer().min(1).max(1000).default(10),
    sortBy: Joi.string()
      .valid(...locationsSortFields)
      .default("_id"),
    sortOrder: Joi.string().valid("asc", "desc").default("asc"),
    type: Joi.string(),
    // type: Joi.string().valid(...typeTypeList),
    region: Joi.string(),
    // region: Joi.string().valid(...regionTypeList),
    rate: Joi.number().min(0).max(5),
    search: Joi.string().trim(),
  }),
};

export const createLocationSchema = {
  [Segments.BODY]: Joi.object({
    name: Joi.string().min(3).max(96).required(),
    type: Joi.string().max(64).required(),
    region: Joi.string().max(64).required(),
    description: Joi.string().min(20).max(6000).required(),
  }),
};
