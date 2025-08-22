import type { Request, Response, NextFunction} from 'express';
import { describe, it, expect, vi, beforeAll, beforeEach } from 'vitest';
import type { ICustomer } from '../model.js';
import * as customerController from '../controller.js';
import * as customerService from '../service.js';
import * as userService from '../../users/service.js';
import { Types } from 'mongoose';
import { IUser } from '../../users/model.js';

describe('Customer Controller', () => {
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

  describe('Create Customer', async () => {
    it('should return 201 with email found', async () => {
      const newCustomer = testCustomers[0]!;
      const newUser = testUsers[0]!;
      req.body = newCustomer;
      console.log(req.body)
      const customerEmail = 'foobar@email.com';
      req.body = {
        firstname: 'Foo',
        lastname: 'Bar',
        email: customerEmail,
        password: 'testpassword',
      };

      vi.spyOn(userService, 'getUserByEmail').mockResolvedValue(newUser);

      // vi.spyOn(userService, 'createUser').mockResolvedValue(newUser);

      const res = mockResponse();
      vi.spyOn(customerService, 'createCustomer').mockResolvedValue(newCustomer);      
  
      await customerController.createCustomer(req, res, next);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(newCustomer);
    });

    it('should return 201 with email not found', async () => {
      const newCustomer = testCustomers[0]!;
      const newUser = testUsers[0]!;
      req.body = newCustomer;
      console.log(req.body)
      const customerEmail = 'foobar@email.com';
      req.body = {
        firstname: 'Foo',
        lastname: 'Bar',
        email: customerEmail,
        password: 'testpassword',
      };      

      vi.spyOn(userService, 'createUser').mockResolvedValue(newUser);

      const res = mockResponse();
      vi.spyOn(customerService, 'createCustomer').mockResolvedValue(newCustomer);      
  
      await customerController.createCustomer(req, res, next);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(newCustomer);
    });
  })
  

  describe('Get Customers', async () => {
    it('should return 200', async () => {
      const newCustomers = testCustomers;
      req.body = newCustomers;
      const res = mockResponse();
      vi.spyOn(customerService, 'getCustomers').mockResolvedValue(newCustomers);

      await customerController.getCustomers(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(newCustomers);
    });
  });

  describe('Get Customer by ID', async () => {
    it('should return 200', async () => {
      const newCustomer = testCustomers[0]!;
      req.params = {
        id: newCustomer._id.toString()
      };
      const res = mockResponse();
      vi.spyOn(customerService, 'getCustomerById').mockResolvedValue(newCustomer);

      await customerController.getCustomerById(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(newCustomer);
    });
    it('should return 404', async () => {
      const newCustomer = testCustomers[0]!;
      req.params = {
        id: newCustomer._id.toString()
      };
      const res = mockResponse();
      vi.spyOn(customerService, 'getCustomerById').mockResolvedValue(null);

      await customerController.getCustomerById(req, res, next);

      expect(res.status).toHaveBeenCalledWith(404);      
    });
  });

  // describe('Update Customer by ID', async () => {
  //   it('should return 200', async () => {
  //     const newCustomer:ICustomer = testCustomers[0]!;
  //     const updatedCustomer = { ...newCustomer, firstname: 'Foo3' };
  //     const res = mockResponse();   
  //     req.params = {
  //       id: newCustomer._id.toString()
  //     };
  //     req.body = newCustomer;
  //     vi.spyOn(customerService, 'updateCustomer').mockResolvedValue(updatedCustomer);

  //     await customerController.updateCustomer(req, res, next);

  //     expect(res.status).toHaveBeenCalledWith(200);
  //     expect(res.json).toHaveBeenCalledWith(updatedCustomer);
  //   })

  //   it('should return 404', async () => {
  //     const newCustomer:ICustomer = testCustomers[0]!;
  //     const updatedCustomer = { ...newCustomer, firstname: 'Foo3' };
  //     const res = mockResponse();   
  //     req.params = {
  //       id: newCustomer._id.toString()
  //     };
  //     req.body = newCustomer;
  //     vi.spyOn(customerService, 'updateCustomer').mockResolvedValue(null);

  //     await customerController.updateCustomer(req, res, next);

  //     expect(res.status).toHaveBeenCalledWith(404);      
  //   })
  // });

  describe('Delete Customer by ID', async () => {
    it('should return 200', async () => {
      const newCustomer = testCustomers[0]!;
      req.params = {
        id: newCustomer._id.toString()
      };
      const res = mockResponse();
      vi.spyOn(customerService, 'deleteCustomer').mockResolvedValue(newCustomer);

      await customerController.deleteCustomer(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(`Deleted Customer with ID ${newCustomer._id}`);
    });
    it('should return 404', async () => {
      const newCustomer = testCustomers[0]!;
      req.params = {
        id: newCustomer._id.toString()
      };
      const res = mockResponse();

      vi.spyOn(customerService, 'deleteCustomer').mockResolvedValue(null);

      await customerController.deleteCustomer(req, res, next);
      expect(res.status).toHaveBeenCalledWith(404);      
    });
  });
});