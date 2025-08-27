import type { CreateProduct, IProduct } from "./model.js";
import { Product } from "./model.js";
import { getNextId } from "../shared/counter.model.js";
import { CustomError } from "../shared/CustomError.js";
import { appLogger } from "../utils/logger.js";
import type { Types } from "mongoose";
import * as repository from "./repository.js"

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

export const getProducts = async (): Promise<IProduct[]> => {
  try {
    logger.info(`[getProducts] Returning Product(s).`);
    return await repository.getProducts();
  } catch (error) {
    const err = new CustomError('Failed to fetch Products', 500);
    throw err;
  } 
};

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