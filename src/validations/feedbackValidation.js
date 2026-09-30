import { Joi, Segments } from "celebrate";

// Універсальна перевірка ідентифікатора MongoDB (ObjectId)
const objectId = Joi.string().hex().length(24);

const feedbackSchemaShape = Joi.object({
  locationId: objectId.required(),
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10),
});

export const feedbackQuerySchema = {
  [Segments.QUERY]: feedbackSchemaShape,
  [Segments.BODY]: feedbackSchemaShape,
};

export const createFeedbackSchema = {
  [Segments.BODY]: Joi.object({
    locationId: objectId.required(),
    userName: Joi.string().min(2).max(32).required(),
    rate: Joi.number().integer().min(1).max(5).required(),
    description: Joi.string().min(1).max(200).required(),
  }),
};
