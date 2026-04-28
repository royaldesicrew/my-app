import mongoose, { Schema, Document } from 'mongoose';

export interface IArtist extends Document {
  name: string;
  category: string;
  bio: string;
  coverImageId?: mongoose.Types.ObjectId;
  isPublished: boolean;
}

const ArtistSchema = new Schema<IArtist>(
  {
    name: { type: String, required: true },
    category: { type: String, required: true },
    bio: { type: String },
    coverImageId: { type: Schema.Types.ObjectId, ref: 'Media' },
    isPublished: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// Force refresh for development HMR
if (mongoose.models.Artist) {
  delete mongoose.models.Artist;
}

export default mongoose.model<IArtist>('Artist', ArtistSchema);
