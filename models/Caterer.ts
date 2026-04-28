import mongoose, { Schema, Document } from 'mongoose';

export interface ICatererMedia {
  mediaId: mongoose.Types.ObjectId;
  customText?: string;
}

export interface ICaterer extends Document {
  name: string;
  description: string;
  services: string[];
  categories: string[];
  mediaCollection: ICatererMedia[];
  coverImageId?: mongoose.Types.ObjectId;
  isPublished: boolean;
}

const CatererMediaSchema = new Schema<ICatererMedia>({
  mediaId: { type: Schema.Types.ObjectId, ref: 'Media', required: true },
  customText: { type: String },
});

const CatererSchema = new Schema<ICaterer>(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    services: [{ type: String }],
    categories: [{ type: String }],
    mediaCollection: [CatererMediaSchema],
    coverImageId: { type: Schema.Types.ObjectId, ref: 'Media' },
    isPublished: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// Force refresh for development HMR
if (mongoose.models.Caterer) {
  delete mongoose.models.Caterer;
}

export default mongoose.model<ICaterer>('Caterer', CatererSchema);
