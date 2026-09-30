import { Router } from "express";
import { celebrate } from "celebrate";
import { getFeedbacks } from "../controllers/feedbackController.js";
// Імпортуємо схему валідації для методу GET
import { feedbackQuerySchema } from "../validations/feedbackValidation.js";
import { createFeedback } from "../controllers/feedbackController.js";
import { createFeedbackSchema } from "../validations/feedbackValidation.js";
import { authenticate } from "../middlewares/authenticate.js";
const router = Router();

// ПУБЛІЧНИЙ ендпоінт для отримання відгуків з валідацією вхідних параметрів
router.get("/", celebrate(feedbackQuerySchema), getFeedbacks);
router.post("/", authenticate, celebrate(createFeedbackSchema), createFeedback);

export default router;
