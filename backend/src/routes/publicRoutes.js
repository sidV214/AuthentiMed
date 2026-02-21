import express from 'express';
import { getPublicBatch } from '../controllers/publicController.js';

const router = express.Router();

router.get('/batches/:batchId', getPublicBatch);

export default router;
