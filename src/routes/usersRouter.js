import express from 'express';
import {
  getCurrentUser,
  getUserById,
} from '../controllers/usersController.js';
import { authenticate } from '../middlewares/authenticate.js';

const usersRouter = express.Router();

usersRouter.get('/me', authenticate, getCurrentUser);

usersRouter.get('/:userId', getUserById);

export default usersRouter;