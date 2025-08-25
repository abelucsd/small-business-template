import mongoose, { Types } from 'mongoose';
const { Schema } = mongoose;

export interface CreateCategory {
  id?: string;
  name: string;  
};

export interface ICategory extends CreateCategory {
  _id: Types.ObjectId;
};

const categorySchema = new Schema<ICategory>({
  id: { type: String, required: true, unique: true},
  name: { type: String, required: true },  
});

export const Category = mongoose.model<ICategory>('Category', categorySchema);