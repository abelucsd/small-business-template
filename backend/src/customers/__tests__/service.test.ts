import { describe, it, expect, vi, beforeAll } from 'vitest';
import type { CreateCustomer, ICustomer } from '../model.js';
import { Customer } from "../model.js"; // Ensure this import is correct and matches the actual export in model.js
import * as customerService from '../service.js';
import * as counterService from '../../shared/counter.model.js';
import { Types } from 'mongoose';
import { IUser, User } from '../../users/model.js';


describe('Customer Service', () => {
  const testUsers: IUser[] = [
    {
      _id: new Types.ObjectId('64f7f6d4e0f1b2a3c4d5e6f7'),
      id: 'user-01',
      firstname: 'Foo1',
      lastname: 'Bar1',
      email: 'foobar1@gmail.com',
      password: 'properTestPass@1'
    }, 
    {
      _id: new Types.ObjectId('64f7f6d4e0f1b2a3c4d5e6f2'),
      id: 'user-02',
      firstname: 'Foo2',
      lastname: 'Bar2',
      email: 'foobar2@gmail.com',
      password: 'properTestPass@2'
    }
  ];
  const testCustomers: ICustomer[] = [
    {
      _id: new Types.ObjectId('64f7f6d4e0f1b2a3c4d5e6f1'),
      id: 'customer-01',
      userId: testUsers[0]._id
    }, 
    {
      _id: new Types.ObjectId('64f7f6d4e0f1b2a3c4d5e6f3'),
      id: 'customer-02',
      userId: testUsers[1]._id
    }
  ];

  type PopulatedCustomer = Omit<ICustomer, 'userId'> & { userId: IUser };
  const testPopulatedCustomers: PopulatedCustomer[] = [
  {
      _id: new Types.ObjectId(),
      id: "customer-1",
      userId: {
        _id: new Types.ObjectId(),
        id: "user-1",
        firstname: "Foo",
        lastname: "Bar",
        password: "testpassword",
        email: "foobar@gmail.com",
      }
    }
  ];
  const mockCustomers = [
  {
    _id: '64d6fbd89cfa28312abc1234',
    id: 'customer-1',
    userId: {
      _id: '64d6fbd89cfa28312abc5678',
      id: 'user-1',
      firstname: 'Foo',
      lastname: 'Bar',
      password: 'testpassword',
      email: 'foobar@gmail.com',
    }
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