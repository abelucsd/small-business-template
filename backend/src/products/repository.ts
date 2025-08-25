import type { Types } from "mongoose";
import type { CreateProduct, IProduct } from "./model.js"
import { Product } from "./model.js";

export const createProduct = async(productData: CreateProduct): Promise<IProduct> => {  
  const product = await Product.create(productData);
  return product;
};

export const getProducts = async (): Promise<IProduct[]> => {
  const products = await Product.find({});
  return products;
};

export const getProductById = async (_id: Types.ObjectId): Promise<IProduct | null> => {
  const product = await Product.findById(_id);
  return product;
};

export const updateProduct = async (_id: Types.ObjectId, productData: Partial<CreateProduct>): Promise<IProduct | null> => {
  const product = await Product.findByIdAndUpdate({_id}, {$set: productData}, {new: true});
  return product;
};

export const deleteProduct = async (_id: Types.ObjectId): Promise<IProduct | null> => {
  const result = await Product.findByIdAndDelete(_id);
  return result;
};