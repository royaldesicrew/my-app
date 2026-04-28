import mongoose, { Schema, Document } from 'mongoose';

export interface IGalleryItem extends Document {
  mediaId: mongoose.Types.ObjectId;
  categoryId: mongoose.Types.ObjectId;
  title?: string;
  description?: string;
  order: number;
  isPublished: boolean;
}

const GalleryItemSchema = new Schema<IGalleryItem>(
  {
    mediaId: { type: Schema.Types.ObjectId, ref: 'Media', required: true },
    categoryId: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
    title: { type: String },
    description: { type: String },
    order: { type: Number, default: 0 },
    isPublished: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.models.GalleryItem || mongoose.model<IGalleryItem>('GalleryItem', GalleryItemSchema);
