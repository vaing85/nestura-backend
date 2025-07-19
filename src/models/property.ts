import mongoose, { Document, Schema } from 'mongoose';


export interface IProperty extends Document {
  title: string;
  description: string;
  address: string;
  price: number;
  owner: mongoose.Types.ObjectId;
  images: string[];
}


const propertySchema = new Schema<IProperty>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  address: { type: String, required: true },
  price: { type: Number, required: true },
  owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  images: [{ type: String }],
});

const Property = mongoose.model<IProperty>('Property', propertySchema);
export default Property;
