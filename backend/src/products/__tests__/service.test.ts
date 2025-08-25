import { describe, it, expect, vi, beforeAll } from 'vitest';
import type { CreateProduct, IProduct } from '../model.js';
import { Product } from '../model.js';
import * as productService from '../service.js';
import * as counterService from '../../shared/counter.model.js';
import * as productRepository from '../repository.js';
import { ObjectId, Types } from 'mongoose';


describe('Product Service', () => {
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

  beforeAll(() => {
    vi.clearAllMocks();
    vi.resetModules()
  });

  describe('Create Products', () => {
    it('Should create a new Products', async () => {      
      const newProducts: CreateProduct = testProducts[0]!;

      vi.spyOn(counterService, 'getNextId').mockResolvedValue(1);

      vi.spyOn(productRepository, 'createProduct').mockResolvedValue(testProducts[0]);

      const product = await productService.createProduct(newProducts);      

      expect(product.id).toBe(newProducts.id);      
    });
  });

  describe('Get Products', () => {
    it('Should return all the Productss', async () => {
      const newProducts: IProduct[] = testProducts;            
      
      vi.spyOn(productRepository, 'getProducts').mockResolvedValue(testProducts);

      const products = await productService.getProducts();

      expect(products).toBe(newProducts);      
    });
  });

  describe('Get Products by ID', () => {
    it('Should return a Products by ID', async () => {
      const newProduct: IProduct = testProducts[0]!;
      // Products.findOne = vi.fn().mockResolvedValue(newProducts);

      vi.spyOn(productRepository, 'getProductById').mockResolvedValue(testProducts[0]);

      const products = await productService.getProductById(newProduct._id);

      expect(products).toBe(newProduct);
    });
  });

  describe('Update Products by ID', () => {
    it('Should update a Products by ID', async () => {
      const newProduct: IProduct = testProducts[0]!;
      const updatedProduct: IProduct = { ...newProduct, name: 'sports' };
      vi.spyOn(productRepository, 'updateProduct').mockResolvedValue(updatedProduct);

      const product = await productService.updateProduct(updatedProduct._id, updatedProduct);

      expect(product!.name).toEqual(updatedProduct.name);
    })
  });

  describe('Delete Products by ID', () => {
    it('Should delete a Products by ID', async () => {
      const newProduct: IProduct = testProducts[0]!;

      vi.spyOn(productRepository, 'deleteProduct').mockResolvedValue(newProduct);      
      
      const deleted = await productService.deleteProduct(newProduct._id);
      expect(deleted).toBe(newProduct);
    });
  });
});