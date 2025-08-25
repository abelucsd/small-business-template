import type { Request, Response, NextFunction} from 'express';
import { describe, it, expect, vi, beforeAll, beforeEach } from 'vitest';
import type { Product, IProduct } from '../model.js';
import * as productController from '../controller.js';
import * as productService from '../service.js';
import { Types } from 'mongoose';
import { ICategory } from '../../categories/model.js';
import * as categoryService from '../../categories/service.js';

import { getCategoryByName } from '../../categories/service.js';



// const fetchData = async (name: string): Promise<ICategory> => {
//   return new Promise(resolve => setTimeout(() => resolve(testCategories[0]), 100));
// };

describe('Product Controller', () => {
  
  const testCategories: ICategory[] = [
    {
      _id: new Types.ObjectId('64f7f6d4e0f1b2a3c4d5e6f7'),
      id: 'cat-01',
      name: 'sports'
    }, 
    {
      _id: new Types.ObjectId('64f7f6d4e0f1b2a3c4d5e6f2'),
      id: 'cat-02',
      name: 'health'      
    }
  ];
  
  const testProducts: IProduct[] = [
    {
      _id: new Types.ObjectId('64f7f6d4e0f1b2a3c4d5e6f7'),
      id: 'prod-01',
      categoryId: new Types.ObjectId('64f7f6d4e0f1b2a3c4d5e6fa'),
      name: 'product-test',
      price: 4,
      attributes: {size: 'md'}
    }, 
    {
      _id: new Types.ObjectId('64f7f6d4e0f1b2a3c4d5e6f2'),
      id: 'prod-02',
      categoryId: new Types.ObjectId('64f7f6d4e0f1b2a3c4d5e6f2'),
      name: 'product-test-02',
      price: 10,
      attributes: {size: 'lg'}
    }
  ];
  let req: Request;
  const mockResponse = () => {
    const res: any = {};
    res.status = vi.fn().mockReturnValue(res);
    res.json = vi.fn().mockReturnValue(res);
    return res;
  };  
  let next: NextFunction;
    
  beforeAll(() => {    
    vi.clearAllMocks();    
  });
  beforeEach(() => {
    req = {} as Request; 
    next = vi.fn();
  });

  describe('Create Product', async () => {
    it('should return 201', async () => {
      const newProduct = testProducts[0]!;
      req.body = newProduct;
      const res = mockResponse();

      vi.spyOn(categoryService, 'getCategoryByName').mockResolvedValue(testCategories[0]);
      
      vi.spyOn(productService, 'createProduct').mockResolvedValue(newProduct);      
  
      await productController.createProduct(req, res, next);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(newProduct);
    });
  });

  describe('Get Categories', async () => {
    it('should return 200', async () => {
      const newProducts = testProducts;
      req.body = newProducts;
      const res = mockResponse();
      vi.spyOn(productService, 'getProducts').mockResolvedValue(newProducts);

      await productController.getProducts(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(newProducts);
    });
  });

  describe('Get Product by ID', async () => {
    it('should return 200', async () => {
      const newProduct = testProducts[0]!;
      req.params = {
        id: newProduct._id.toString()
      };
      const res = mockResponse();
      vi.spyOn(productService, 'getProductById').mockResolvedValue(newProduct);

      await productController.getProductById(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(newProduct);
    });
    it('should return 404', async () => {
      const newProduct = testProducts[0]!;
      req.params = {
        id: newProduct._id.toString()
      };
      const res = mockResponse();
      vi.spyOn(productService, 'getProductById').mockResolvedValue(null);

      await productController.getProductById(req, res, next);

      expect(res.status).toHaveBeenCalledWith(404);      
    });
  });

  describe('Update Product by ID', async () => {
    it('should return 200', async () => {
      const newProduct:IProduct = testProducts[0]!;
      const updatedProduct = { ...newProduct, firstname: 'Foo3' };
      const res = mockResponse();   
      req.params = {
        id: newProduct._id.toString()
      };
      req.body = newProduct;
      vi.spyOn(productService, 'updateProduct').mockResolvedValue(updatedProduct);

      await productController.updateProduct(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(updatedProduct);
    })
    it('should return 404', async () => {
      const newProduct:IProduct = testProducts[0]!;
      const updatedProduct = { ...newProduct, firstname: 'Foo3' };
      const res = mockResponse();   
      req.params = {
        id: newProduct._id.toString()
      };
      req.body = newProduct;
      vi.spyOn(productService, 'updateProduct').mockResolvedValue(null);

      await productController.updateProduct(req, res, next);

      expect(res.status).toHaveBeenCalledWith(404);      
    })
  });

  describe('Delete Product by ID', async () => {
    it('should return 200', async () => {
      const newProduct = testProducts[0]!;
      req.params = {
        id: newProduct._id.toString()
      };
      const res = mockResponse();
      vi.spyOn(productService, 'deleteProduct').mockResolvedValue(newProduct);

      await productController.deleteProduct(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(`Deleted Product with ID ${newProduct._id}`);
    });
    it('should return 404', async () => {
      const newProduct = testProducts[0]!;
      req.params = {
        id: newProduct._id.toString()
      };
      const res = mockResponse();

      vi.spyOn(productService, 'deleteProduct').mockResolvedValue(null);

      await productController.deleteProduct(req, res, next);
      expect(res.status).toHaveBeenCalledWith(404);      
    });
  });
});