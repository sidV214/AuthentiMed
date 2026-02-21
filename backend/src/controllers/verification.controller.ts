import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { sendResponse } from '../utils/response';

interface VerificationBody {
  drugId: string;
  batchNumber: string;
}

export const verifyDrug = (
  req: Request<unknown, unknown, VerificationBody>,
  res: Response
): Response => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return sendResponse(res, 400, {
      success: false,
      message: 'Validation failed',
      data: errors.array()
    });
  }

  return sendResponse(res, 200, {
    success: true,
    message: 'Verification endpoint ready. AI and Blockchain integration pending.'
  });
};
