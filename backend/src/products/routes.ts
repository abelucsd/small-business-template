import express from 'express';
import * as productController from './controller.js';

export const productRouter = express.Router();

productRouter.post('/', productController.createProduct);
productRouter.get('/', productController.getProducts);
productRouter.get('/featured', productController.getFeaturedProducts);
productRouter.get('/:id', productController.getProductById);
productRouter.put('/:id', productController.updateProduct);
productRouter.delete('/:id', productController.deleteProduct);