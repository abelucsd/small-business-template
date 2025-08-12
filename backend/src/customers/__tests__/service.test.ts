import { describe, it, expect, vi, beforeAll } from 'vitest';
import type { CreateCustomer, ICustomer } from '../model.js';
import { Customer } from "../model.js"; // Ensure this import is correct and matches the actual export in model.js
import * as customerService from '../service.js';
import * as counterService from '../../shared/counter.model.js';
import { Types } from 'mongoose';
import { User } from '../../users/model.js';


describe('Customer Service', () => {
  const testCustomers: ICustomer[] = [
    {
      _id: new Types.ObjectId('64f7f6d4e0f1b2a3c4d5e6f7'),
      id: 'customer-01',
      userId: new Types.ObjectId('54f7f6d4e0f1b2a3c4d5e6f7')
    }, 
    {
      _id: new Types.ObjectId('64f7f6d4e0f1b2a3c4d5e6f2'),
      id: 'customer-02',
      userId: new Types.ObjectId('54f7f6d4e0f1b2a3c4d5e6f2'),
    }
  ];

  beforeAll(() => {
    vi.clearAllMocks();
  });

  describe('Create Customer', () => {
    it('Should create a new Customer', async () => {      
      const newCustomer: CreateCustomer = testCustomers[0]!;

      vi.spyOn(counterService, 'getNextId').mockResolvedValue(1);    
                  
      Customer.create = vi.fn().mockResolvedValue(newCustomer);

      const createdCustomer = await customerService.createCustomer(newCustomer);      

      expect(createdCustomer.id).toBe(newCustomer.id);
    });
  });

  describe('Get Customers', () => {
    it('Should return all the Customers', async () => {
      const newCustomers: ICustomer[] = testCustomers;
      Customer.find = vi.fn().mockResolvedValue(newCustomers);

      const customers = await customerService.getCustomers();

      console.log(customers)

      expect(customers).toBe(newCustomers);
    });
  });

  describe('Get Customer by ID', () => {
    it('Should return a Customer by ID', async () => {
      const newCustomer: ICustomer = testCustomers[0]!;
      vi.spyOn(Customer, 'findOne').mockResolvedValue(newCustomer);      

      const customer = await customerService.getCustomerById(newCustomer._id);

      expect(customer).toBe(newCustomer);
    });
  });

  describe('Update Customer by ID', () => {
    it('Should update a Customer by ID', async () => {
      const newCustomer: ICustomer = testCustomers[0]!;
      const updatedCustomer: ICustomer = { ...newCustomer, userId: new Types.ObjectId('64f7f6d4e0f1b2a3c4d5e6a2')};
      Customer.findOneAndUpdate = vi.fn().mockResolvedValue(updatedCustomer);      

      const customer = await customerService.updateCustomer(updatedCustomer._id, updatedCustomer);

      expect(customer).toBe(updatedCustomer);
    });
  });

  describe('Delete Customer by ID', () => {
    it('Should delete a Customer by ID', async () => {
      const newCustomer: ICustomer = testCustomers[0]!;
      Customer.findByIdAndDelete = vi.fn().mockResolvedValue(newCustomer);
      
      const deleted = await customerService.deleteCustomer(newCustomer._id);
      expect(deleted).toBe(newCustomer);
    });
  });
});