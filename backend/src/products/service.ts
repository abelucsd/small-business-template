import type { CreateProduct, IProduct } from "./model.js";
import { Product } from "./model.js";
import { getNextId } from "../shared/counter.model.js";
import { CustomError } from "../shared/CustomError.js";
import { appLogger } from "../utils/logger.js";
import type { FilterQuery, Types } from "mongoose";
import * as repository from "./repository.js"
import * as categoryService from '../categories/service.js'
import type { ICategory } from "../categories/model.js";
import type { ProductResponse } from "./types.js";

const logger = appLogger.child({ service: 'product' });

export const createProduct = async (productData: CreateProduct): Promise<IProduct> => {
  try {    
    const nextId = await getNextId('Product');
    let newProduct = null;
    if (productData?.id == null) {      
      newProduct = {...productData, id: `Product-${nextId}`};
    }
    else {
      newProduct = {...productData}
    }
    
    logger.info(`[createProduct] Creating Product ${newProduct.id}`);    
    const product = await repository.createProduct(newProduct);
    logger.info(`[createProduct] Created Product ${newProduct.id}`);
    return product;
  } catch (error) {    
    const err = new CustomError(`Failed to create Product; ${error} `, 400);    
    throw err;
  }
};

export const getProducts = async (category?: string, search?: string, page?: number, limit?: number): Promise<{products: ProductResponse[], total: number}> => {
  try {
    logger.info(`[getProducts] Returning Product(s).`);
    let categoryId: Types.ObjectId | undefined;

    let categoryObject: ICategory | undefined;
    if (category) {
      logger.info(`[getProducts] Product category ${category}.`)
      const categoryObject = await categoryService.getCategoryByName(category);
      
      if(!categoryObject) throw new Error("Category not found");      
      categoryId = categoryObject._id;
    }
    const query: FilterQuery<IProduct> = {};
    if (categoryId) query.categoryId = categoryId;

    // search and pagination
    if (search) {
      query.name = {$regex: search, $options: 'i'}
    }

    const pageNumber = page ?? 1;
    const perPage = limit ?? Number.MAX_SAFE_INTEGER;
    const skip = (pageNumber - 1) * perPage; 
    
    const [products, total] = await Promise.all([
      await repository.getProducts(query, skip, perPage),
      await repository.countProductDocuments(query),
    ]);

    return {products, total}
  } catch (error) {
    const err = new CustomError(`Failed to fetch Products ${error}`, 500);
    throw err;
  } 
};

export const getFeaturedProducts = async (): Promise<IProduct[]> => {
  try {
    logger.info(`[getProducts] Returning featured product(s).`)
    return await repository.getFeaturedProducts();
  } catch (error) {
    const err = new CustomError(`Failed to fetch featured products ${error}`, 500);
    throw err;
  }
}

export const getProductById = async (_id: Types.ObjectId): Promise<IProduct | null> => {
  try {
    logger.info(`[getProductById] Fetching Product with ID: ${_id}`);    
    return await repository.getProductById(_id);
  } catch (error) {
    const err = new CustomError('Failed to fetch customer by ID', 404);      
    throw err;
  }
};

export const updateProduct = async (_id: Types.ObjectId, productData: Partial<CreateProduct>): Promise<IProduct | null> => {
  try {
    logger.info(`[updateProduct] Updating Product with ID: ${_id}`);
    const product = await repository.updateProduct(_id, productData);
    logger.info(`[updateProduct] Updated Product with ID: ${_id}`);
    return product;
  } catch (error) {
    const err = new CustomError('Failed to update Product', 404);      
    throw err;
  }
};

export const deleteProduct = async (_id: Types.ObjectId): Promise<IProduct | null> => {
  try {
    logger.info(`[deleteProduct] Delete Product with ID: ${_id}`);
    const result = await repository.deleteProduct(_id);
    logger.info(`[deleteProduct] Deleted Product with ID: ${_id}`);
    return result;
  } catch (error) {
    const err = new CustomError('Failed to delete Product.', 404);
    throw err;
  }
};