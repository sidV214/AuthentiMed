import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import authorizeRoles from '../middleware/roleMiddleware.js';
import { createBatch, getManufacturerBatches } from '../controllers/batchController.js';

const router = express.Router();

router.get('/', authMiddleware, authorizeRoles('manufacturer'), getManufacturerBatches);
router.post('/', authMiddleware, authorizeRoles('manufacturer'), createBatch);

export default router;
