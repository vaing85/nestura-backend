
import mongoose, { Document, Schema } from 'mongoose';

export interface IBooking extends Document {
  property: mongoose.Types.ObjectId;
  booker: mongoose.Types.ObjectId;
  startDate: Date;
  endDate: Date;
  guests: number;
  status: 'pending' | 'confirmed' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
}

const bookingSchema = new Schema<IBooking>(
  {
    property: { type: Schema.Types.ObjectId, ref: 'Property', required: true },
    booker: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    guests: { type: Number, required: true },
    status: { type: String, enum: ['pending', 'confirmed', 'cancelled'], default: 'pending' },
  },
  { timestamps: true }
);

const Booking = mongoose.model<IBooking>('Booking', bookingSchema);
export default Booking;
