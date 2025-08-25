import type { Types } from "mongoose";
import type { CreateCategory, ICategory } from "./model.js"
import { Category } from "./model.js";

export const createCategory = async(categoryData: CreateCategory): Promise<ICategory> => {  
  const category = await Category.create(categoryData);
  return category;
};

export const getCategories = async (): Promise<ICategory[]> => {
  const categories = await Category.find({});
  return categories;
};

export const getCategoryById = async (_id: Types.ObjectId): Promise<ICategory | null> => {
  const category = await Category.findById(_id);
  return category;
};

export const getCategoryByName = async (name: string): Promise<ICategory | null> => {
  const category = await Category.findOne({name: name});
  return category;
};

export const updateCategory = async (_id: Types.ObjectId, categoryData: Partial<CreateCategory>): Promise<ICategory | null> => {
  const category = await Category.findByIdAndUpdate({_id}, {$set: categoryData}, {new: true});
  return category;
};

export const deleteCategory = async (_id: Types.ObjectId): Promise<ICategory | null> => {
  const result = await Category.findByIdAndDelete(_id);
  return result;
};