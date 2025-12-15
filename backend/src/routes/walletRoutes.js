import express from 'express';
import { authenticate } from '../middleware/authMiddleware.js';
import { roleCheck } from '../middleware/roleCheck.js';
import { 
  getUserWallet, 
  getWalletTransactions, 
  addFunds, 
  withdrawFunds, 
  getWalletStats,
  freezeWallet,
  unfreezeWallet,
  getAllWallets
} from '../controllers/walletController.js';
import { 
  addFundsValidation, 
  withdrawFundsValidation, 
  idParamValidation,
  paginationValidation
} from '../middleware/validation.js';

const router = express.Router();

// User wallet routes
router.get('/', authenticate, getUserWallet);
router.get('/transactions', authenticate, paginationValidation, getWalletTransactions);
router.get('/stats', authenticate, getWalletStats);
router.post('/add-funds', authenticate, addFundsValidation, addFunds);
router.post('/withdraw', authenticate, withdrawFundsValidation, withdrawFunds);

// Admin routes
router.get('/admin/all', authenticate, roleCheck(['Admin']), paginationValidation, getAllWallets);
router.post('/admin/:userId/freeze', authenticate, roleCheck(['Admin']), idParamValidation, freezeWallet);
router.post('/admin/:userId/unfreeze', authenticate, roleCheck(['Admin']), idParamValidation, unfreezeWallet);

export default router;
