import { Joi } from "celebrate";
import { isValidObjectId } from "mongoose";
export const objectIdValidator = (value, helpers) => {
  return isValidObjectId(value) ? value : helpers.message("invalid id format");
};

export const idSchema = Joi.string().custom(objectIdValidator);
