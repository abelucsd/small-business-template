import express from 'express';
import * as categoryController from './controller.js';

export const categoryRouter = express.Router();

categoryRouter.post('/', categoryController.createCategory);
categoryRouter.get('/', categoryController.getCategories);
categoryRouter.get('/:id', categoryController.getCategoryById);
categoryRouter.put('/:id', categoryController.updateCategory);
categoryRouter.delete('/:id', categoryController.deleteCategory);