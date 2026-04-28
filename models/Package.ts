import mongoose from 'mongoose';

const PackageSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  price: { type: String, required: true },
  features: [{ type: String }],
  isMostRequested: { type: Boolean, default: false },
  isBestValue: { type: Boolean, default: false },
  order: { type: Number, default: 0 },
}, { timestamps: true });

export default mongoose.models.Package || mongoose.model('Package', PackageSchema);
