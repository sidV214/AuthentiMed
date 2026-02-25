import crypto from 'crypto';
import Batch from '../models/Batch.js';
import { verifyMedicine } from '../services/verification/verificationService.js';
import { storeOnBlockchain } from '../services/blockchainService.js';
import { generateQrUrl } from '../services/qrService.js';

console.log("=== BATCH CONTROLLER FILE LOADED ===");

export async function createBatch(req, res) {
  try {
    const { batchId: clientBatchId, medicineName, quantity, manufacturingDate, packagingImages: rawPackagingImages, certificates = [] } = req.body;
    const manufacturerId = req.user.id;

    const packagingImages = Array.isArray(rawPackagingImages)
      ? rawPackagingImages
      : typeof rawPackagingImages === 'string' && rawPackagingImages.trim()
        ? [rawPackagingImages.trim()]
        : [];

    if (!medicineName || quantity == null || !manufacturingDate) {
      return res.status(400).json({ message: 'medicineName, quantity and manufacturingDate are required' });
    }

    const batchId = clientBatchId && typeof clientBatchId === 'string' && clientBatchId.trim()
      ? clientBatchId.trim()
      : crypto.randomUUID();
    const timeline = [{ event: 'Batch created', timestamp: new Date() }];

    const batch = await Batch.create({
      batchId,
      medicineName,
      quantity: Number(quantity),
      manufacturingDate: new Date(manufacturingDate),
      manufacturer: manufacturerId,
      currentOwner: manufacturerId,
      ownershipHistory: [],
      packagingImages,
      certificates: Array.isArray(certificates) ? certificates : [],
      status: 'pending',
      timeline,
    });

    const firstImageUrl = batch.packagingImages?.[0] && String(batch.packagingImages[0]).trim() ? String(batch.packagingImages[0]).trim() : null;
    let score = 0;

    console.log("firstImageUrl value:", firstImageUrl);
console.log("typeof firstImageUrl:", typeof firstImageUrl);

    console.log('firstImageUrl:', firstImageUrl);
    if (firstImageUrl) {
      try {
        console.log("About to call verifyMedicine()");
        score = await verifyMedicine(firstImageUrl);
      } catch (err) {
        console.error('createBatch verifyMedicine error:', err?.message);
        batch.aiConfidenceScore = 0;
        batch.status = 'failed';
        batch.timeline.push({ event: 'AI verification failed', timestamp: new Date() });
        await batch.save();
        return res.status(201).json(batch);
      }
    }

    batch.aiConfidenceScore = score;

    if (score >= 85) {
      batch.status = 'verified';
      batch.timeline.push({ event: 'AI verification passed', timestamp: new Date() });

      const payload = `${batchId}${medicineName}${quantity}${manufacturingDate}${manufacturerId}`;
      const hashHex = '0x' + crypto.createHash('sha256').update(payload).digest('hex');

      try {
        const txHash = await storeOnBlockchain(hashHex);
        batch.blockchainTxHash = txHash;
        batch.timeline.push({ event: 'Blockchain record created', timestamp: new Date() });

        const qrCodeUrl = await generateQrUrl(txHash);
        batch.qrCodeUrl = qrCodeUrl;
        batch.timeline.push({ event: 'QR generated', timestamp: new Date() });
      } catch (err) {
        console.error("===== BLOCKCHAIN ERROR START =====");
        console.error(err);
        console.error("Error message:", err?.message);
        console.error("Error reason:", err?.reason);
        console.error("===== BLOCKCHAIN ERROR END =====");
      
        batch.status = 'failed';
        batch.timeline.push({
          event: 'Blockchain record failed',
          timestamp: new Date(),
          error: err?.message || 'Unknown blockchain error'
        });
      }
    } else {
      batch.status = 'failed';
      batch.timeline.push({ event: 'AI verification failed', timestamp: new Date() });
    }

    await batch.save();
    return res.status(201).json(batch);
  } catch (err) {
    res.status(500).json({ message: err.message || 'Failed to create batch' });
  }
}

export async function getManufacturerBatches(req, res) {
  try {
    const manufacturerId = req.user.id;
    const batches = await Batch.find({ manufacturer: manufacturerId })
      .populate('currentOwner', 'name role')
      .sort({ createdAt: -1 });
    return res.status(200).json(batches);
  } catch (err) {
    res.status(500).json({ message: err.message || 'Failed to fetch batches' });
  }
}
