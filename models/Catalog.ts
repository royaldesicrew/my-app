import mongoose, { Schema, Document } from 'mongoose';

export interface ICatalog extends Document {
  title: string;
  category: string;
  fileUrl: string;
  thumbnailUrl?: string;
  isPublished: boolean;
  order: number;
}

const CatalogSchema = new Schema<ICatalog>(
  {
    title: { type: String, required: true },
    category: { type: String, required: true },
    fileUrl: { type: String, required: true },
    thumbnailUrl: { type: String },
    isPublished: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.models.Catalog || mongoose.model<ICatalog>('Catalog', CatalogSchema);
