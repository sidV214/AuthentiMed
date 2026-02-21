import mongoose from 'mongoose';

const timelineEventSchema = new mongoose.Schema(
  {
    event: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
  },
  { _id: false }
);

const ownershipEntrySchema = new mongoose.Schema(
  {
    from: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    to: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    roleFrom: { type: String },
    roleTo: { type: String },
    timestamp: { type: Date, default: Date.now },
  },
  { _id: false }
);

const regulatorNoteSchema = new mongoose.Schema(
  {
    note: { type: String, required: true },
    regulator: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    timestamp: { type: Date, default: Date.now },
  },
  { _id: false }
);

const batchSchema = new mongoose.Schema(
  {
    batchId: { type: String, required: true, unique: true },
    medicineName: { type: String, required: true },
    quantity: { type: Number, required: true },
    manufacturingDate: { type: Date, required: true },
    manufacturer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    currentOwner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    ownershipHistory: { type: [ownershipEntrySchema], default: [] },
    packagingImages: [{ type: String }],
    certificates: [{ type: String }],
    aiConfidenceScore: { type: Number },
    status: {
      type: String,
      enum: ['pending', 'verified', 'failed'],
      default: 'pending',
    },
    blockchainTxHash: { type: String },
    qrCodeUrl: { type: String },
    timeline: [timelineEventSchema],
    isFlagged: { type: Boolean, default: false },
    isBlacklisted: { type: Boolean, default: false },
    regulatorNotes: { type: [regulatorNoteSchema], default: [] },
  },
  { timestamps: true }
);

export default mongoose.model('Batch', batchSchema);
