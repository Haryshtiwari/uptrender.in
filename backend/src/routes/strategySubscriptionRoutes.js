import express from 'express';
import { authenticate } from '../middleware/authMiddleware.js';
import {
  subscribeToStrategy,
  unsubscribeFromStrategy,
  updateSubscription,
  getUserSubscriptions,
  getSubscriptionById
} from '../controllers/strategySubscriptionController.js';
import {
  idParamValidation,
  paginationValidation
} from '../middleware/validation.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Subscribe to a strategy
router.post('/subscribe', subscribeToStrategy);

// Unsubscribe from a strategy
router.delete('/:id', idParamValidation, unsubscribeFromStrategy);

// Update subscription (only lots)
router.put('/:id', idParamValidation, updateSubscription);

// Get user's subscriptions
router.get('/', paginationValidation, getUserSubscriptions);

// Get subscription by ID
router.get('/:id', idParamValidation, getSubscriptionById);

export default router;