import Batch from '../models/Batch.js';

export async function getAllBatches(req, res) {
  try {
    const batches = await Batch.find()
      .select('batchId medicineName status aiConfidenceScore currentOwner isFlagged isBlacklisted')
      .sort({ createdAt: -1 })
      .lean();
    return res.status(200).json(batches);
  } catch (err) {
    res.status(500).json({ message: err.message || 'Failed to fetch batches' });
  }
}

export async function getFailedBatches(req, res) {
  try {
    const batches = await Batch.find({ status: 'failed' })
      .sort({ createdAt: -1 })
      .lean();
    return res.status(200).json(batches);
  } catch (err) {
    res.status(500).json({ message: err.message || 'Failed to fetch failed batches' });
  }
}

export async function flagBatch(req, res) {
  try {
    const { batchId } = req.params;
    const batch = await Batch.findOne({ batchId });
    if (!batch) {
      return res.status(404).json({ message: 'Batch not found' });
    }
    batch.isFlagged = true;
    batch.timeline.push({ event: 'Flagged by regulator', timestamp: new Date() });
    await batch.save();
    return res.status(200).json(batch);
  } catch (err) {
    res.status(500).json({ message: err.message || 'Failed to flag batch' });
  }
}

export async function blacklistBatch(req, res) {
  try {
    const { batchId } = req.params;
    const batch = await Batch.findOne({ batchId });
    if (!batch) {
      return res.status(404).json({ message: 'Batch not found' });
    }
    batch.isBlacklisted = true;
    batch.status = 'failed';
    batch.timeline.push({ event: 'Blacklisted by regulator', timestamp: new Date() });
    await batch.save();
    return res.status(200).json(batch);
  } catch (err) {
    res.status(500).json({ message: err.message || 'Failed to blacklist batch' });
  }
}

export async function addRegulatorNote(req, res) {
  try {
    const { batchId } = req.params;
    const { note } = req.body;
    if (!note || typeof note !== 'string' || !note.trim()) {
      return res.status(400).json({ message: 'note is required' });
    }
    const batch = await Batch.findOne({ batchId });
    if (!batch) {
      return res.status(404).json({ message: 'Batch not found' });
    }
    batch.regulatorNotes.push({
      note: note.trim(),
      regulator: req.user.id,
      timestamp: new Date(),
    });
    batch.timeline.push({ event: 'Regulator note added', timestamp: new Date() });
    await batch.save();
    return res.status(200).json(batch);
  } catch (err) {
    res.status(500).json({ message: err.message || 'Failed to add note' });
  }
}
