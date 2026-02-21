import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import authorizeRoles from '../middleware/roleMiddleware.js';
import {
  getAllBatches,
  getFailedBatches,
  flagBatch,
  blacklistBatch,
  addRegulatorNote,
} from '../controllers/regulatorController.js';

const router = express.Router();
const regulatorOnly = [authMiddleware, authorizeRoles('regulator')];

router.get('/regulator/batches/failed', regulatorOnly, getFailedBatches);
router.get('/regulator/batches', regulatorOnly, getAllBatches);
router.post('/regulator/batches/:batchId/flag', regulatorOnly, flagBatch);
router.post('/regulator/batches/:batchId/blacklist', regulatorOnly, blacklistBatch);
router.post('/regulator/batches/:batchId/note', regulatorOnly, addRegulatorNote);

export default router;
