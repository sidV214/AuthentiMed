import Batch from '../models/Batch.js';

function getAuthenticityLabel(status) {
  if (status === 'verified') return 'Authentic';
  if (status === 'failed') return 'Suspicious';
  return 'Pending';
}

export async function getPublicBatch(req, res) {
  try {
    const { batchId } = req.params;
    const batch = await Batch.findOne({ batchId })
      .populate('manufacturer', 'name email')
      .lean();

    if (!batch) {
      return res.status(404).json({ message: 'Batch not found' });
    }

    const manufacturer = batch.manufacturer
      ? { name: batch.manufacturer.name, email: batch.manufacturer.email }
      : null;

    const authenticityLabel = getAuthenticityLabel(batch.status);

    const payload = {
      batchId: batch.batchId,
      medicineName: batch.medicineName,
      quantity: batch.quantity,
      manufacturingDate: batch.manufacturingDate,
      manufacturer,
      status: batch.status,
      aiConfidenceScore: batch.aiConfidenceScore,
      blockchainTxHash: batch.blockchainTxHash,
      qrCodeUrl: batch.qrCodeUrl,
      timeline: batch.timeline,
      authenticityLabel,
    };

    if (batch.status !== 'verified') {
      payload.warning = 'This batch did not pass verification.';
    }

    return res.status(200).json(payload);
  } catch (err) {
    res.status(500).json({ message: err.message || 'Failed to fetch batch' });
  }
}
