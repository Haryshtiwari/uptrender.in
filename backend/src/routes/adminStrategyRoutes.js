import express from 'express';
import { authenticate, authorize } from '../middleware/authMiddleware.js';
import {
  getAllStrategies,
  getStrategyById,
  updateStrategy,
  deleteStrategy,
  toggleStrategyStatus,
  getStrategyStats
} from '../controllers/adminStrategyController.js';

const router = express.Router();

// All routes require authentication and admin authorization
router.use(authenticate);
router.use(authorize('admin'));

// Get strategy statistics
router.get('/stats', getStrategyStats);

// Get all strategies
router.get('/', getAllStrategies);

// Get strategy by ID
router.get('/:id', getStrategyById);

// Update strategy
router.put('/:id', updateStrategy);

// Delete strategy
router.delete('/:id', deleteStrategy);

// Toggle strategy status
router.post('/:id/toggle-status', toggleStrategyStatus);

export default router;
