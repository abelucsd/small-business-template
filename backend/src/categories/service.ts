import type { CreateCategory, ICategory } from "./model.js";
import { Category } from "./model.js";
import { getNextId } from "../shared/counter.model.js";
import { CustomError } from "../shared/CustomError.js";
import { appLogger } from "../utils/logger.js";
import type { FilterQuery, Types } from "mongoose";
import * as repository from "./repository.js"

const logger = appLogger.child({ service: 'category' });

export const createCategory = async (categoryData: CreateCategory): Promise<ICategory> => {
  try {    
    const nextId = await getNextId('Category');
    const newCategory = {...categoryData, id: `Category-${nextId}`};
    logger.info(`[createCategory] Creating Category ${newCategory.id}`);    
    const category = await repository.createCategory(newCategory);
    logger.info(`[createCategory] Created Category ${newCategory.id}`);
    return category;
  } catch (error) {    
    const err = new CustomError('Failed to create Category', 400);    
    throw err;
  }
};

export const getCategories = async (search?: string, page?: number, limit?: number): Promise<{categories: ICategory[], total: number}> => {
  try {
    logger.info(`[getCategorys] Returning Category(s).`);
    const query: FilterQuery<ICategory> = {}
    if (search) {
      query.name = {$regex: search, $options: 'i'};
    }
    const pageNumber = page ?? 1;
    const perPage = limit ?? Number.MAX_SAFE_INTEGER;        
    const skip = (pageNumber - 1) * perPage;

    const [categories, total] = await Promise.all([
      await repository.getCategories(query, skip, perPage),
      await repository.countCategoryDocuments(query)      
    ])

    return {categories, total}
  } catch (error) {
    const err = new CustomError('Failed to fetch Categorys', 500);
    throw err;
  } 
};

export const getCategoryById = async (_id: Types.ObjectId): Promise<ICategory | null> => {
  try {
    logger.info(`[getCategoryById] Fetching Category with ID: ${_id}`);    
    return await repository.getCategoryById(_id);
  } catch (error) {
    const err = new CustomError('Failed to fetch category by ID', 404);      
    throw err;
  }
};

export const getCategoryByName = async (name: string): Promise<ICategory | null> => {
  try {
    logger.info(`[getCategoryByName] Fetching Category by name: ${name}`);
    const result = await repository.getCategoryByName(name);
    return result;
  } catch (error) {
    const err = new CustomError('Failed to fetch category by name', 404);
    throw err;
  }
}

export const updateCategory = async (_id: Types.ObjectId, CategoryData: Partial<CreateCategory>): Promise<ICategory | null> => {
  try {
    logger.info(`[updateCategory] Updating Category with ID: ${_id}`);
    const category = await repository.updateCategory(_id, CategoryData);
    logger.info(`[updateCategory] Updated Category with ID: ${_id}`);
    return category;
  } catch (error) {
    const err = new CustomError('Failed to update Category', 404);      
    throw err;
  }
};

export const deleteCategory = async (_id: Types.ObjectId): Promise<ICategory | null> => {
  try {
    logger.info(`[deleteCategory] Delete Category with ID: ${_id}`);
    const result = await repository.deleteCategory(_id);
    logger.info(`[deleteCategory] Deleted Category with ID: ${_id}`);
    return result;
  } catch (error) {
    const err = new CustomError('Failed to delete Category.', 404);
    throw err;
  }
};