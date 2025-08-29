import mongoose, { Types } from 'mongoose';
const { Schema } = mongoose;

export interface CreateProduct {
  id?: string;
  name: string;
  categoryId: Types.ObjectId;
  price: number;
  salePrice?: number;
  cost?: number;
  description?: string;
  src?: string;
  alt?: string;
  isFeatured?: boolean;
  attributes: Record<string, unknown>;
};

export interface IProduct extends CreateProduct {
  _id: Types.ObjectId;
};

const productSchema = new Schema<IProduct>({
  id: { type: String, required: true, unique: true},
  name: { type: String, required: true },
  price: { type: Number, required: true },
  salePrice: { type: Number, required: false },
  cost: { type: Number, required: false },
  description: { type: String, required: false },
  src: { type: String, required: false },
  alt: { type: String, required: false },
  categoryId: { type: Schema.Types.ObjectId, required: true, ref: 'Category'},
  isFeatured: { type: Boolean, default: false},
  attributes: { type: Map, of: Schema.Types.Mixed, default: {} }
});

export const Product = mongoose.model<IProduct>('Product', productSchema);