/**
 * Placeholder for future ML-based verification.
 *
 * Later we will:
 * - Train ML model on real & counterfeit packaging dataset
 * - Export trained model (TensorFlow / PyTorch / ONNX)
 * - Integrate inference here: either in-process (e.g. ONNX runtime)
 *   or via a Python ML microservice API call
 *
 * This is the only file that should need changes when switching to real ML.
 */

export async function verify(imageUrl) {
  console.log('[mlVerifier] ML verifier not yet implemented');
  return 0;
}
