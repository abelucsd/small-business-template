import type { Request, Response, NextFunction } from 'express';
import * as categoryService from './service.js';
import { appLogger } from '../utils/logger.js';
import { Types } from 'mongoose';

const logger = appLogger.child({ service: 'Category-controller' });


export const createCategory = async( req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    logger.info('[createCategory] Received request to create a new Category.');

    const { name } = req.body;
    
    const newCategory = await categoryService.createCategory({ name });

    logger.info(`[createCategory] Successfully created Category with ID: ${newCategory._id}`);
    res.status(201).json(newCategory);
  } catch (error) {    
    next(error);
  }
};

export const getCategories = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    logger.info('[getCategorys] Received request to get all Category.');
    const search = req.query?.search as string | undefined;
    const page = parseInt(req.query?.page as string | '1');
    const limit = parseInt(req.query?.limit as string | '10');
    
    const {categories, total} = await categoryService.getCategories(search, page, limit);

    logger.info(`[getCategory] Successfully fetched Category(s).`);
    res.status(200).json({categories, total});
  } catch (error) {        
    next(error);
  }
};

export const getCategoryById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = req.params.id;
    if (id == null || !Types.ObjectId.isValid(id)) {
      res.status(400).send('Invalid Category ID');
      return;
    }
    const _id: Types.ObjectId = new Types.ObjectId(id);

    const category = await categoryService.getCategoryById(_id);
    if (!category) {
      res.status(404).json({ message: 'Category not found' });
    }

    res.status(200).json(category);
  } catch (error) {
    next(error);
  }
};

export const updateCategory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = req.params.id;
    if (id == null || !Types.ObjectId.isValid(id)) {
      res.status(400).send('Invalid Category ID');
      return;
    }
    const _id: Types.ObjectId = new Types.ObjectId(id);
    const updatedCategory = await categoryService.updateCategory(_id, req.body);
    if (!updatedCategory) {
      res.status(404).json({ message: 'Category not found' });
    }    

    res.status(200).json(updatedCategory);
  } catch (error) {
    next(error);
  }
};

export const deleteCategory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = req.params.id;
    if (id == null || !Types.ObjectId.isValid(id)) {
      res.status(400).send('Invalid Category ID');
      return;
    }
    const _id: Types.ObjectId = new Types.ObjectId(id);
    const deletedCategory = await categoryService.deleteCategory(_id);
    if (deletedCategory == null) {
      res.status(404).json({ message: 'Category not found' });
    }    

    res.status(200).json(`Deleted Category with ID ${deletedCategory!._id}`);
  } catch (error) {
    next(error);
  }
};