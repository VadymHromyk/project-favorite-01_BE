import { Router } from 'express';
import { celebrate } from 'celebrate';
import { createFeedback } from '../controllers/FeedbackController.js';
import { createFeedbackSchema } from '../validations/FeedbackValidation.js';
import { authenticate } from '../middlewares/authenticate.js';

const router = Router();

router.post('/', authenticate, celebrate(createFeedbackSchema), createFeedback);

export default router;
