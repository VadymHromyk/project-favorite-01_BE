import { Segments, Joi } from "celebrate";
import { idSchema } from "./idValidaion.js";

export const getUserByIdSchema = {
  [Segments.PARAMS]: Joi.object({
    userId: idSchema.required(),
  }),
};
