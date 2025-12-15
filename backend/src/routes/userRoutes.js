import express from 'express';
import { authenticate, authorize } from '../middleware/authMiddleware.js';
import { getProfile, updateProfile, uploadAvatar, changePassword } from '../controllers/userController.js';
import { uploadAvatar as uploadMiddleware, handleMulterError } from '../middleware/uploadMiddleware.js';

const router = express.Router();

// Get user profile
router.get('/profile', authenticate, getProfile);

// Update user profile
router.put('/profile', authenticate, updateProfile);

// Upload avatar
router.post('/profile/avatar', authenticate, uploadMiddleware, handleMulterError, uploadAvatar);

// Change password
router.put('/change-password', authenticate, changePassword);

// Get all users (admin only)
router.get('/', authenticate, authorize('admin'), (req, res) => {
  res.json({ message: 'All users' });
});

export default router;