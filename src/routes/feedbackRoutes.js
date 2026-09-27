import { Router } from 'express';
import { celebrate } from 'celebrate';
import { getFeedbacks } from '../controllers/feedbackController.js';
// Імпортуємо схему валідації для методу GET
import { feedbackQuerySchema } from '../validations/feedbackValidation.js';

const router = Router();

// ПУБЛІЧНИЙ ендпоінт для отримання відгуків з валідацією вхідних параметрів
router.get('/feedbacks', celebrate(feedbackQuerySchema), getFeedbacks);

export default router;
