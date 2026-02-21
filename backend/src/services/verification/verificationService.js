/**
 * Abstraction layer for medicine packaging verification.
 * Controllers call verifyMedicine() only; the implementation is selected by VERIFIER_TYPE.
 *
 * Later we will:
 * - Train ML model on real & counterfeit packaging dataset
 * - Export trained model
 * - Integrate inference inside mlVerifier.js
 * - Possibly move ML into separate microservice
 *
 * Switching to ML requires editing only mlVerifier.js (and setting VERIFIER_TYPE=ml).
 */

import { verify as mockVerify } from './mockVerifier.js';
import { verify as mlVerify } from './mlVerifier.js';

const VERIFIER_TYPE = process.env.VERIFIER_TYPE || 'mock';

export async function verifyMedicine(imageUrl) {
  if (VERIFIER_TYPE === 'ml') {
    return mlVerify(imageUrl);
  }
  return mockVerify(imageUrl);
}
