import { Joi, Segments } from 'celebrate';

// Універсальна перевірка ідентифікатора MongoDB (ObjectId)
const objectId = Joi.string().hex().length(24);

export const feedbackQuerySchema = {
  [Segments.QUERY]: Joi.object({
    locationId: objectId,
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(10),
  }),
};
