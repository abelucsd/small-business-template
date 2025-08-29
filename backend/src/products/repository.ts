import type { FilterQuery, Types } from "mongoose";
import type { CreateProduct, IProduct } from "./model.js"
import type { ProductResponse } from "./types.js";
import { Product } from "./model.js";


export const createProduct = async(productData: CreateProduct): Promise<IProduct> => {  
  const product = await Product.create(productData);
  return product;
};


export const getProducts = async (query: FilterQuery<IProduct>): Promise<ProductResponse[]> => {
  const productsRaw = await Product.find(query)
    .populate("categoryId", "name")
    .lean()
    .exec();
    
  const products: ProductResponse[] = productsRaw.map(p => ({
    ...p,
    categoryId: p.categoryId as any, // we know at runtime it has name    
    category: (p.categoryId as any).name
  }));

  return products;
};

export const getFeaturedProducts = async (): Promise<IProduct[]> => {
  const products = await Product.find({isFeatured: true})
    .populate("categoryId", "name")
    .lean()
    .exec();
  return products;
};

export const getProductById = async (_id: Types.ObjectId): Promise<IProduct | null> => {
  const product = await Product.findById(_id)
    .populate("categoryId", "name")
    .lean()
    .exec();
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