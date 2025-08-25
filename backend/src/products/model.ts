import mongoose, { Types } from 'mongoose';
const { Schema } = mongoose;

export interface CreateProduct {
  id?: string;
  name: string;
  categoryId: Types.ObjectId;
  price: number;
  attributes: Record<string, unknown>;
};

export interface IProduct extends CreateProduct {
  _id: Types.ObjectId;
};

const productSchema = new Schema<IProduct>({
  id: { type: String, required: true, unique: true},
  name: { type: String, required: true },
  price: { type: Number, required: true },
  categoryId: { type: Schema.Types.ObjectId, required: true, unique: true, ref: 'Category'},
  attributes: { type: Map, of: Schema.Types.Mixed, default: {} }
});

export const Product = mongoose.model<IProduct>('Product', productSchema);