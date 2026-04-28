import mongoose, { Schema, Document } from 'mongoose';

export interface IVenueMedia {
  mediaId: mongoose.Types.ObjectId;
  customText?: string;
}

export interface IVenue extends Document {
  name: string;
  location: string;
  description: string;
  category: string;
  coverImageId?: mongoose.Types.ObjectId;
  metadata: Record<string, any>;
  mediaCollection: IVenueMedia[];
  isPublished: boolean;
}

const VenueMediaSchema = new Schema<IVenueMedia>({
  mediaId: { type: Schema.Types.ObjectId, ref: 'Media', required: true },
  customText: { type: String },
});

const VenueSchema = new Schema<IVenue>(
  {
    name: { type: String, required: true },
    location: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    coverImageId: { type: Schema.Types.ObjectId, ref: 'Media' },
    metadata: { type: Schema.Types.Mixed, default: {} },
    mediaCollection: [VenueMediaSchema],
    isPublished: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// Force refresh for development HMR
if (mongoose.models.Venue) {
  delete mongoose.models.Venue;
}

export default mongoose.model<IVenue>('Venue', VenueSchema);
