import { Segments, Joi } from "celebrate";
import { locationsSortFields } from "../constants/locationsConstants.js";
import { idSchema } from "./index.js";

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

export const updateLocationSchema = {
  [Segments.PARAMS]: Joi.object({
    id: idSchema.required(),
  }),
  [Segments.BODY]: Joi.object({
    name: Joi.string().messages({
      "any.required": "name must be exist",
    }),
    description: Joi.string().messages({
      "any.required": "description must be exist",
    }),
    type: Joi.string(),
    // type: Joi.string().valid(...typeTypeList),
    region: Joi.string(),
    // region: Joi.string().valid(...regionTypeList),
  }).min(1),
};
