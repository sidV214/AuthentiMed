/**
 * Temporary mock verifier. No external API calls.
 * Used when VERIFIER_TYPE=mock (e.g. during quota limits or hackathon).
 */

export async function verify(imageUrl) {
  console.log('[mockVerifier] Mock verification used for image:', imageUrl ? `${imageUrl.slice(0, 50)}...` : 'none');
  const score = Math.floor(Math.random() * (100 - 70 + 1)) + 70;
  return score;
}
