import type { Request, Response, NextFunction } from 'express';
import * as productService from './service.js';
import { appLogger } from '../utils/logger.js';
import { Types } from 'mongoose';
import { getCategoryByName } from '../categories/service.js';

const logger = appLogger.child({ service: 'Product-controller' });


export const createProduct = async( req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    logger.info('[createProduct] Received request to create a new Product.');

    const { name, price, category, attributes } = req.body;

    // Check if category exists.
    const categoryObject = await getCategoryByName(name);
    if (!categoryObject) {
      res.status(404).json({ message:'Category not found' });      
    }

    const categoryId = categoryObject!._id;
    // likely never to run
    if (!categoryId) {
      res.status(404).json({ message:'Category contains missing field: id' });
    }
    
    const newProduct = await productService.createProduct({ name, price, categoryId, attributes });

    logger.info(`[createProduct] Successfully created Product with ID: ${newProduct._id}`);
    res.status(201).json(newProduct);
  } catch (error) {    
    next(error);
  }
};

export const getProducts = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    logger.info('[getProducts] Received request to get all Product.');
    
    const Products = await productService.getProducts();

    logger.info(`[getProduct] Successfully fetched Product(s).`);
    res.status(200).json(Products);
  } catch (error) {        
    next(error);
  }
};

export const getProductById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = req.params.id;
    if (id == null || !Types.ObjectId.isValid(id)) {
      res.status(400).send('Invalid Product ID');
      return;
    }
    const _id: Types.ObjectId = new Types.ObjectId(id);

    const Product = await productService.getProductById(_id);
    if (!Product) {
      res.status(404).json({ message: 'Product not found' });
    }

    res.status(200).json(Product);
  } catch (error) {
    next(error);
  }
};

export const updateProduct = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = req.params.id;
    if (id == null || !Types.ObjectId.isValid(id)) {
      res.status(400).send('Invalid Product ID');
      return;
    }
    const _id: Types.ObjectId = new Types.ObjectId(id);
    const updatedProduct = await productService.updateProduct(_id, req.body);
    if (!updatedProduct) {
      res.status(404).json({ message: 'Product not found' });
    }    

    res.status(200).json(updatedProduct);
  } catch (error) {
    next(error);
  }
};

export const deleteProduct = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = req.params.id;
    if (id == null || !Types.ObjectId.isValid(id)) {
      res.status(400).send('Invalid Product ID');
      return;
    }
    const _id: Types.ObjectId = new Types.ObjectId(id);
    const deletedProduct = await productService.deleteProduct(_id);
    if (deletedProduct == null) {
      res.status(404).json({ message: 'Product not found' });
    }    

    res.status(200).json(`Deleted Product with ID ${deletedProduct!._id}`);
  } catch (error) {
    next(error);
  }
};