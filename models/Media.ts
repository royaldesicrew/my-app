import mongoose, { Schema, Document } from 'mongoose';

export interface IMedia extends Document {
  url: string;
  publicId: string;
  format: string;
  title?: string;
  caption?: string;
  linkedModule?: 'Gallery' | 'Venues' | 'Caterers' | 'General';
}

const MediaSchema = new Schema<IMedia>(
  {
    url: { type: String, required: true },
    publicId: { type: String, required: true },
    format: { type: String, required: true },
    title: { type: String },
    caption: { type: String },
    linkedModule: {
      type: String,
      enum: ['Gallery', 'Venues', 'Caterers', 'General'],
      default: 'General',
    },
  },
  { timestamps: true }
);

export default mongoose.models.Media || mongoose.model<IMedia>('Media', MediaSchema);
