import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import authorizeRoles from '../middleware/roleMiddleware.js';
import { createBatch } from '../controllers/batchController.js';

const router = express.Router();

router.post('/', authMiddleware, authorizeRoles('manufacturer'), createBatch);

export default router;
