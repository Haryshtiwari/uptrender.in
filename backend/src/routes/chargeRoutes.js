import express from 'express';
import * as chargeController from '../controllers/chargeController.js';

const router = express.Router();

// Get all charges
router.get('/', chargeController.getAllCharges);

// Get charge by ID
router.get('/:id', chargeController.getChargeById);

// Get charge by type
router.get('/type/:type', chargeController.getChargeByType);

// Create or update charge (upsert)
router.post('/', chargeController.upsertCharge);

// Update charge
router.put('/:id', chargeController.updateCharge);

// Delete charge
router.delete('/:id', chargeController.deleteCharge);

export default router;
