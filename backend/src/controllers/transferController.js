import mongoose from 'mongoose';
import Batch from '../models/Batch.js';
import User from '../models/User.js';

const ALLOWED_TRANSITIONS = [
  ['manufacturer', 'distributor'],
  ['distributor', 'pharmacist'],
  ['pharmacist', 'consumer'],
];

function isAllowedTransition(roleFrom, roleTo) {
  return ALLOWED_TRANSITIONS.some(([from, to]) => from === roleFrom && to === roleTo);
}

export async function transferBatch(req, res) {
  try {
    const { batchId } = req.params;
    const { targetUserId } = req.body;

    if (!targetUserId) {
      return res.status(400).json({ message: 'targetUserId is required' });
    }

    const batch = await Batch.findOne({ batchId });
    if (!batch) {
      return res.status(404).json({ message: 'Batch not found' });
    }

    const currentOwnerId = String(batch.currentOwner);
    const requesterId = String(req.user.id);
    if (currentOwnerId !== requesterId) {
      return res.status(403).json({ message: 'Only current owner can transfer' });
    }

    const targetUser = await User.findById(targetUserId).select('role').lean();
    if (!targetUser) {
      return res.status(404).json({ message: 'Target user not found' });
    }

    const roleFrom = req.user.role;
    const roleTo = targetUser.role;
    if (!isAllowedTransition(roleFrom, roleTo)) {
      return res.status(403).json({
        message: 'Invalid transfer. Allowed: manufacturer→distributor, distributor→pharmacist, pharmacist→consumer',
      });
    }

    const fromId = batch.currentOwner;
    const toId = new mongoose.Types.ObjectId(targetUserId);

    batch.ownershipHistory.push({
      from: fromId,
      to: toId,
      roleFrom,
      roleTo,
      timestamp: new Date(),
    });
    batch.currentOwner = toId;
    batch.timeline.push({
      event: `Transferred from ${roleFrom} to ${roleTo}`,
      timestamp: new Date(),
    });
    await batch.save();

    return res.status(200).json({
      batchId: batch.batchId,
      newOwner: targetUserId,
      currentRole: roleTo,
      ownershipHistory: batch.ownershipHistory,
    });
  } catch (err) {
    res.status(500).json({ message: err.message || 'Transfer failed' });
  }
}
