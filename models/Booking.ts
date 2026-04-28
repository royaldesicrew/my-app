import mongoose, { Schema, Document } from 'mongoose';

export interface IBooking extends Document {
  name: string;
  email: string;
  phone: string;
  service: string; // ID or Name
  package: string; // ID or Name
  venue: string;   // ID or Name
  caterer: string; // ID or Name
  artist: string;  // ID or Name
  budget: number;
  guests: string;
  notes: string;
  status: 'pending' | 'contacted' | 'confirmed' | 'cancelled';
}

const BookingSchema = new Schema<IBooking>(
  {
    name: { type: String, required: true },
    email: { type: String },
    phone: { type: String, required: true },
    service: { type: String },
    package: { type: String },
    venue: { type: String },
    caterer: { type: String },
    artist: { type: String },
    budget: { type: Number },
    guests: { type: String },
    notes: { type: String },
    status: { type: String, enum: ['pending', 'contacted', 'confirmed', 'cancelled'], default: 'pending' },
  },
  { timestamps: true }
);

// Force refresh for development HMR
if (mongoose.models.Booking) {
  delete mongoose.models.Booking;
}

export default mongoose.model<IBooking>('Booking', BookingSchema);
