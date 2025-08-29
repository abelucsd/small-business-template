import type { FilterQuery, Types } from "mongoose";
import type { CreateCategory, ICategory } from "./model.js"
import { Category } from "./model.js";

export const createCategory = async(categoryData: CreateCategory): Promise<ICategory> => {  
  const category = await Category.create(categoryData);
  return category;
};

export const getCategories = async (query: FilterQuery<ICategory>, skip: number, limit: number): Promise<ICategory[]> => {
  const categories = await Category.find(query)
    .skip(skip)
    .limit(limit)
    .exec();
  
  return categories;
};

export const countCategoryDocuments = async (query: FilterQuery<ICategory>): Promise<number> => {
  const total = await Category.countDocuments(query);
  return total;
}

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