import { Joi } from "celebrate";

// Універсальна перевірка ідентифікатора MongoDB (ObjectId)

export const idSchema = Joi.string().hex().length(24).messages({
  "string.hex": "invalid id format",
  "string.length": "invalid id length",
});
