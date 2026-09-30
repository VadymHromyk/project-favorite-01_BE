import { Segments, Joi } from "celebrate";
import { idSchema } from "./idValidaion.js";

export const getUserByIdSchema = {
  [Segments.PARAMS]: Joi.object({
    userId: idSchema.required(),
  }),
};

export const userUpdateSchema = {
  [Segments.BODY]: Joi.object({
    name: Joi.string().min(2).max(32).optional(),
    email: Joi.string().email().optional(),
  }),
};
