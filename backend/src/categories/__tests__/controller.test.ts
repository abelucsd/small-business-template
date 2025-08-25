import type { Request, Response, NextFunction} from 'express';
import { describe, it, expect, vi, beforeAll, beforeEach } from 'vitest';
import type { ICategory } from '../model.js';
import * as categoryController from '../controller.js';
import * as categoryService from '../service.js';
import { Types } from 'mongoose';

describe('Category Controller', () => {
  const testICategorys: ICategory[] = [
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

  describe('Create Category', async () => {
    it('should return 201', async () => {
      const newCategory = testICategorys[0]!;
      req.body = newCategory;
      const res = mockResponse();
      vi.spyOn(categoryService, 'createCategory').mockResolvedValue(newCategory);      
  
      await categoryController.createCategory(req, res, next);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(newCategory);
    });
  })

  describe('Get Categories', async () => {
    it('should return 200', async () => {
      const newCategorys = testICategorys;
      req.body = newCategorys;
      const res = mockResponse();
      vi.spyOn(categoryService, 'getCategories').mockResolvedValue(newCategorys);

      await categoryController.getCategories(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(newCategorys);
    });
  });

  describe('Get Category by ID', async () => {
    it('should return 200', async () => {
      const newCategory = testICategorys[0]!;
      req.params = {
        id: newCategory._id.toString()
      };
      const res = mockResponse();
      vi.spyOn(categoryService, 'getCategoryById').mockResolvedValue(newCategory);

      await categoryController.getCategoryById(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(newCategory);
    });
    it('should return 404', async () => {
      const newCategory = testICategorys[0]!;
      req.params = {
        id: newCategory._id.toString()
      };
      const res = mockResponse();
      vi.spyOn(categoryService, 'getCategoryById').mockResolvedValue(null);

      await categoryController.getCategoryById(req, res, next);

      expect(res.status).toHaveBeenCalledWith(404);      
    });
  });

  describe('Update Category by ID', async () => {
    it('should return 200', async () => {
      const newCategory:ICategory = testICategorys[0]!;
      const updatedCategory = { ...newCategory, firstname: 'Foo3' };
      const res = mockResponse();   
      req.params = {
        id: newCategory._id.toString()
      };
      req.body = newCategory;
      vi.spyOn(categoryService, 'updateCategory').mockResolvedValue(updatedCategory);

      await categoryController.updateCategory(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(updatedCategory);
    })
    it('should return 404', async () => {
      const newCategory:ICategory = testICategorys[0]!;
      const updatedCategory = { ...newCategory, firstname: 'Foo3' };
      const res = mockResponse();   
      req.params = {
        id: newCategory._id.toString()
      };
      req.body = newCategory;
      vi.spyOn(categoryService, 'updateCategory').mockResolvedValue(null);

      await categoryController.updateCategory(req, res, next);

      expect(res.status).toHaveBeenCalledWith(404);      
    })
  });

  describe('Delete Category by ID', async () => {
    it('should return 200', async () => {
      const newCategory = testICategorys[0]!;
      req.params = {
        id: newCategory._id.toString()
      };
      const res = mockResponse();
      vi.spyOn(categoryService, 'deleteCategory').mockResolvedValue(newCategory);

      await categoryController.deleteCategory(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(`Deleted Category with ID ${newCategory._id}`);
    });
    it('should return 404', async () => {
      const newCategory = testICategorys[0]!;
      req.params = {
        id: newCategory._id.toString()
      };
      const res = mockResponse();

      vi.spyOn(categoryService, 'deleteCategory').mockResolvedValue(null);

      await categoryController.deleteCategory(req, res, next);
      expect(res.status).toHaveBeenCalledWith(404);      
    });
  });
});