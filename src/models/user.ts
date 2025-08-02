import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  email: string;
  password: string;
  name: string;
  role: 'booker' | 'owner' | 'admin';
  status: 'pending' | 'approved' | 'rejected' | 'suspended';
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
}

// Remove the generic type from Schema to allow extra fields
const userSchema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  role: { type: String, enum: ['booker', 'owner', 'admin'], required: true },
  status: { type: String, enum: ['pending', 'approved', 'rejected', 'suspended'], default: 'pending', required: true },
  resetPasswordToken: { type: String },
  resetPasswordExpires: { type: Date },
});

const User = mongoose.model<IUser>('User', userSchema);
export default User;
