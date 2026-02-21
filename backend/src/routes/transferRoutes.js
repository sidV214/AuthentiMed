import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import { transferBatch } from '../controllers/transferController.js';

const router = express.Router();

router.post('/batches/:batchId/transfer', authMiddleware, transferBatch);

export default router;
