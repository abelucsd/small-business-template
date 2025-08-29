import { describe, it, expect, vi, beforeAll } from 'vitest';
import type { CreateCategory, ICategory } from '../model.js';
import { Category } from '../model.js';
import * as categoryService from '../service.js';
import * as counterService from '../../shared/counter.model.js';
import * as categoryRepository from '../../categories/repository.js';
import { ObjectId, Types } from 'mongoose';


describe('Category Service', () => {
  const testCategories: ICategory[] = [
    {
      _id: new Types.ObjectId('64f7f6d4e0f1b2a3c4d5e6f7'),
      id: 'cat-01',
      name: 'electronics'
    }, 
    {
      _id: new Types.ObjectId('64f7f6d4e0f1b2a3c4d5e6f2'),
      id: 'cat-02',
      name: 'health'
    }
  ];

  beforeAll(() => {
    vi.clearAllMocks();
    vi.resetModules()
  });

  describe('Create Category', () => {
    it('Should create a new Category', async () => {      
      const newCategory: CreateCategory = testCategories[0]!;

      vi.spyOn(counterService, 'getNextId').mockResolvedValue(1);

      vi.spyOn(categoryRepository, 'createCategory').mockResolvedValue(testCategories[0]);

      const category = await categoryService.createCategory(newCategory);      

      expect(category.id).toBe(newCategory.id);      
    });
  });

  describe('Get Categories', () => {
    it('Should return all the Categories', async () => {
      const newCategories: ICategory[] = testCategories;
      Category.find = vi.fn().mockResolvedValue(newCategories);
      const mockTotal = 10;
      
      vi.spyOn(categoryRepository, 'getCategories').mockResolvedValue(testCategories);
      vi.spyOn(categoryRepository, 'countCategoryDocuments').mockResolvedValue(mockTotal);

      const {categories, total} = await categoryService.getCategories();

      expect(categories).toBe(newCategories);
      expect(total).toBe(mockTotal);
    });
  });

  describe('Get Category by ID', () => {
    it('Should return a Category by ID', async () => {
      const newCategory: ICategory = testCategories[0]!;
      // Category.findOne = vi.fn().mockResolvedValue(newCategory);

      vi.spyOn(categoryRepository, 'getCategoryById').mockResolvedValue(testCategories[0]);

      const category = await categoryService.getCategoryById(newCategory._id);

      expect(category).toBe(newCategory);
    });
  });

  describe('Update Category by ID', () => {
    it('Should update a Category by ID', async () => {
      const newCategory: ICategory = testCategories[0]!;
      const updatedCategory: ICategory = { ...newCategory, name: 'sports' };
      vi.spyOn(categoryRepository, 'updateCategory').mockResolvedValue(updatedCategory);

      const category = await categoryService.updateCategory(updatedCategory._id, updatedCategory);

      expect(category!.name).toEqual(updatedCategory.name);
    })
  });

  describe('Delete Category by ID', () => {
    it('Should delete a Category by ID', async () => {
      const newCategory: ICategory = testCategories[0]!;

      vi.spyOn(categoryRepository, 'deleteCategory').mockResolvedValue(newCategory);      
      
      const deleted = await categoryService.deleteCategory(newCategory._id);
      expect(deleted).toBe(newCategory);
    });
  });
});