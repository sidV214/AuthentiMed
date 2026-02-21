import { Router } from 'express';
import { body } from 'express-validator';
import { verifyDrug } from '../controllers/verification.controller';

const verificationRouter = Router();

verificationRouter.post(
  '/verify',
  [
    body('drugId').isString().trim().notEmpty().withMessage('drugId is required'),
    body('batchNumber')
      .isString()
      .trim()
      .notEmpty()
      .withMessage('batchNumber is required')
  ],
  verifyDrug
);

export default verificationRouter;
